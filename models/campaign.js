const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const campaignSchema = mongoose.Schema({
  author: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  title: {type: String, unique: true, required: true},
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

module.exports = {Campaign};