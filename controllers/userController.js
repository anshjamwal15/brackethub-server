const userModel = require('../model/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

exports.logIn = async (req, res) => {
    const { email, password } = req.body;
    const user = await userModel.findUserByEmail(email);
    if (user.rows.length === 0) res.status(401).send();
    const isValid = await bcrypt.compare(password, user.rows[0].password);
    if (!isValid) {
        res.status(401).send();
    } else {
        const token = jwt.sign(
            { email: user.rows[0].email },
            process.env.JWTSECRET,
            { expiresIn: '24h' }
        );
        res.status(200).json({
            username: user.rows[0].username,
            email: user.rows[0].email,
            token: token
        });
    }
};

exports.signUp = async (req, res) => {
    const { email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await userModel.createUser(email, hashedPassword);
    if (newUser === 'User added Successfully') {
        res.status(200).send(newUser);
    } else {
        res.status(401).send(newUser);
    }
};

exports.updateUsername = async (req, res) => {
    const { username, email } = req.body;
    const user = await userModel.updateUsername(username, email);
    if (user.length > 0) {
        res.status(200).send();
    } else {
        res.status(400).send('Invalid email');
    }
};

exports.acceptFriendRequest = async (req, res) => {
    const data = req.body;
    const checkFriend = await userModel.checkFriendExists(data.userEmail, data.friendEmail);
    if (checkFriend.rows.length === 0) {
        const addFriend = await userModel.acceptFriendRequest(data);
        if (addFriend.length > 0) res.status(200).send();
    } else {
        res.status(400).send(`${data.friendEmail} is already your friend`);
    }
};

exports.friendsList = async (req, res) => {
    const { email } = req.body;
    const friendsList = await userModel.friendsList(email);
    if (friendsList.rows.length > 0) {
        res.status(200).json(friendsList.rows);
    } else {
        res.status(200).json(friendsList.rows);
    }
};

exports.sendFriendRequests = async (req, res) => {
    const { userEmail, friendEmail } = req.body;
    const sendFriendRequest = await userModel.sendFriendRequest(userEmail, friendEmail);
    if (sendFriendRequest.length > 0) res.status(200).send();
    res.status(500).send();
};

exports.friendsRequestList = async (req, res) => {
    const { userEmail } = req.body;
    const pendingFriendsRequestList = await userModel.pendingFriendsRequestList(userEmail);
    if (pendingFriendsRequestList.rows.length > 0) {
        res.status(200).json(pendingFriendsRequestList.rows);
    } else {
        res.status(200).send('No requests Found');
    }
};

