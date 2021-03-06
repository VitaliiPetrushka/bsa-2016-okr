var mongoose = require('mongoose');
var Repository = require('../units/Repository');
var Comment = require('../schemas/comment');

var CommentRepository = function(){
	Repository.prototype.constructor.call(this);
	this.model = Comment;
};

CommentRepository.prototype = new Repository();

CommentRepository.prototype.getByObjId = function(objectiveId, callback) {
	var model = this.model;
	var query = model.find({'objectiveId': objectiveId});
	query.exec(callback);
};


module.exports = new CommentRepository();