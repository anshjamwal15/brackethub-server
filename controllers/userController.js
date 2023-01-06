const userRepository = require('../repository/userRepository');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

exports.signUp = async (req, res) => {
    const { email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await userRepository.createUser(email, hashedPassword);
    if (newUser === 'User added Successfully') {
        res.status(200).send('User added');
    } else {
        res.status(500).send('Credentials error');
    }
};

exports.logIn = async (req, res) => {
    const { email, password } = req.body;
    const user = await userRepository.findUserByEmail(email);
    if (user.length === 0) res.status(401).send();
    const isValid = await bcrypt.compare(password, user[0].password);
    if (!isValid) {
        res.status(401).send();
    } else {
        const token = jwt.sign(
            { userId: user.id, email: user.email },
            process.env.JWTSECRET,
            { expiresIn: '24h' }
        );
        res.status(200).json({
            username: user[0].username,
            email: user[0].email,
            token: token
        });
    }
};

exports.updateUsername = async (req, res) => {
    const { username, email } = req.body;
    const existingUser = await userRepository.findUserByEmail(email);
    if (existingUser.length > 0) {
        const user = await userRepository.updateUsername(username, email);
        if (user.length > 0) {
            res.status(200).send();
        }
    } else {
        res.status(400).send('Invalid email');
    }
};

exports.addFriend = async (req, res) => {
    const { email, sendingUser } = req.body;
    const checkFriend = await userRepository.findUserByEmail(email);
    if (checkFriend.length > 0) {
        // TODO request_accepted flag 
        const addFriend = await userRepository.addFriend(sendingUser, checkFriend[0].id);
        if (addFriend.length > 0) res.status(200).send();
    } else {
        res.status(400).send();
    }
};

exports.friendsList = async (req, res) => {
    const { email } = req.body;
    const existingUser = await userRepository.findUserByEmail(email);
    if (existingUser.length > 0) {
        const friendsList = await userRepository.friendsList(existingUser[0].id);
        if (friendsList.length > 0) {
            res.status(200).json(friendsList);
        } else {
            res.status(200).json(friendsList);
        }
    } else {
        res.status(400).send();
    }
};