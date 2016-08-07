var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var historySchema = new Schema({
	authorId: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
	keyId: {type: mongoose.Schema.Types.ObjectId, ref: 'Key'},
	type: String,
	date: Date
});

module.exports = mongoose.model('History', historySchema);