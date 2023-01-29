const express = require('express');
const cors = require('cors');
const logger = require('morgan');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
require('dotenv').config();
const port = process.env.PORT || 8080;

// Routes
const userRouter = require('./routes/user.routes');

// App configs
app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// Routes with prefix
app.use('/user', userRouter);

app.get('/hello', (req, res) => {
  // userHandler.
  res.send('hello route');
});

// Socket initialization
const userHandler = require('./events/userHandler');

const onConnection = (socket) => {
  // socket.on('sms', (msg) => {
  //   console.log(msg);
  // });
  // socket.emit("hello", "world");
  userHandler(io,socket);
};

io.on("connection", onConnection);
// io.on('connection', (socket) => {
//   console.log(`User connected ${socket.id}`)
// });

server.listen(port, () => {
  console.log(`Listening on port:: http://localhost:${port}/`)
});
