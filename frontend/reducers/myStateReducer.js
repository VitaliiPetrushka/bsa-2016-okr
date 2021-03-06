import { isEmpty } from '../../backend/utils/ValidateService';
import { currentYear, currentQuarter } from '../../backend/config/constants';
import {
	RECEIVED_MY_OBJECTIVES_ERROR,
	RECEIVED_MY_OBJECTIVES,
	CHANGE_TAB,
	CHANGE_YEAR,
	UPDATE_USER_OBJECTIVE,
	SOFT_DELETE_MY_OBJECTIVE_BY_ID,
	ADDED_NEW_OBJECTIVE,
	CHANGED_KEYRESULT_SCORE,
	CHANGED_KEYRESULT_SCORE_ERROR,
	//SOFT_DELETE_OBJECTIVE_KEY_RESULT_BY_ID_API,
	SOFT_DELETE_OBJECTIVE_KEY_RESULT_BY_ID_SUCCESS,
	NEW_QUARTER_ADDED,
	ADD_NEW_QUARTER_ERROR,
	CHANGE_ARCHIVE_STATUS,
	CHANGE_ARCHIVE_STATUS_LOCAL,
	RECEIVED_ME_BASIC
} from '../actions/myStateActions';

import {
	ADD_NEW_KEY_RESULT_TO_OBJECTIVE
} from '../actions/keyResultActions';

import { SET_ACTIVE_KEY_RESULT_ON_HOME_PAGE,
		     CANCEL_EDIT_KEY_RESULT} from '../actions/myStateActions';

const initialState = {
	selectedTab: currentQuarter,
	selectedYear: currentYear,
	me: {
		"localRole": ""
	},
	editing: false,
	activeKeyResult: '',
	editingKeyResult: false
};

export default function myObjectivesReducer(state = initialState, action = {}) {

	switch (action.type) {
		case RECEIVED_MY_OBJECTIVES_ERROR: {

			const { data } = action;

			console.log("RECEIVED_ERROR >>>" , data);
			console.log("state.me >>>", state.me);
			return Object.assign({}, state, {
				me: state.me
			});
		}

		case RECEIVED_MY_OBJECTIVES: {
			const { data } = action;

			return Object.assign({}, state, {
				me: isEmpty(data) ? state.me : data,
			});
		}

		case RECEIVED_ME_BASIC: {
			const { data } = action;

			return Object.assign({}, state, {
				me: isEmpty(data) ? state.me : data,
			});
		}

		case CHANGE_TAB: {
			const { selectedTab } = action;

			return Object.assign({}, state, {
				selectedTab: selectedTab
			});
		}

		case CHANGE_YEAR: {
			const { selectedYear } = action;

			return Object.assign({}, state, {
				selectedYear: selectedYear
			});
		}

		case NEW_QUARTER_ADDED : {
			return Object.assign({}, state);
		}

		case ADD_NEW_QUARTER_ERROR : {
			console.log(action.error);
			return state;
		}

		case SOFT_DELETE_MY_OBJECTIVE_BY_ID: {
			const { id } = action;

			return Object.assign({}, state, {
				me: deleteObjectiveFromMe(state.me, id)
			});

		}


		case CHANGE_ARCHIVE_STATUS: {

			console.log('archive');

			return state;
		}

		case CHANGE_ARCHIVE_STATUS_LOCAL: {
			let id = action.id;
			let flag = action.flag;

			return Object.assign({}, state, {
				me: changeArchiveInMyObjective(state.me, id, flag)
			})
		}


		case UPDATE_USER_OBJECTIVE: {
			const { id, description } = action;

			return Object.assign({}, state, {
				me: updateObjectiveDescription(state.me, id, description)
			});

		}

		//case SOFT_DELETE_OBJECTIVE_KEY_RESULT_BY_ID_API: {
		//	return state;
		//}

		case SOFT_DELETE_OBJECTIVE_KEY_RESULT_BY_ID_SUCCESS: {
			const { objectiveId, keyResultId, data } = action;

			//console.log('Reducer reached');

			return Object.assign({}, state, {
				me: deleteKeyResultFromObjective(state.me, objectiveId, keyResultId, data)
			});
		}

		case ADDED_NEW_OBJECTIVE: {
			const { responseData, requestData } = action;

			let newMe = addNewObjectiveToMe(state.me, requestData.quarterId, responseData);

			return Object.assign({}, state, {
				me: newMe
			});
		}

		case ADD_NEW_KEY_RESULT_TO_OBJECTIVE: {
			const { response, userObjectiveId } = action;

			let keyResultIdInObjective = response.keyResultId;
			let templateKeyResult = response.keyResult;

			let keyResult = {
				_id: keyResultIdInObjective,
				creator: templateKeyResult.creator,
				deletedBy: null,
				deletedDate: null,
				isDeleted: false,
				score: 0,
				templateId: {
					_id: templateKeyResult._id,
					createdAt: templateKeyResult.createdAt,
					creator: templateKeyResult.creator,
					difficulty: templateKeyResult.difficulty,
					isApproved: templateKeyResult.isApproved,
					isDeleted: templateKeyResult.isDeleted,
					objectiveId: templateKeyResult.objectiveId,
					title: templateKeyResult.title,
					updatedAt: templateKeyResult.updatedAt,
					used: templateKeyResult.used
				}
			};

			let newMe = addNewKeyResultToMe(state.me, userObjectiveId, keyResult);

			return Object.assign({}, state, {
				me: newMe,
			});
		}

		case CHANGED_KEYRESULT_SCORE: {
			let { data } = action;
			let { objectiveId, keyResultId, score } = data;
			console.log('myRed', data )
			return Object.assign({}, state, {
				me: setScoreToKeyResult(state.me, objectiveId, keyResultId, score),
			});
		}

		case CHANGED_KEYRESULT_SCORE_ERROR: {
			let { data } = action;

			console.log(CHANGED_KEYRESULT_SCORE_ERROR);
			console.log(data);

			return state;
		}

		case SET_ACTIVE_KEY_RESULT_ON_HOME_PAGE: {
			const { activeKeyResult } = action;

			return Object.assign({}, state, {
				activeKeyResult,
				editingKeyResult: true,
				editing: false
			})
		}

		case CANCEL_EDIT_KEY_RESULT: {
			return Object.assign({}, state, {
				editing: false,
				editingKeyResult: false
			})
		}

		default: {
			return state;
		}
	}
}

