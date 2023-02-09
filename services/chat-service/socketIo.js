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
                await groupChatMessage.send_message();
            } else {
                await chatMessage.send_message(user_id, user_id2, message);
                const fetched_message = await chatMessage.get_all_messages(user_id, user_id2);
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
                const fetched_message = await groupChatMessage.send_message();
                socket.emit(SocketEvents.SEND_MESSAGE, fetched_message);
            } else {
                const fetched_message = await chatMessage.get_all_messages(user_id, user_id2);
                socket.emit(SocketEvents.SEND_MESSAGE, fetched_message.rows);
            }
        });

        /**
        * Creating room.
        * @param {room_name} room_name
        */
        socket.on(SocketEvents.CREATE_ROOM, async (data) => {

            const { room_name, user_id } = data;

            socket.join(room_name);

            await groupChatMessage.create_group(uuidv4(), room_name, user_id);

            // Use io.in() to emit in whole room or socket.in() to send expect sender
            // io.in(room_name).emit(SocketEvents.ROOM_JOINED, 'socket.i');
        });

        /**
        * Join group.
        * @param {room_name} room_name
        */
        socket.on(SocketEvents.JOIN_GROUP_CHAT, async (data) => {

            const { room_name, user_id } = data;

            socket.join(room_name);

            // Use io.in() to emit in whole room or socket.in() to send expect sender
            const user_data = { message: `${user_id} joined the chat.`, user_id: user_id };
            io.in(room_name).emit(SocketEvents.ROOM_JOINED, user_data);
        });

        /**
        * Fetching room name and storing in db.
        * @param {group_name} group_name
        * group_name should be emit from user end.
        * @param {sent_by} sent_by
        * sent_by will be email of the person who sent message.
        * @param {room} room
        * room will be uuid sent from client
        */
        socket.on(SocketEvents.SEND_GROUP_MESSAGE, async (data) => {

            const { group_name, sent_by, message, group_id } = data;

            await groupChatMessage.send_message(group_id, group_name, message, sent_by);

            // Use io.in() to emit in whole room or socket.in() to send expect sender
            io.in(group_name).emit(SocketEvents.SHOW_GROUP_MESSAGE, 'save_group_message');
        });

    });
};
