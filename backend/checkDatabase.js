require("dotenv").config();

const pool = require("./config/database");

async function checkDatabase() {
  try {
    const result = await pool.query(`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
      ORDER BY table_name;
    `);

    console.log("DATABASE TABLES:");
    console.table(result.rows);

    await pool.end();
  } catch (error) {
    console.error("Database error:", error.message);
    process.exit(1);
  }
}

checkDatabase();
