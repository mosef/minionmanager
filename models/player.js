const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const playerSchema = Schema({ 
	playerName: {type: String},
	statSheet: {type: String},
	email: {type: String},
	session: {type: Number},
	expGained: {type: Number},
	currentLoot: {type: String}
});

const Player = mongoose.model('player', playerSchema);

module.exports = {Player, playerSchema}