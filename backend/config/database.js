const { Pool, types } = require('pg');
const fs = require('node:fs');
const path = require('node:path');
require('dotenv').config();
// Preserve the API's numeric counts and calendar dates across the migration.
types.setTypeParser(20, Number);
types.setTypeParser(1700, Number);
types.setTypeParser(1082, value => value);
const database = new Pool(process.env.DATABASE_URL ? {
  connectionString: process.env.DATABASE_URL,
  connectionTimeoutMillis: 10000,
} : { database: process.env.PGDATABASE || 'recipe_manager', connectionTimeoutMillis: 5000 });

// Existing routes use question-mark parameters and [rows] results. Adapt that
// small interface while PostgreSQL owns all execution and parameter binding.
const pool = {
  async query(sql, values = []) {
    let position = 0;
    const statement = sql.replace(/\?/g, () => '$' + (++position));
    let result;
    try { result = await database.query(statement, values); }
    catch (error) { if (error.code === '23505') error.code = 'ER_DUP_ENTRY'; throw error; }
    if (result.command === 'INSERT') return [{ insertId: result.rows[0]?.id, affectedRows: result.rowCount }];
    if (result.command === 'DELETE' || result.command === 'UPDATE') return [{ affectedRows: result.rowCount }];
    return [result.rows];
  },
  end: () => database.end(),
};
async function connect() {
  await database.query(fs.readFileSync(path.join(__dirname, '../../database/postgres.sql'), 'utf8'));
}
async function testConnection() { await database.query('SELECT 1'); }
module.exports = { pool, database, connect, testConnection };
