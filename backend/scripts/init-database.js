const { connect, pool } = require('../config/database');
connect().then(() => console.log('PostgreSQL schema ready.')).catch(error => { console.error(error.message); process.exitCode = 1; }).finally(() => pool.end());
