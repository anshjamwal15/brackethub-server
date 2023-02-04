const socketio = require('socket.io');
const chatMessage = require('../../model/chatMessage');
const groupChatMessage = require('../../model/groupMessage');
const SocketEvents = require('./SocketEvents');

module.exports = (http) => {
    const io = socketio(http, {
        cors: { origin: '*' },
    });

    io.on(SocketEvents.CONNECT, (socket) => {

        /**
        * Fetching data and storing in db.
        * @param {channel_type} channel_type 
        * The channel_type field is used to distinguish private chats from group chats.
        */
        socket.on(SocketEvents.RECEIVE_MESSAGE, async (data) => {

            const { user_id, user_id2, channel_type, message } = data;

            if (channel_type === 'group') {
                await groupChatMessage.sendMessage();
            } else {
                await chatMessage.sendMessage(user_id, user_id2, message);
                const fetched_message = await chatMessage.getAllMessages(user_id, user_id2);
                socket.emit(SocketEvents.SEND_MESSAGE, fetched_message.rows);
            }
        });

        /**
        * Sending data from db.
        * @param {earliest_message_id} earliest_message_id 
        * The earliest_message_id is the latest message locally available on the client. 
        * It is used as the sort key to range query the chat tables.
        */
        socket.on(SocketEvents.SHOW_MESSAGE, async (data) => {
            const { user_id, user_id2, channel_type } = data;
            if (channel_type === 'group') {
                const fetched_message = await groupChatMessage.sendMessage();
                socket.emit(SocketEvents.SEND_MESSAGE, fetched_message);
            } else {
                const fetched_message = await chatMessage.getAllMessages(user_id, user_id2);
                socket.emit(SocketEvents.SEND_MESSAGE, fetched_message.rows);
            }
        });




    });
};
