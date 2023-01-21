const db = require('../config/db');
const userTable = 'user_by_email';

exports.createUser = async (email, password) => {
    const checkUser = await this.findUserByEmail(email);
        if (checkUser.rows.length === 0) {
            await db.query(`INSERT INTO ${userTable}(email,password,created_date) VALUES (?,?,toTimestamp(now()))`, [email, password]);
            return 'User added Successfully';
        } else {
            return 'User already exists.'
        }
};

exports.updateUsername = async (username,email) => {
    const checkUser = await this.findUserByEmail(email);
    if (checkUser.rows.length === 0) return [];
    await db.query(`UPDATE ${userTable} SET username =? WHERE email= ?`, [username,email]);
    return [1];
};     

exports.addFriend = async (data) => {
    const { userEmail, friendEmail, friendUsername, username } = data;
    await db.query(`INSERT INTO friends_by_useremail_and_friendemail(user_email,friend_email,created_date,friend_username, username) 
    VALUES (?,?,toTimestamp(now()),?,?)`, [userEmail, friendEmail, friendUsername, username]);
    // User entry
    // await db.query(`INSERT INTO friends_by_useremail(user_email,friend_email,created_date,friend_username, username) 
    // VALUES (?,?,toTimestamp(now()),?,?)`, [userEmail, friendEmail, friendUsername, username]);
    // friend entry 
    // await db.query(`INSERT INTO friends_by_useremail(user_email,friend_email,created_date,friend_username, username) 
    // VALUES (?,?,toTimestamp(now()),?,?)`, [friendEmail, userEmail, username, friendUsername]);
    return [0];
};

exports.checkFriendExists = async (userEmail, friendEmail) => {
    return await db.query(`SELECT * FROM friends_by_useremail_and_friendemail WHERE user_email = ? and friend_email = ?`, [userEmail, friendEmail]);
};

exports.findUserByEmail = async (email) => {
    return await db.query(`SELECT * FROM ${userTable} WHERE email = ?`, [email]);
};

// fix friend table
exports.friendsList = async (email) => {
    return await db.query('SELECT * FROM friends_by_useremail WHERE user_email = ?', [email]); 
};


// module.exports = {



//     async acceptFriendRequests(userId,friendId) {
//         const newFriend = await db.query(`UPDATE friend_requests SET accepted =$1 where user_id=$2 and friend_id=$3 RETURNING *`, [true,userId,friendId]);
//         if(newFriend.length > 0) {
//             const addedFriend = await db.query(`INSERT INTO user_friends(friend_id,created_date,updated_date,user_id) VALUES ($1,now(),now(),$2) RETURNING *`, [newFriend[0].friend_id,newFriend[0].user_id]);
//             if(addedFriend.length > 0) {
//                 return db.query(`DELETE FROM friend_requests WHERE id =$1 RETURNING *`, [newFriend[0].id]);
//             }
//         }
//     },



//     async checkAvailableChatRoom(userIds) {
//         return await db.query('select * from chat_room where $1=ANY(user_ids);', [userIds]); 
//     }
// };