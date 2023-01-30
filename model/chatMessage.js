const db = require('../config/db');


exports.sendMessage = async (user_id, receiver_id, message) => {
    await db.query(`INSERT INTO chat_messages (message_id,from_user,to_user,created_date,message) VALUES (1,?,?,toTimestamp(now()),?)`, [user_id,receiver_id,message]);
};

exports.getMessage = async (user_id, user_id2, earliest_message_id) => {};
