const express = require('express');
const cors = require('cors');
const session = require('express-session');
var passport = require('passport');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
const sessionConfig = require('./config/sessionConfig');
var db = require('./config/db');
const app = express();
const port = 5000;

var authRouter = require('./middleware/auth');
var userRouter = require('./routes/user.routes');

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser('sadkamslkd'));
app.use(session(sessionConfig));
app.use(passport.authenticate('session'));
app.use(function(req, res, next) {
  var msgs = req.session.messages || [];
  res.locals.messages = msgs;
  res.locals.hasMessages = !! msgs.length;
  req.session.messages = [];
  next();
});

app.use('/', authRouter);
app.use('/user', userRouter);

app.get('/hello', (req, respo) => {
  var j = '';
  var r = db.query('SELECT * FROM users ORDER BY id ASC');
  respo.send(r);
})

app.listen(port, () => {
  console.log(`App running on port ${port}`)
})