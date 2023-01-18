const cassandra = require('cassandra-driver');
require('dotenv').config();

const client = new cassandra.Client({

    credentials: { username: process.env.DB_USER, password: process.env.DB_PASSWORD },
    contactPoints: ['127.0.0.1'],
    localDataCenter: 'datacenter1',
    keyspace: 'ks1'
});

module.exports = {
    async query(text, params) {
        const start = Date.now();
        try {
            const res = await client.execute(text, params);
            const duration = Date.now() - start;
            console.log(
                'executed query',
                { text, duration, rows: res.rowLength }
            );
            return res.rows;
        } catch (error) {
            console.log(`Error in query : ${text}`);
            throw error;
        }
    },
    client
};