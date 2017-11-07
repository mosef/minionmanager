const mongoose = require('mongoose');

const playerSchema = mongoose.Schema({
player: {
    charName: String,
    statSheet: String,
    email: String,
    session: Number,
    expGained: Number,
    currentLoot: String
    }
});
const campaignSchema = mongoose.Schema({
campaign: {
    campaignName: String,
    players: [{playerSchema}]
    }
});

const playerChar = mongoose.model('campaignPlayer', campaignSchema);

campaignSchema.virtual('campaignList').get(function() {
  return `${this.campaign}`;
});

campaignSchema.virtual('playerList').get(function() {
    return `${this.players}`;
});

campaignSchema.methods.apiRepr = function() {
  return {
    id: this._id,
    campaignName: this.campaignList,
    players: this.playerList,
  };
}

module.exports = {playerChar};