export function updateObjectiveDescription(me, id, description) {
	var meCopy = Object.assign({}, me);
	meCopy.quarters.forEach((quarter) => {
		for(var i=0 ; i<quarter.userObjectives.length; i++) {
			if(quarter.userObjectives[i]._id == id) {
				quarter.userObjectives[i].description = description;
			}
		}
	});
	return meCopy;
}

function deleteObjectiveFromMe(me, id) {
	var meCopy = Object.assign({}, me);
	meCopy.quarters.forEach((quarter) => {
		for(var i=0 ; i<quarter.userObjectives.length; i++) {
			if(quarter.userObjectives[i]._id == id) {
				quarter.userObjectives.splice(i, 1);
			}
		}
	});
	return meCopy;
}

function deleteKeyResultFromObjective(me, objectiveId, keyResultId, newKeyResult) {
	var meCopy = Object.assign({}, me);
	let quarterIndex, objectiveIndex, keyResultIndex;

	quarterIndex = meCopy.quarters.findIndex((quarter) => {
		objectiveIndex = quarter.userObjectives.findIndex((userObjective)=>{
			return userObjective._id === objectiveId;
		});
		if (objectiveIndex !== -1) {
			return true;
		}

		return false;
	});

	//console.log('Quarter index founded',quarterIndex,'objectiveIndex',objectiveIndex);

	if(quarterIndex !== -1) {
		keyResultIndex = meCopy.quarters[quarterIndex].userObjectives[objectiveIndex].keyResults.findIndex((keyResult) => {
			return keyResult._id === keyResultId;
		});
		if(keyResultIndex !== -1) {
			meCopy.quarters[quarterIndex].userObjectives[objectiveIndex].keyResults.splice(keyResultIndex, 1);
		}
	}
	//console.log('Success deleting keyResult from objective');
	return meCopy;
}

function setScoreToKeyResult(me, objectiveId, keyResultId, score) {
	const meCopy = Object.assign({}, me);

	let quarterIndex = -1;
	let	userObjectiveIndex = -1;
	let	keyResultIndex = -1;

	let quarterFoundedIndex = meCopy.quarters.findIndex((quarter) => {
		let userObjectiveFoundedIndex = quarter.userObjectives.findIndex((userObjective) => {
			return userObjective._id === objectiveId
		});

		if(userObjectiveFoundedIndex !== -1) {
			userObjectiveIndex = userObjectiveFoundedIndex;
			return true;
		}

		return false;
	});

	if(quarterFoundedIndex !== -1) {
		quarterIndex = quarterFoundedIndex;

		if (userObjectiveIndex !== -1) {
			let keyResultFoundedIndex = meCopy.quarters[quarterIndex].userObjectives[userObjectiveIndex].keyResults.findIndex((keyResult) => {
				return keyResult._id === keyResultId;
			});

			if (keyResultFoundedIndex !== -1) {
				keyResultIndex = keyResultFoundedIndex;
				meCopy.quarters[quarterIndex].userObjectives[userObjectiveIndex].keyResults[keyResultIndex].score = score;
			}
		}
	}

	return meCopy;
}

function addNewObjectiveToMe(me, quarterId, objective) {
	let meCopy = Object.assign({}, me);

	let index = meCopy.quarters.findIndex((quarter) => {
		return quarter._id == quarterId;
	});

	if(index !== -1) {
		meCopy.quarters[index].userObjectives.push(objective);
	}

	return meCopy;
}

function addNewKeyResultToMe(me, objectiveId, keyResult) {
	var meCopy = Object.assign({}, me);

	meCopy.quarters.forEach((quarter) => {
		let index = quarter.userObjectives.findIndex((userObjective) => {
			return userObjective._id == objectiveId;
		});

		if (index !== -1) {
			quarter.userObjectives[index].keyResults.push(keyResult);
		}
	});
	return meCopy
}

export function changeArchiveInMyObjective (me, objectiveId, flag) {
	var meCopy = Object.assign({}, me);
	var done = false;

console.log('IN ARCHIVE')
	meCopy.quarters.forEach((quarter) => {
		if(done)
			return;
console.log('IN QUARTER')
		quarter.userObjectives.forEach((objective) => {
console.log('----IN OBJ----')
console.log(objective._id);
console.log(objectiveId);
			if (objective._id == objectiveId){
				objective.isArchived = flag;
				console.log('objective archived >>>>')
				console.log(objective);
				done = true;
				return;
			}
		})
	})

	return meCopy;
}
