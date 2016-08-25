var _ = require('lodash');
var KeyResultRepository = require('../repositories/keyResult');
var UserObjectiveRepository = require('../repositories/userObjective');
var HistoryRepository = require('../repositories/history');
var async = require('async');

var KeyResultsService = function(){

};

KeyResultsService.prototype.generateNotification = function(){

};

KeyResultsService.prototype.update = function(userId, keyResultId, keyResult, callback){
	async.waterfall([
		(callback) => {
			KeyResultRepository.update(keyResultId, keyResult, (err, keyResult) => {
				if(err){
					return  callback(err, null);
				};
				return callback(null, keyResult);
			});
		},
		(keyResult, callback) => {
			HistoryRepository.addKeyResultEvent(userId, keyResultId, 'update KeyResult', (err, keyResult) => {
					if(err){
					return  callback(err, null);
				};
				return callback(null, keyResult);
			});
		}
	], (err, result) => {
		return callback(err, result);
	});
};


KeyResultsService.prototype.delete =function(userId, keyResultId, callback){
	async.waterfall([
		(callback) => {
			KeyResultRepository.delete(keyResultId, (err, keyResult) => {
				if(err){
					return callback(err, null);
				};
				return callback(null, keyResult);
			});
		},
		(keyResult, callback) => {
			HistoryRepository.addKeyResultEvent(userId, keyResultId, 'delete KeyResult', (err, keyResult) => {
					if(err){
					return callback(err, null);
				};
				return callback(null, keyResult);
			});	
		}
	], (err, result) => {
		return callback(err, result);
	});
};

KeyResultsService.prototype.add = function(userId, keyResult, callback){
	console.log('-----ENTER PRESSED-----', keyResult);

	async.waterfall([
		(callback) => {
			KeyResultRepository.add(keyResult, (err, keyResult) => {
				if(err){
					return  callback(err, null);
				};
				return callback(null, keyResult);
			});
		}
		//,
		//(keyResult, callback) => {
		//	HistoryRepository.addKeyResultEvent(userId, keyResult._id, 'add KeyResult', (err) => {
		//		if(err){
		//			return callback(err, null);
		//		};
		//		return callback(null, keyResult);
		//	});
		//}
	], (err, result) => {
		return callback(err, result);
	});
};

KeyResultsService.prototype.autocomplete = function(title, objectiveId, callback){
	let keyResults = [];

	async.waterfall([
		(callback) => {
			UserObjectiveRepository.getById(objectiveId, (err, userObjective) => {
				if (err){
					return callback(err, null);
				}
				return callback(null, userObjective);
			})
		},
		(userObjective, callback) => {
			KeyResultRepository.autocomplete(title, userObjective.templateId, (err, keyResultsArr) => {
				if (err){
					return callback(err, null);
				};	
				return callback(null, keyResultsArr, userObjective);
			});
		},
		(keyResultsArr, userObjective, callback) => {
			keyResultsArr = keyResultsArr.filter((keyResult) => {
				return !(userObjective.keyResults.some((objectiveKeyResult) => {
					return (objectiveKeyResult.templateId.equals(keyResult._id))
				}))
			}).slice(0,10);

			return callback (null, keyResultsArr);
		}
	], (err, results) => {
			return callback(err, results);
	});
}

KeyResultsService.prototype.changeApprove = function(userId, keyResultId, callback){
	async.waterfall([
		(callback) => {
			KeyResultRepository.getById(keyResultId, function(err, keyResult){
				if (err){
					return callback(err, null);
				};	
				return callback(null, userId, keyResult);
			});
		},
		(userId, keyResult, callback) => {
			HistoryRepository.addKeyResultEvent(userId, keyResultId, 'change KeyResult approve to ' + !keyResult.isApproved, (err) =>{
				if (err){
					return callback(err, null);
				};	
			});
			return callback(null, keyResult);
		},
		(keyResult, callback) => {
			if(keyResult.isApproved){
				KeyResultRepository.setIsApprovedToFalse(keyResultId, function(err, keyResult){
					if (err){
						return callback(err, null);
					};	
					return callback(null, keyResult);
				});
			}
			else{
				KeyResultRepository.setIsApprovedToTrue(keyResultId, function(err, keyResult){
					if (err){
						return callback(err, null);
					};
					return callback(null, keyResult);	
				});
			};
		}
	], (err, keyResult) => {
		return callback(err, keyResult);
	});

	/*KeyResultRepository.getById(id, function(err, keyResult){
		if (err){
			return callback(err, null);
		};	

		if(keyResult.isApproved){
			KeyResultRepository.setIsApprovedToFalse(id, function(err, keyResult){
				if (err){
					return callback(err, null);
				};	
			});
		}
		else{
			KeyResultRepository.setIsApprovedToTrue(id, function(err, keyResult){
				if (err){
					return callback(err, null);
				};	
			});
		};

		callback(err, keyResult);
	});*/
};

module.exports = new KeyResultsService();