const chatRoomModel = require('../model/chatRooms');
const chatMessageModel = require('../model/chatMessage');

exports.initiateChat = async (req, res) => {
    try {
        const { userIds, chatInitiator } = req.body;
        const chatRoom = await chatRoomModel.initiateChat(userIds, chatInitiator);
        if(chatRoom !== null) res.status(200).send(chatRoom);
    } catch (error) {
        res.status(500).json({ success: false, error: error })
    }
};

exports.postMessage = async (req, res) => {
    try {
        const { roomId, postedByUserId, message } = req.body;
        const post = await chatMessageModel.createPostInChat(roomId,message,postedByUserId);
        global.io.sockets.in(roomId).emit('new message', { message: post });
        if(post.length > 0) res.status(200).json({ success: true, post });
    } catch (error) {
        res.status(500).json({ success: false, error: error })
    }
};