const Pool = require('pg').Pool;
require('dotenv').config();

function query(queryString, callbackFunction) {
    const pool = new Pool({
        user: process.env.PGUSER,
        host: process.env.PGHOST,
        database: process.env.PGDATABASE,
        password: process.env.PGPASSWORD,
        port: process.env.PGPORT
    });
    pool.query(queryString, (error, results) => {
        callbackFunction(setResponse(error, results));
    });
}

function setResponse(error, results) {
    return {
        error: error,
        results: results ? results : null
    };
}

module.exports = {
    query
};