const db = require('../config/db');

module.exports = {
    async createUser(email, password) {
        const checkUser = await db.query('SELECT * FROM users WHERE email = $1', [email]);
        if (checkUser.length === 0) {
            const addUser = await db.query(`INSERT INTO users(email,password,created_date,updated_date) VALUES ($1,$2,now(),now()) RETURNING *`, [email, password]);
            if (addUser.length > 0) return 'User added Successfully';
        } else {
            return 'User already exists.'
        }
    },

    async findUser(email) {
        return await db.query('SELECT * FROM users WHERE email = $1', [email]);
    },

    async updateUsername(username, email) {
        return await db.query(`UPDATE users SET username =$1 WHERE email= $2 RETURNING *`, [username, email]);
    }
};