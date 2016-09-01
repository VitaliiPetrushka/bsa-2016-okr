const async = require('async');
const ValidateService = require('../../utils/ValidateService');
const isEmpty = ValidateService.isEmpty;
const CONST = require('../../config/constants');

const UserObjectiveRepository = require('../../repositories/userObjective');
const UserRepository = require('../../repositories/user');
const HistoryRepository = require('../../repositories/history');

const add = require('./add');
const addKeyResult = require('./addKeyResult');

var UserObjectiveService = function() {};

UserObjectiveService.prototype.add = add;
UserObjectiveService.prototype.addKeyResult = addKeyResult;

UserObjectiveService.prototype.update = function(authorId, objectiveId, objective, callback){
	async.waterfall([
		(callback) => {
			UserObjectiveRepository.update(objectiveId, objective, (err, oldObjective) => {
				if(err) {
					return callback(err, null);
				};

				return callback(null, oldObjective);
			})
		},
		(oldObjective, callback) => {
			// console.log('update finished');
			// HistoryRepository.addUserObjective(authorId, objectiveId, CONST.history.type.UPDATE, (err) => {
			// 	if(err) {
			// 		return callback(err, null);
			// 	};

			// 	return callback(null, objective);
			// })
			return callback(null, objective);
		}
		], (err, result) => {
			return callback(err, result)
		})
};

UserObjectiveService.prototype.softDeleteKeyResult = function(session, userObjectiveId, keyResultId, flag, callback){
	var historyType = CONST.history.type.UPDATE;
	async.waterfall([
		(callback) => {
			UserObjectiveRepository.getById(userObjectiveId, (err, userObjective) => {
				if(err) {
					return callback(err, null);
				}

				if(isEmpty(userObjective)) {
					err = new Error('Objective not found');
					return callback(err, null);
				}

				if ((!userObjective.userId.equals(session._id))
				&& (!userObjective.userId.equals(session.mentor))
				&& (!session.localRole === CONST.user.role.ADMIN)) {
					err = new Error('Forbidden');
					err.status = 403;
					return callback(err, null);
				}

				return callback(null, userObjective);
			});
		}, (userObjective, callback) => {

			let index = userObjective.keyResults.findIndex((keyResult)=>{
				return keyResult._id.equals(keyResultId);
			});

			if(index === -1) {
				let err = new Error('Key result not found in objective');
				return callback(err, null);
			}

			userObjective.keyResults[index].isDeleted = flag;
			userObjective.keyResults[index].deletedDate = new Date();
			userObjective.keyResults[index].deletedBy = session._id;

			userObjective.save((err, userObjective) => {
				if(err) {
					return callback(err, null);
				}

				return callback(null, userObjective);
			});
		}, (userObjective, callback) => {
			HistoryRepository.addUserObjective(session._id, userObjectiveId, historyType, (err, historyEvent) => {
				if(err) {
					return  callback(err, null);
				}

				return callback(null, userObjective);
			});
		}
		], (err, result) => {
			return callback(err, result)
		})
};

UserObjectiveService.prototype.softDelete = function(session, userObjectiveId, data, callback){
	var historyType = objective.isDeleted ? CONST.history.type.SOFT_DELETE : CONST.history.type.RESTORE;
	async.waterfall([
		(callback) => {
			UserObjectiveRepository.getById(userObjectiveId, (err, userObjective) => {
				if(err) {
					return callback(err, null);
				}

				if(isEmpty(objective)) {
					err = new Error('Objective not found');
					return callback(err, null);
				}

				if ((!userObjective.userId.equals(session._id))
				&& (!userObjective.userId.equals(session.mentor))
				&& (!session.localRole === CONST.user.role.ADMIN)) {
					err = new Error('Forbidden');
					err.status = 403;
					return callback(err, null);
				}

				return callback(null, userObjective);
			});
		},
		(userObjective, callback) => {
			userObjective.isDeleted = flag;
			userObjective.deletedDate = new Date();
			userObjective.deletedBy = session._id;

			userObjective.save((err, userObjective) => {
				if(err) {
					return callback(err, null);
				}

				return callback(null, userObjective);
			});
		},
		(userObjective, callback) => {
			HistoryRepository.addUserObjective(session._id, userObjectiveId, historyType, (err, historyEvent) => {
				if(err) {
					return  callback(err, null);
				}
				return callback(null, userObjective);
			});
		}
		], (err, result) => {
			return callback(err, result);
		})
};

UserObjectiveService.prototype.setScoreToKeyResult = function(userId, objectiveId, keyResultId, score, callback) {
	async.waterfall([
		(callback) => {
			UserObjectiveRepository.getById(objectiveId, (err, userObjective) => {
				if(err) {
					return callback(err, null);
				}

				if(isEmpty(userObjective)) {
					let err = new Error('Objective not found');
					return callback(err, null);
				}

				// TODO: Should be check for userObjective.isArchived
				// Removed temporary
				if(!userObjective.userId.equals(userId)) {
					let err = new Error('You are not allowed to do this');
					return callback(err, null);
				}

				return callback(null, userObjective);
			});
		},
		(userObjective, callback) => {
			let index = userObjective.keyResults.findIndex((keyResult) => {
				return keyResult._id.equals(keyResultId);
			});

			if(index === -1) {
				let err = new Error('Key result not found');
				return callback(err, null);
			}

			userObjective.keyResults[index].score = score;

			userObjective.save((err, userObjective) => {
				if(err) {
					return callback(err, null);
				}

				return callback(null, {
					objectiveId: userObjective._id,
					keyResultId: userObjective.keyResults[index]._id,
					score: userObjective.keyResults[index].score
				});
			});
		},
		(result, callback) => {
			HistoryRepository.setScoreToKeyResult(userId, result, CONST.history.type.CHANGE_SCORE, (err) =>{
				if (err)
					return callback(err, null);
			})
			return callback(null, result);
		}
		], (err, result) => {
			return callback(err, result);
		});
};

module.exports = new UserObjectiveService();