require('dotenv').config();
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const morgan = require('morgan');
const passport = require('passport');
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const {PORT, DATABASE_URL} = require('./config/main');
const {Campaign} = require('./models/campaign');
const User = require('./models/user-model');
const routes = require('./routes/api');
const registerRouter = require('./routes/register');

app.use(express.static('public'));
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: false}));
app.use(bodyParser.json());
app.use(passport.initialize());

require('./config/passport')(passport);

app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization');
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE');
  if (req.method === 'OPTIONS') {
      return res.send(204);
  }
  next();
});

app.use('/api', routes);
app.use('/register', registerRouter);
app.use('*', (req, res) => {
  return res.status(404).json({message: 'Not Found'});
});

let server;
function runServer(databaseUrl=DATABASE_URL, port=PORT) {
  return new Promise((resolve, reject) => {
    mongoose.connect(databaseUrl, err => {
      if (err) {
        return reject(err);
      }
      server = app.listen(port, () => {
        console.log(`Your app is listening on port ${port}`);
        resolve();
      })
      .on('error', err => {
        mongoose.disconnect();
        reject(err);
      });
    });
  });
}

function closeServer() {
  return mongoose.disconnect().then(() => {
     return new Promise((resolve, reject) => {
       console.log('Closing server');
       server.close(err => {
           if (err) {
               return reject(err);
           }
           resolve();
       });
     });
  });
}

if (require.main === module) {
  runServer().catch(err => console.error(err));
};

module.exports = {app, runServer, closeServer};