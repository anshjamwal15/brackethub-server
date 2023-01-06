const db = require('../config/db');

module.exports = {
    async createUser(email, password) {
        const checkUser = await db.query('SELECT * FROM users WHERE email = $1', [email]);
        if (checkUser.length === 0) {
            const addUser = await db.query(`INSERT INTO users(email,password,created_date) VALUES ($1,$2,now()) RETURNING *`, [email, password]);
            if (addUser.length > 0) return 'User added Successfully';
        } else {
            return 'User already exists.'
        }
    },

    async findUser(email) {
        return await db.query('SELECT * FROM users WHERE email = $1', [email]);
    }
};