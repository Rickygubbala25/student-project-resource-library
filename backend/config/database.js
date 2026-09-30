const { Pool } = require("pg");

const pool = new Pool({
  host: process.env.DATABASE_HOST || "localhost",
  port: Number(process.env.DATABASE_PORT || 5432),
  database: process.env.DATABASE_NAME || "student_project_library",
  user: process.env.DATABASE_USER || "postgres",
  password: process.env.DATABASE_PASSWORD || "",
  max: 10,
  idleTimeoutMillis: 30000
});

pool.on("error", (error) => {
  console.error("Unexpected PostgreSQL pool error:", error);
});

module.exports = pool;
