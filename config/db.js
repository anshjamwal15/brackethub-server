const Pool = require('pg').Pool;
require('dotenv').config();

const pool = new Pool({
    user: process.env.PGUSER,
    host: process.env.PGHOST,
    database: process.env.PGDATABASE,
    password: process.env.PGPASSWORD,
    port: process.env.PGPORT
});

module.exports = {
    async query(text, params) {
        const start = Date.now();
        try {
            const res = await pool.query(text, params);
            const duration = Date.now() - start;
            console.log(
                'executed query',
                {text, duration, rows: res.rowCount}
            );
            return res.rows;
        } catch (error) {
            console.log('error in query', {text})
            throw error;
        }
    }
};