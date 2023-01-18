const userModel = require('../model/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

exports.signUp = async (req, res) => {
    const { email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await userModel.createUser(email, hashedPassword);
    if (newUser === 'User added Successfully') {
        res.status(200).send('User added');
    } else {
        res.status(500).send('Credentials error');
    }
};

// exports.logIn = async (req, res) => {
//     const { email, password } = req.body;
//     const user = await userModel.findUserByEmail(email);
//     if (user.length === 0) res.status(401).send();
//     const isValid = await bcrypt.compare(password, user[0].password);
//     if (!isValid) {
//         res.status(401).send();
//     } else {
//         const token = jwt.sign(
//             { userId: user.id, email: user.email },
//             process.env.JWTSECRET,
//             { expiresIn: '24h' }
//         );
//         res.status(200).json({
//             username: user[0].username,
//             email: user[0].email,
//             token: token
//         });
//     }
// };

// exports.updateUsername = async (req, res) => {
//     const { username, email } = req.body;
//     const existingUser = await userModel.findUserByEmail(email);
//     if (existingUser.length > 0) {
//         const user = await userModel.updateUsername(username, email);
//         if (user.length > 0) {
//             res.status(200).send();
//         }
//     } else {
//         res.status(400).send('Invalid email');
//     }
// };

// exports.addFriend = async (req, res) => {
//     const { friendEmail, sendingUser } = req.body;
//     const checkFriend = await userModel.findUserByEmail(friendEmail);
//     if (checkFriend.length > 0) {
//         const addFriend = await userModel.addFriend(sendingUser, checkFriend[0].id);
//         if (addFriend.length > 0) res.status(200).send();
//     } else {
//         res.status(400).send();
//     }
// };

// exports.acceptFriendRequests = async (req, res) => {
//     const { userId, friendEmail } = req.body;
//     const checkFriend = await userModel.findUserByEmail(friendEmail);
//     if (checkFriend.length > 0) {
//         const addedFriend = await userModel.acceptFriendRequests(userId, checkFriend[0].id);
//         if (addedFriend.length > 0) res.status(200).send();
//     } else {
//         res.status(400).send();
//     }
// };

// exports.friendsList = async (req, res) => {
//     const { email } = req.body;
//     const existingUser = await userModel.findUserByEmail(email);
//     if (existingUser.length > 0) {
//         const friendsList = await userModel.friendsList(existingUser[0].id);
//         if (friendsList.length > 0) {
//             res.status(200).json(friendsList);
//         } else {
//             res.status(200).json(friendsList);
//         }
//     } else {
//         res.status(400).send();
//     }
// };