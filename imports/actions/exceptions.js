import uuid from 'uuid/v4';
import moment from 'moment';

export const HANDLE_EXCEPTION = 'EXCEPTION/HANDLE';
export const REMOVE_EXCEPTION = 'EXCEPTION/REMOVE';

function removeException(exceptionId) {
	return {
		type: REMOVE_EXCEPTION,
		Id: exceptionId
	};
}

export function handleException(type, message, errorObject, title = '') {
	return dispatch => {
		let exceptionId = uuid();

		dispatch({
			type: HANDLE_EXCEPTION,
			exceptionType: type,
			message,
			title,
			Id: exceptionId,
			createdAt: moment()
		});

		setTimeout(() => {
			dispatch(removeException(exceptionId));
		}, 3500);
	};
}
