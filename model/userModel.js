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
        return await db.query(`INSERT INTO friend_requests(friend_id,created_date,updated_date,user_id) VALUES ($1,now(),now(),$2) RETURNING *`, [friendId,userId]);
    },

    async acceptFriendRequests(userId,friendId) {
        const newFriend = await db.query(`UPDATE friend_requests SET accepted =$1 where user_id=$2 and friend_id=$3 RETURNING *`, [true,userId,friendId]);
        if(newFriend.length > 0) {
            const addedFriend = await db.query(`INSERT INTO user_friends(friend_id,created_date,updated_date,user_id) VALUES ($1,now(),now(),$2) RETURNING *`, [newFriend[0].friend_id,newFriend[0].user_id]);
            if(addedFriend.length > 0) {
                return db.query(`DELETE FROM friend_requests WHERE id =$1 RETURNING *`, [newFriend[0].id]);
            }
        }
    },

    async friendsList(userId) {
        return await db.query('SELECT * FROM user_friends WHERE user_id = $1', [userId]); 
    },

    async checkAvailableChatRoom(userIds) {
        return await db.query('select * from chat_room where $1=ANY(user_ids);', [userIds]); 
    }
};