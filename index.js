const express = require('express');
const cors = require('cors');
const session = require('express-session');
var logger = require('morgan');
const sessionConfig = require('./config/sessionConfig');
const app = express();
const http = require("http");
const io = require("socket.io")
const WebSockets = require('./helper/WebSockets');
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

const server = http.createServer(app);

global.io = io.listen(server);
global.io.on('connection', WebSockets.connection)

server.listen(port);

server.on("listening", () => {
  console.log(`Listening on port:: http://localhost:${port}/`)
});
