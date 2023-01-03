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
}, function verify(issuer, profile, cb) {
    db.query(`SELECT * FROM federated_credentials WHERE provider = ${issuer} AND subject = ${profile.id}`
        , function (err, row) {
            if (err) { return cb(err); }
            if (!row) {
                db.query(`INSERT INTO users(username,email,created_date) VALUES (${profile.displayName}, test@gmail.com, now())`,
                    function (err) {
                        if (err) { return cb(err) };
                        var id = this.lastID;
                        db.query(`INSERT INTO federated_credentials (user_id, provider, subject) VALUES (${id}, ${issuer}, ${profile.id})`,
                            function (err) {
                                if (err) { return cb(err); }
                                var user = { id: id, name: profile.displayName };
                                return cb(null, user);
                            });
                    });
            } else {
                db.query(`SELECT * FROM users WHERE id = ${row.user_id}`,
                    function (err, row) {
                        if (err) { return cb(err); }
                        if (!row) { return cb(null, false); }
                        return cb(null, row);
                    });
            }
        });
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