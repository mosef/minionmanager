const mongoose = require('mongoose');

const saveStateSchema = mongoose.Schema({
campaigns: {
    campaign: String, 
    players: {
        Object: {
            email: String,
            gameName: String,
            statSheet: String,
            currentLoot: String,
            session: Number,
            expGained: Number,
            currentResources: {"health": Number, "remainingCasts": Number, "buffs": String}}
            }
  
});


saveStateSchema.virtual('authorName').get(function() {
  return `${this.campaign.players}`;
});

saveStateSchema.methods.apiRepr = function() {
  return {
    id: this._id,
    campaigns: this.campaigns,
    players: this.players,
  };
}

const SaveState = mongoose.model('SaveState', saveStateSchema);

module.exports = {SaveState};
