const express = require('express');
const app = express();
const routes = require('./routes/api')
const bodyParser = require('body-parser');
const morgan = require('morgan');
const mongoose = require('mongoose')
mongoose.Promise = global.Promise;
const {PORT, DATABASE_URL} = require('./config');
const {Campaign} = require('./models/campaign');

app.use(express.static('public'));
app.use(morgan('common'));
app.use(bodyParser.json());
app.use('/api', routes);

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