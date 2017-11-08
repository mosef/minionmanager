const express = require('express');
const router = express.Router();

const bodyParser = require('body-parser');
const morgan = require('morgan');
const mongoose = require('mongoose')
mongoose.Promise = global.Promise;
const {PORT, DATABASE_URL} = require('../config');
const {Campaign} = require('../models');

router.get('/', (req, res) => {
    Campaign
      .find()
      .then(campaigns => {
        res.json(campaign);
      })
      .catch(err => {
        console.error(err);
        res.status(500).json({error: 'something went terribly wrong'});
      });
  });

router.post('/', (req, res) => {});

module.exports = router;