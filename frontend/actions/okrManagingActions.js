import axios from 'axios';
import { ADD_REQUEST, REMOVE_REQUEST } from './appActions';

export const GET_OBJECTIVES_LIST = 'GET_OBJECTIVES_LIST'
export const OBJECTIVES_LIST_ERROR = 'OBJECTIVES_LIST_ERROR'
export const RECEIVED_OBJECTIVES_LIST = 'RECEIVED_OBJECTIVES_LIST'

export const SEARCH_OBJECTIVE = 'SEARCH_OBJECTIVE'
export const ACTIVE_OBJECTIVE = 'ACTIVE_OBJECTIVE'
export const ACTIVE_KEY_RESULT = 'ACTIVE_KEY_RESULT'

export const DELETE_OBJECTIVE = 'DELETE_OBJECTIVE'
export const DELETE_OBJECTIVE_ERROR = 'DELETE_OBJECTIVE_ERROR'
export const SOFT_DELETE_OBJECTIVE = 'SOFT_DELETE_OBJECTIVE'

export const EDIT_OBJECTIVE_TEMPLATE = 'EDIT_OBJECTIVE_TEMPLATE'
export const RECIVED_EDIT_OBJECTIVE_TEMPLATE ='RECIVED_EDIT_OBJECTIVE_TEMPLATE'
export const EDIT_OBJECTIVE_TEMPLATE_ERROR = 'EDIT_OBJECTIVE_TEMPLATE_ERROR'

export const DELETE_KEY_RESULT_TEMPLATE = 'DELETE_KEY_RESULT_TEMPLATE'
export const DELETE_KEY_RESULT_ERROR = 'DELETE_KEY_RESULT_ERROR'
export const SOFT_DELETE_KEY_RESULT = 'SOFT_DELETE_KEY_RESULT'

export const EDIT_KEY_RESULT = 'EDIT_KEY_RESULT'
export const RECIVED_EDIT_KEY_RESULT ='RECIVED_EDIT_KEY_RESULT'
export const RECIVED_EDIT_KEY_RESULT_ERROR = 'RECIVED_EDIT_KEY_RESULT_ERROR'

export const CREATE_NEW_TEMPLATE = 'CREATE_NEW_TEMPLATE';
export const RECEIVED_NEW_TEMPLATE = 'RECEIVED_NEW_TEMPLATE';
export const RECEIVED_NEW_TEMPLATE_ERROR = 'RECEIVED_NEW_TEMPLATE_ERROR';

export const CANCEL_EDIT_TEMPLATE = 'CANCEL_EDIT_TEMPLATE'

export function getObjectivesList(){
	
	return(dispatch, getStore) => {
		dispatch({ type: GET_OBJECTIVES_LIST });
		dispatch({ type: ADD_REQUEST });

		return axios.get('/api/objective/')
			.then(response => {
				dispatch(receivedObjectivesList(response.data));
				dispatch({ type: REMOVE_REQUEST });
			})
			.catch(response => {
				dispatch(objectivesListError(response.data));
				dispatch({ type: REMOVE_REQUEST });
			});
	};
}

export function objectivesListError(data) {
	return {
		type: OBJECTIVES_LIST_ERROR,
		data
	};
}

export function receivedObjectivesList(objectives) {
	return {
		type: RECEIVED_OBJECTIVES_LIST,
		objectives
	};
}

/*-----delete template------*/

export function deleteObjective(id){
	return(dispatch, getStore) => {
		dispatch({ type: DELETE_OBJECTIVE });
		dispatch({ type: ADD_REQUEST });

		return axios.put('/api/objective/softDelete/'+id)
			.then(response => {
				dispatch(softDeleteObjective(id));
				dispatch({ type: REMOVE_REQUEST });
			})
			.catch(response => {
				dispatch(deleteObjectiveError(response.data));
				dispatch({ type: REMOVE_REQUEST });
			});
	};
}

export function deleteObjectiveError(data) {
	return {
		type: DELETE_OBJECTIVE_ERROR,
		data
	};
}

