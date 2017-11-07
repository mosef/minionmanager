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

campaignSchema.virtual('campaignList').get(function() {
  return `${this.campaign}`;
});

campaignSchema.methods.apiRepr = function() {
  return {
    id: this._id,
    campaignName: this.campaignList,
    players: this.players,
  };
}



module.exports = {playerChar};
