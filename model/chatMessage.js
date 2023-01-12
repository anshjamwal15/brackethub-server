const db = require('../config/db');

exports.getConversationByRoomId = async (chatRoomId) => {
    return await db.query('SELECT * FROM chat_message WHERE chat_room_id = $1', [chatRoomId]);
};

exports.createPostInChat = async (chatRoomId, message, postedByUser) => {
    return await db.query(`INSERT INTO chat_message(message,chat_room_id,posted_by,created_date,read_by_recipients_id) VALUES ($1,$2,$3,now(),$4) RETURNING *`, [message,chatRoomId,postedByUser,{postedByUser}]);
};

