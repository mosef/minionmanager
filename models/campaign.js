const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const {playerSchema} = require('./player');

const campaignSchema = mongoose.Schema({
  title: {type: String},
  //need to link player schema to the value for the plaerys key
	players: [{ 
    _id: false,
    playerName: {type: String},
    statSheet: {type: String},
    email: {type: String},
    session: {type: Number},
    expGained: {type: Number},
    currentLoot: {type: String}
  }]
});

const Campaign = mongoose.model('campaign', campaignSchema);

module.exports = {Campaign}