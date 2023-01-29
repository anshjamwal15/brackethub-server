const socketio = require('socket.io');
const SocketEvents = require('../helper/SocketEvents');
const userHandler = require('./userHandler');

module.exports = (http) => {
    const io = socketio(http, {
        cors: { origin: '*' },
    });

    io.on(SocketEvents.CONNECT, (socket) => {
        // Showing all message
        socket.on(SocketEvents.SEND_MESSAGE, async (data) => {

            const message = {
                id: 2,
                sentBy: 'user2',
                data: ' bro',
                mySocket: data
            };
            console.log(message);
        });
        // const message = {
        //     id: 2,
        //     sentBy: 'user2',
        //     data: ' bro'
        // };
        // socket.emit('sending', message);
    });
};