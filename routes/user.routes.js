var express = require('express');
var router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middleware/auth');

router.post('/signup', userController.signUp);
router.post('/login', userController.logIn);

// User
router.post('/username', userController.updateUsername);

router.get('/check', auth, (req, res) => {
    res.status(200).send();
});

module.exports = router;