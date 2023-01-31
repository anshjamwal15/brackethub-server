const db = require('../config/db');


exports.sendMessage = async (user_id, receiver_id, message) => {
    await db.query(`INSERT INTO chat_messages (message_id,from_user,to_user,created_date,message) VALUES (7,?,?,toTimestamp(now()),?)`, [user_id,receiver_id,message]);
};

exports.getMessage = async (user_id, user_id2) => {
    return await db.query(`SELECT * FROM chat_messages WHERE from_user=? and to_user=? ORDER BY created_date DESC LIMIT 1`, [user_id, user_id2]);
};
