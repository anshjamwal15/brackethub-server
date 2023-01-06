var express = require('express');
var router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middleware/auth');

router.post('/signup', userController.signUp);
router.post('/login', userController.logIn);

router.get('/check', (req, res) => {
    res.status(200);
});

module.exports = router;