var express = require('express');
var router = express.Router();
var passport = require('passport');
var GoogleStrategy = require('passport-google-oidc');
var db = require('../config/db');
require('dotenv').config();

passport.use(new GoogleStrategy({
    clientID: process.env.CLIENTID,
    clientSecret: process.env.CLIENTSECRET,
    callbackURL: '/oauth2/redirect/google',
    scope: ['profile']
}, async function verify(issuer, profile, cb) {
    const credentials = await db.query(`SELECT * FROM federated_credentials WHERE provider = $1 AND subject = $2`, [issuer, profile.id]);
    if (!credentials) {
        const addUser = await db.query(`INSERT INTO users(username,email,created_date) VALUES ($1,$2,$3)`, [profile.displayName, 'test@gmail.com']);
        if (!addUser) {
            const addCredentials = await db.query(`INSERT INTO federated_credentials (user_id, provider, subject) VALUES ($1, $2, $3)`, [profile.id, issuer, 'subject']);
            var user = { id: profile.id, name: profile.displayName };
            if (!addCredentials) { return cb(null, user); }
        }
    } else {
        const selectUser = await db.query('SELECT * FROM users WHERE id = $1', [credentials.user_id]);
        if (!selectUser) { return cb(null, false); }
        return cb(null, selectUser);
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
router.get('/login/google', passport.authenticate('google'));

// Redirect URL
router.get('/oauth2/redirect/google', passport.authenticate('google', {
    successReturnToOrRedirect: '/hello',
    failureRedirect: '/login'
}));


module.exports = router;