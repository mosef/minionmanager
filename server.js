const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const morgan = require('morgan');
const mongoose = require('mongoose')
const {PORT, DATABASE_URL} = require('./config');
const {playerChar} = require('./models');

app.use(express.static('public'));
app.use(morgan('common'));
app.use(bodyParser.json());
mongoose.Promise = global.Promise;

app.get('/load', (req, res) => {
    playerChar
      .find()
      .then(players => {
        res.json(players);
      })
      .catch(err => {
        console.error(err);
        res.status(500).json({error: 'something went terribly wrong'});
      });
  });

app.post('/save', (req, res) => {
    const requiredFields = ['campaignName', 'players'];
    for (let i=0; i<requiredFields.length; i++) {
        const field = requiredFields[i];
        if (!(field in req.body)) {
            const message = `Missing \`${field}\` in request body`
            console.error(message);
            return res.status(400).send(message);
        }
    }
    playerChar
    .create({
        campaignName: req.body.campaignName,
        players: req.body.players
    });
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