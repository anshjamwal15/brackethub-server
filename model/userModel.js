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

exports.findUserByEmail = async (email) => {
    return await db.query(`SELECT * FROM ${userTable} WHERE email = ?`, [email]);
};

exports.acceptFriendRequest = async (data) => {
    const { userEmail, friendEmail, friendUsername, username } = data;
    // delete from friend Requests table
    // 1st user entry 
    await db.query('delete from friend_requests_by_emails where user_email = ? and accepted = False and friend_email= ?', [userEmail, friendEmail]);
    // 2nd user entry
    await db.query('delete from friend_requests_by_emails where user_email = ? and accepted = True and friend_email= ?', [friendEmail,userEmail]);
    // Add in friends relation tables
    // 1st user entry
    await db.query(`INSERT INTO friends_by_useremail_and_friendemail(user_email,friend_email,created_date,friend_username) 
    VALUES (?,?,toTimestamp(now()),?)`, [userEmail, friendEmail, friendUsername]);
    // 2nd user entry
    await db.query(`INSERT INTO friends_by_useremail_and_friendemail(user_email,friend_email,created_date,friend_username) 
    VALUES (?,?,toTimestamp(now()),?)`, [friendEmail, userEmail, username]);
    return [0];
};

exports.checkFriendExists = async (userEmail, friendEmail) => {
    return await db.query(`SELECT * FROM friends_by_useremail_and_friendemail WHERE user_email = ? and friend_email = ?`, [userEmail, friendEmail]);
};

exports.friendsList = async (email) => {
    return await db.query('SELECT * FROM friends_by_useremail_and_friendemail WHERE user_email = ?', [email]); 
};

exports.sendFriendRequest = async (userEmail, friendEmail) => {
    // 1st user entry
    await db.query(`INSERT INTO friend_requests_by_emails(user_email,friend_email,created_date,accepted) 
    VALUES (?,?,toTimestamp(now()),?)`, [userEmail, friendEmail, true]);
    // 2nd user entry
    await db.query(`INSERT INTO friend_requests_by_emails(user_email,friend_email,created_date,accepted) 
    VALUES (?,?,toTimestamp(now()),?)`, [friendEmail, userEmail, false]);
    return [0];
};

exports.pendingFriendsRequestList = async (userEmail) => {
    return await db.query('SELECT * FROM friend_requests_by_emails WHERE user_email = ? and accepted = ?', [userEmail, false]);
};




