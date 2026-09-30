const pool = require("../config/database");

async function findByEmail(email) {
  const result = await pool.query(
    `SELECT id, full_name, email, password_hash, college, department, semester,
            student_id, role, is_active, created_at
       FROM users
      WHERE LOWER(email) = LOWER($1)
      LIMIT 1`,
    [email]
  );
  return result.rows[0] || null;
}

async function findPublicById(id) {
  const result = await pool.query(
    `SELECT id, full_name, email, college, department, semester,
            student_id, role, is_active, created_at
       FROM users
      WHERE id = $1
      LIMIT 1`,
    [id]
  );
  return result.rows[0] || null;
}

async function createUser(user) {
  const result = await pool.query(
    `INSERT INTO users
      (full_name, email, password_hash, college, department, semester, student_id, role)
     VALUES ($1, $2, $3, $4, $5, $6, $7, 'student')
     RETURNING id, full_name, email, college, department, semester, student_id, role, is_active, created_at`,
    [
      user.fullName,
      user.email,
      user.passwordHash,
      user.college || null,
      user.department || null,
      user.semester || null,
      user.studentId || null
    ]
  );
  return result.rows[0];
}

module.exports = { findByEmail, findPublicById, createUser };
