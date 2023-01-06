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

    async findUserById(userId) {
        return await db.query('SELECT * FROM users WHERE id = $1', [userId]);
    },

    async findUserByEmail(email) {
        return await db.query('SELECT * FROM users WHERE email = $1', [email]);
    },

    async updateUsername(username, email) {
        return await db.query(`UPDATE users SET username =$1 WHERE email= $2 RETURNING *`, [username, email]);
    },

    async addFriend(userId,friendId) {
        // p1 = my id and p2 = friend id (p1,p2)
        await db.query(`INSERT INTO user_friends(friend_id,created_date,updated_date,user_id) VALUES ($1,now(),now(),$2) RETURNING *`, [userId,friendId]);
        //p1 = friend id and p2 = my id (p1,p2)
        return await db.query(`INSERT INTO user_friends(friend_id,created_date,updated_date,user_id) VALUES ($1,now(),now(),$2) RETURNING *`, [friendId,userId]);
    },

    async friendsList(userId) {
        return await db.query('SELECT * FROM user_friends WHERE user_id = $1 and request_accepted = true', [userId]); 
    }
};