const db = require('../config/db');


exports.sendMessage = async (group_id, group_name, message,sentBy) => {
    await db.query(`INSERT INTO group_chat_messages (message_id,group_id,group_name,created_date,message,sentby) VALUES (1,?,?,toTimestamp(now()),?,?)`, [group_id,group_name,message,sentBy]);
};

