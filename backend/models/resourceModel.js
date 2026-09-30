const pool = require("../config/database");

async function listResources(filters = {}) {
  const values = [];
  const conditions = [
    "r.status = 'approved'"
  ];

  if (filters.projectId) {
    values.push(filters.projectId);
    conditions.push(`r.project_id = $${values.length}`);
  }

  const query = `
    SELECT
      r.id,
      r.title,
      r.description,
      r.file_url,
      r.file_key,
      r.resource_type,
      r.project_id,
      r.download_count,
      r.created_at,
      p.title AS project_title
    FROM resources r
    LEFT JOIN projects p
      ON p.id = r.project_id
    WHERE ${conditions.join(" AND ")}
    ORDER BY r.created_at DESC;
  `;

  const result = await pool.query(query, values);

  return result.rows;
}

async function findResourceById(id) {
  const result = await pool.query(
    `
    SELECT
      r.id,
      r.title,
      r.description,
      r.file_url,
      r.file_key,
      r.resource_type,
      r.project_id,
      r.download_count,
      r.created_at,
      p.title AS project_title
    FROM resources r
    LEFT JOIN projects p
      ON p.id = r.project_id
    WHERE r.id = $1
      AND r.status = 'approved'
    `,
    [id]
  );

  return result.rows[0];
}
async function createResource(data) {
  const result = await pool.query(
    `
    INSERT INTO resources
    (
      title,
      description,
      file_url,
      file_key,
      resource_type,
      project_id,
      uploaded_by,
      status
    )
    VALUES
    (
      $1, $2, $3, $4, $5, $6, $7, 'pending'
    )
    RETURNING *;
    `,
    [
      data.title,
      data.description,
      data.fileUrl,
      data.fileKey,
      data.resourceType,
      data.projectId,
      data.uploadedBy
    ]
  );

  return result.rows[0];
}
module.exports = {
  listResources,
  findResourceById,
createResource
};
