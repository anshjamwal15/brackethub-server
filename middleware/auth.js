var express = require('express');
require('dotenv').config();
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20');
const cookieSession = require('cookie-session');
var router = express.Router();


session = () => {
    cookieSession({
        maxAge: 24 * 60 * 60 * 1000,
        keys: process.env.MYKEY
    });
};

passport.initialize();
passport.session();

passport.use(new GoogleStrategy({
    clientID: process.env.CLIENTID,
    clientSecret: CLIENTSECRET,
    callbackURL: 'http://localhost:5000/auth/google/callback'
},
(accessToken, refreshToken, profile, done) => {
    done(null, profile); // passes the profile data to serializeUser
}
));

passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((user, done) => {
    done(null, user);
});

function isUserAuthenticated(req, res, next) {
    if (req.user) {
        next();
    } else {
        res.send('You must login!');
    }
}




module.exports = {};