var express = require('express');
var ensureLogIn = require('connect-ensure-login').ensureLoggedIn;
var router = express.Router();

var ensureLoggedIn = ensureLogIn();

router.get('/check', ensureLoggedIn, (req, res, next) => {
    res.send('Entered');
});

module.exports = router;