const mongoose = require('mongoose');

const playerSchema = mongoose.Schema({
    charName: String,
    statSheet: String,
    email: String,
    session: Number,
    expGained: Number,
    currentLoot: String
});
const campaignSchema = mongoose.Schema({
    campaignName: String,
    players: [{playerSchema}]
});

const playerChar = mongoose.model('campaignPlayer', campaignSchema);

campaignSchema.virtual('campaignTitle').get(function() {
  return `${this.campaignName}`;
});

campaignSchema.virtual('playerList').get(function() {
    return `${this.players}`;
});

campaignSchema.methods.apiRepr = function() {
  return {
    id: this._id,
    campaignName: this.campaignTitle,
    players: this.playerList,
  };
}

module.exports = {playerChar};
