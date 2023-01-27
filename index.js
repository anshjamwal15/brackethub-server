const express = require('express');
const cors = require('cors');
const logger = require('morgan');
const app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
const userRouter = require('./routes/user.routes');
require('dotenv').config();
const port = process.env.PORT || 8080;

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/user', userRouter);

io.on('connection', (socket) => {
  console.log(`User connected ${socket.id}`)
});

app.get('/hello', (req, res) => {
  res.send('hello');
})

server.listen(port, () => {
  console.log(`Listening on port:: http://localhost:${port}/`)
});
