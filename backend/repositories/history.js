var mongoose = require('mongoose');
var Repository = require('../units/Repository');
var History = require('../schemas/history');
var CONST = require('../config/constants');

var HistoryRepository = function() {
	Repository.prototype.constructor.call(this);
	this.model = History;
};

HistoryRepository.prototype = new Repository();

HistoryRepository.prototype.getByAuthorId = function (id, callback) {
	let model = this.model;
	let query = model.find({authorId: id});
	query.exec(callback);	
};

// HistoryRepository.prototype.addUserEvent = function (authorId, userId, type, callback) {
// 	 let model = this.model;
// 	 let newEvent = new model({authorId, userId, type});
// 	 newEvent.save(callback);
// };

HistoryRepository.prototype.addKeyResultEvent = function(body, type, callback) {
	let model = this.model;
	body.type = type + ' ' + CONST.history.target.KEY_RESULT;
	
	let newEvent = new model(body);
	newEvent.save(callback);
};

HistoryRepository.prototype.addCategoryEvent = function(body, type, callback) {
	let model = this.model;
	body.type = type + ' ' + CONST.history.target.CATEGORY;
	
	let newEvent = new model(body);
	newEvent.save(callback);
};

HistoryRepository.prototype.addObjectiveEvent = function(authorId, objectiveId, type, callback) {
	let model = this.model;
	let newEvent = new model({authorId, objectiveId, type});
	newEvent.save(callback);
};

// HistoryRepository.prototype.addPlanEvent = function (authorId, planId, type, callback) {
// 	let model = this.model;
// 	let newEvent = new model({authorId, planId, type});
// 	newEvent.save(callback);
// };

// HistoryRepository.prototype.addCommentEvent = function (authorId, commentId, objectiveId, type, callback) {
// 	let model = this.model;
// 	let newEvent = new model({authorId, commentId, objectiveId, type});
// 	newEvent.save(callback);
// };

module.exports = new HistoryRepository();
