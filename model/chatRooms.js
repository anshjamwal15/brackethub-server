// const db = require('../config/db');

// exports.initiateChat = async (userIds, chatInitiator) => {
//     try {
//         const availableChatRoom = await db.query(`SELECT * FROM chat_room WHERE user_ids @> '{$1, $2}';`, [userIds[0], userIds[1]]);
//         if (availableChatRoom.length > 0) {
//             return {
//                 message: 'retrieving an old chat room',
//                 chatRoomId: availableChatRoom[0].id
//             };
//         }
//         const newChatRoom = await db.query(`INSERT INTO chat_room(created_date,user_ids,chat_initiator) VALUES (now(),$1,$2) RETURNING *`, [userIds, chatInitiator]);
//         return {
//             message: 'creating a new chatroom',
//             chatRoomId: newChatRoom[0].id,
//         };
//     } catch (error) {
//         console.log('error on start chat method :', error);
//         throw error;
//     }
// };