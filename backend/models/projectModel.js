const pool = require("../config/database");

function buildProjectWhere(query) {
  const conditions = ["p.status = 'approved'"];
  const values = [];

  function addCondition(sql, value) {
    values.push(value);
    conditions.push(sql.replace("?", `$${values.length}`));
  }

  if (query.search) {
    const search = `%${String(query.search).trim()}%`;
    values.push(search);
    const n = values.length;
    conditions.push(`(
      p.title ILIKE $${n}
      OR COALESCE(p.abstract, '') ILIKE $${n}
      OR COALESCE(p.description, '') ILIKE $${n}
      OR COALESCE(p.technologies, '') ILIKE $${n}
      OR COALESCE(p.department, '') ILIKE $${n}
    )`);
  }

  if (query.department) addCondition("p.department ILIKE ?", `%${query.department.trim()}%`);
  if (query.technology) addCondition("p.technologies ILIKE ?", `%${query.technology.trim()}%`);
  if (query.difficulty) addCondition("p.difficulty = ?", query.difficulty.trim());
  if (query.projectType) addCondition("p.project_type = ?", query.projectType.trim());

  return {
    where: conditions.join(" AND "),
    values
  };
}

async function listProjects(query) {
  const limit = Math.min(Math.max(Number(query.limit) || 12, 1), 50);
  const offset = Math.max(Number(query.offset) || 0, 0);
  const { where, values } = buildProjectWhere(query);

  const countResult = await pool.query(
    `SELECT COUNT(*)::int AS total FROM projects p WHERE ${where}`,
    values
  );

  const result = await pool.query(
    `SELECT p.id, p.title, p.abstract, p.problem_statement, p.objectives,
            p.description, p.technologies, p.department, p.difficulty,
            p.project_type, p.download_count, p.created_at
       FROM projects p
      WHERE ${where}
      ORDER BY p.created_at DESC
      LIMIT $${values.length + 1}
      OFFSET $${values.length + 2}`,
    [...values, limit, offset]
  );

  return {
    projects: result.rows,
    total: countResult.rows[0].total,
    limit,
    offset
  };
}

async function findById(id) {
  const result = await pool.query(
    `SELECT p.id, p.title, p.abstract, p.problem_statement, p.objectives,
            p.description, p.technologies, p.department, p.difficulty,
            p.project_type, p.download_count, p.created_at,
            u.full_name AS submitted_by
       FROM projects p
       LEFT JOIN users u ON u.id = p.submitted_by
      WHERE p.id = $1 AND p.status = 'approved'
      LIMIT 1`,
    [id]
  );
  return result.rows[0] || null;
}

async function getStats() {
  const result = await pool.query(`
    SELECT
      (SELECT COUNT(*)::int FROM projects WHERE status = 'approved') AS projects,
      (SELECT COUNT(*)::int FROM resources) AS resources,
      (SELECT COUNT(*)::int FROM users WHERE is_active = TRUE) AS students,
      (SELECT COALESCE(SUM(download_count), 0)::int FROM projects) AS downloads
  `);
  return result.rows[0];
}
async function createProject(data) {
  const result = await pool.query(
    `
    INSERT INTO projects
    (
      title,
      abstract,
      problem_statement,
      objectives,
      description,
      technologies,
      department,
      difficulty,
      project_type,
      submitted_by,
      status
    )
    VALUES
    (
      $1, $2, $3, $4, $5,
      $6, $7, $8, $9, $10, 'pending'
    )
    RETURNING *;
    `,
    [
      data.title,
      data.abstract,
      data.problemStatement,
      data.objectives,
      data.description,
      data.technologies,
      data.department,
      data.difficulty,
      data.projectType,
      data.submittedBy
    ]
  );

  return result.rows[0];
}
async function updateProjectStatus(id, status) {
  const result = await pool.query(
    `
    UPDATE projects
    SET status = $1,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = $2
    RETURNING *;
    `,
    [status, id]
  );

  return result.rows[0];
}
async function listPendingProjects() {
  const result = await pool.query(
    `
    SELECT *
    FROM projects
    WHERE status = 'pending'
    ORDER BY created_at DESC;
    `
  );

  return result.rows;
}
module.exports = { listProjects, findById, getStats,createProject, updateProjectStatus, listPendingProjects };
