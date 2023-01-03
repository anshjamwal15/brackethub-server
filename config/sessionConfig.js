const sessionPool = require('pg').Pool;
const session = require('express-session')
const pgSession = require('connect-pg-simple')(session);
const randomString = require('../helper/randomString');
require('dotenv').config();

const sessionDBaccess = new sessionPool({
    user: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    host: process.env.PGHOST,
    port: process.env.PGPORT,
    database: process.env.PGDATABASE,
})

const sessionConfig = {
    store: new pgSession({
        pool: sessionDBaccess,
        tableName: 'user_session',
        createTableIfMissing: true
    }),
    name: 'SID',
    secret: randomString.generate(25),
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7,
        // ame: true,
        secure: false // ENABLE ONLY ON HTTPS
    }
}

module.exports = { sessionConfig }