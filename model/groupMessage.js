const db = require('../config/db');


exports.sendMessage = async (group_id, group_name, message,sentBy) => {
    await db.query(`INSERT INTO group_chat_messages (message_id,group_id,group_name,created_date,message,sentby) VALUES (1,?,?,toTimestamp(now()),?,?)`, [group_id,group_name,message,sentBy]);
};

exports.createGroup = async (group_id, group_name,user_id) => {
    /** 
    * @name group_membership table is used for message broadcasting — to figure out who gets the message
    * @name user_membership table is for listing all the groups a user has joined
    */
    await db.query(`INSERT INTO group_membership (group_id,group_name,user_id) VALUES (?,?,?)`, [group_id,group_name,user_id]);
    await db.query(`INSERT INTO user_membership (group_id,user_id) VALUES (?,?)`, [group_id,user_id]);
};

// exports

