const socketio = require('socket.io');
const SocketEvents = require('./SocketEvents');

module.exports = (http) => {
    const io = socketio(http, {
        cors: { origin: '*' },
    });

    io.on(SocketEvents.CONNECT, (socket) => {
        
        // Showing all message
        const message = {
            id: 2,
            sentBy: 'user2',
            data: 'bro',
        };

        // socket.emit(SocketEvents.SHOW_MESSAGE, message);

        socket.on(SocketEvents.SEND_MESSAGE, async (data) => {
            message.data = data;            
            console.log(message);
            // socket.emit(SocketEvents.SHOW_MESSAGE, message);
        });
        
        
    });
};