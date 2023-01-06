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
    const user = await userRepository.findUser(email);
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
    const existingUser = await userRepository.findUser(email);
    if (existingUser.length > 0) {
        const user = await userRepository.updateUsername(username, email);
        if (user.length > 0) {
            res.status(200).send();
        }
    } else {
        res.status(400).send('Invalid email');
    }
};