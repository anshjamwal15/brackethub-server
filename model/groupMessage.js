const db = require('../config/db');


/* 
    Save message in db
*/
exports.send_message = async (group_id, group_name, message, sentBy) => {
    await db.query(`INSERT INTO group_chat_messages (group_id,group_name,created_date,message,sentby) VALUES (?,?,toTimestamp(now()),?,?)`, [group_id, group_name, message, sentBy]);
};

/** 
    * @name group_membership table is used for message broadcasting — to figure out who gets the message
    * @name user_membership table is for listing all the groups a user has joined
*/
exports.create_group = async (group_id, group_name, user_id) => {
    await db.query(`INSERT INTO group_membership (group_id,group_name,user_id) VALUES (?,?,?)`, [group_id, group_name, user_id]);
    await db.query(`INSERT INTO user_membership (group_id,user_id) VALUES (?,?)`, [group_id, user_id]);
};

/**  
    find list Groups by user_id
    @param {group_id} group_id will be the uuid 
    @param {user_id} user_id will be the user email
*/
exports.find_groups_by_user_id = async (group_id,user_id) => {
    return await db.query('SELECT * FROM group_membership WHERE group_id = ? and user_id = ?', [group_id,user_id]);
};


