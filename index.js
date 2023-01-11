const express = require('express');
const cors = require('cors');
const session = require('express-session');
var logger = require('morgan');
const sessionConfig = require('./config/sessionConfig');
const app = express();
// const httpServer = require("http").createServer();
// const io = require("socket.io")(httpServer);
// require('./listeners/messageListener').testWs(io);
const port = 8082;

var userRouter = require('./routes/user.routes');

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(session(sessionConfig.sessionConfig));

app.use('/user', userRouter);

app.get('/hello', (req, res) => {
  res.send('hello');
})

app.listen(port, () => {
  console.log(`App running on port ${port}`)
})