const express = require('express');
const cors = require('cors');
const logger = require('morgan');
const app = express();
const server = require('http').Server(app);
const createSocket = require('./services/chat-service/socketIo');
require('dotenv').config();
const port = process.env.PORT || 8080;

// Routes
const userRouter = require('./services/web-service/routes/user.routes');

// App configs
createSocket(server);
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

server.listen(port, () => {
  console.log(`Listening on port:: http://localhost:${port}/`)
});
