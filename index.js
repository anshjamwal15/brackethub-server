const express = require('express');
const cors = require('cors');
var logger = require('morgan');
const app = express();
const port = 8000;

var userRouter = require('./routes/user.routes');

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/user', userRouter);

app.get('/hello', (req, res) => {
  res.send('hello');
})

app.listen(port, () => {
  console.log(`Listening on port:: http://localhost:${port}/`)
});
