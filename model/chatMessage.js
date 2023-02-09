const db = require('../config/db');


exports.send_message = async (user_id, receiver_id, message) => {
    await db.query(`INSERT INTO chat_messages (message_id,from_user,to_user,created_date,message) VALUES (9,?,?,toTimestamp(now()),?)`, [user_id,receiver_id,message]);
};

exports.get_last_message = async (user_id, user_id2) => {
    return await db.query(`SELECT * FROM chat_messages WHERE from_user=? and to_user=? ORDER BY created_date DESC LIMIT 1`, [user_id, user_id2]);
};

exports.get_all_messages = async (user_id, user_id2) => {
    return await db.query(`SELECT * FROM chat_messages WHERE from_user=? and to_user=? ORDER BY created_date DESC`, [user_id, user_id2]);
};