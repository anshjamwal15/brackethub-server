const socketio = require('socket.io');
const chatMessage = require('../../model/chatMessage');
const groupChatMessage = require('../../model/groupMessage');
const SocketEvents = require('./SocketEvents');
const { v4: uuidv4 } = require('uuid');

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

        /**
        * Fetching room name and storing in db.
        * @param {room_name} room_name
        */
        socket.on(SocketEvents.CREATE_ROOM, async (data) => {

            const { room_name, user_id } = data;

            socket.join(room_name);

            await groupChatMessage.createGroup(uuidv4(), user_id);

            // Use io to emit in whole room
            io.in(room_name).emit(SocketEvents.ROOM_JOINED, 'socket.i');
        });

        /**
        * Fetching room name and storing in db.
        * @param {group_name} group_name
        * group_name should be emit from user end.
        * @param {sent_by} sent_by
        * sent_by will be email of the person who sent message 
        */
        socket.on(SocketEvents.SEND_GROUP_MESSAGE, async (data) => {

            const { group_name, sent_by, message, room } = data;

            const save_group_message = await groupChatMessage.sendMessage('1', group_name, message, sent_by);

            socket.to(room).emit(SocketEvents.SHOW_GROUP_MESSAGE, save_group_message);
        });


    });
};
