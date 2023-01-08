var express = require('express');
var router = express.Router();
var passport = require('passport');
var dateTime = require('../helper/CustomDateTime');
var GoogleStrategy = require('passport-google-oidc');
var db = require('../config/db');
require('dotenv').config();

passport.use(new GoogleStrategy({
    clientID: process.env.CLIENTID,
    clientSecret: process.env.CLIENTSECRET,
    callbackURL: '/oauth2/redirect/google',
}, async function verify(issuer, profile, cb) {
    const email = profile.emails[0].value;
    const checkUser = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    if (checkUser.length <= 0) {
        // TODO Sign JWT
        const addUser = await db.query(`INSERT INTO users(username,email) VALUES ($1,$2) RETURNING *`, [profile.displayName, email]);
        var user = { id: profile.id, name: profile.displayName };
        return cb(null, user);
    } else {
        // if (checkUser.length <= 0) { return cb(null, false); }
        return cb(null, checkUser);
    }
}));

passport.serializeUser(function (user, cb) {
    process.nextTick(function () {
        cb(null, { id: user.id, username: user.username, name: user.name });
    });
});

passport.deserializeUser(function (user, cb) {
    process.nextTick(function () {
        return cb(null, user);
    });
});

router.get('/login', (req, res, next) => {
    res.send('This is login screen');
});

// Login with google
router.get('/login/google', passport.authenticate('google', {
    scope: ['email', 'profile']
}));

// Redirect URL
router.get('/oauth2/redirect/google', passport.authenticate('google', {
    successReturnToOrRedirect: '/hello',
    failureRedirect: '/login'
}));


module.exports = router;