export function softDeleteObjective(id) {
	return {
		type: SOFT_DELETE_OBJECTIVE,
		id
	};
}

/*-----delete key result------*/

export function deleteKeyResult(id){
	return(dispatch, getStore) => {

		dispatch({
			type: DELETE_KEY_RESULT_TEMPLATE
		});

		return axios.put('/api/keyResult/softDelete/'+id)
			.then(response => dispatch(softDeleteKyeResult(id)))
			.catch(response => dispatch(deleteObjectiveError(response.data)));
	};
}

export function deleteKeyResultError(data) {
	return {
		type: DELETE_KEY_RESULT_ERROR,
		data
	};
}

export function softDeleteKyeResult(id) {
	return {
		type: SOFT_DELETE_KEY_RESULT,
		id
	};
}

/*-----search template------*/

export function searchObjective(value) {
	const action = {
		type: SEARCH_OBJECTIVE,
		searchValue: value
	};
	return action;
}
/*-----cancel edit------*/
export function cancelEdit() {
	const action = {
		type: CANCEL_EDIT_TEMPLATE,
	};
	return action;
}
/*-----edit objective------*/

export function activeObjective (active) {
	const action = {
		type: ACTIVE_OBJECTIVE,
		active
	};

	return action;
}

export function editObjectiveTemplate (id, reqBody) {
	return(dispatch, getStore) => {
		dispatch({ type: EDIT_OBJECTIVE_TEMPLATE });
		dispatch({ type: ADD_REQUEST });

		return axios.put('/api/objective/'+id, reqBody)
			.then(response => {
				dispatch(recivedEditObjectiveTemplate(id, reqBody));
				dispatch({ type: REMOVE_REQUEST });
			})
			.catch(response => {
				dispatch(editObjectiveTemplateError(response.data));
				dispatch({ type: REMOVE_REQUEST });
			});
	};

	return action;
}

export function recivedEditObjectiveTemplate(id, objective) {
	return {
		type: RECIVED_EDIT_OBJECTIVE_TEMPLATE,
		objective,
		id
	};
}

export function editObjectiveTemplateError(data) {
	return {
		type: EDIT_OBJECTIVE_TEMPLATE_ERROR,
		data
	};
}

/*-----edit key result------*/

export function editKeyResult (id, reqBody) {
	return(dispatch, getStore) => {
		dispatch({ type: EDIT_KEY_RESULT });
		dispatch({ type: ADD_REQUEST });

		return axios.put('/api/keyResult/'+id, reqBody)
			.then(response => {
				dispatch(recivedEditKeyResult(id, reqBody));
				dispatch({ type: REMOVE_REQUEST });
			})
			.catch(response => {
				dispatch(editKeyResultError(response.data));
				dispatch({ type: REMOVE_REQUEST });
			});
	};

	return action;
}

export function recivedEditKeyResult(id, keyResult) {
	return {
		type: RECIVED_EDIT_KEY_RESULT,
		keyResult,
		id
	};
}

export function editKeyResultError(data) {
	return {
		type: RECIVED_EDIT_KEY_RESULT_ERROR,
		data
	};
}

export function activeKeyResult(activeKeyResult) {
	const action = {
		type: ACTIVE_KEY_RESULT,
		activeKeyResult
	};

	return action;
}

/*-----create new template------*/

export function createNewTemplate(reqBody) {

	return (dispatch, getStore) => {
		dispatch({ type: CREATE_NEW_TEMPLATE });
		dispatch({ type: ADD_REQUEST });

		return axios.post('/api/objective/', reqBody)
		.then(response => {
			dispatch(receivedNewTemplate(response.data));
			dispatch({ type: REMOVE_REQUEST });
		})
		.catch(response => {
			dispatch(receivedNewTemplateError(response.data));
			dispatch({ type: REMOVE_REQUEST });
		});
	};
}

export function receivedNewTemplateError(data) {
	return {
		type: RECEIVED_NEW_TEMPLATE_ERROR,
		data
	};
}

export function receivedNewTemplate(data) {
	return {
		type: RECEIVED_NEW_TEMPLATE,
		data
	};
}

