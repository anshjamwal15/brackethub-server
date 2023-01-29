module.exports = (io,socket) => {
    const userCheck = (socket) => {
        console.log(socket);
    };
    const myFunction = (data) => {
        socket.emit("receive", { message: data });
    }

    socket.on("sms", userCheck);
    // myFunction('im am sending this message from backend');
}