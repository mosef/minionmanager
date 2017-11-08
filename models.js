const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const playerSchema = Schema({ 
	_id: Schema.Types.ObjectId,
	playerName: {type: String},
	statSheet: {type: String},
	email: {type: String},
	session: {type: Number},
	expGained: {type: Number},
	currentLoot: {type: String}
});
const campaignSchema = mongoose.Schema({
	_id: Schema.Types.ObjectId,
	title: {type: String},
	players: [playerSchema]
});

const Campaign = mongoose.model('campaign', campaignSchema);

campaignSchema.virtual('campaignPlayers').get(function() {
  return `${this.players}`;
});

campaignSchema.methods.apiRepr = function() {
  return {
    id: this._id,
    title: this.title,
    players: this.campaignPlayers,
  };
}

module.exports = {Campaign};
