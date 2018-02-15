import {
	HANDLE_EXCEPTION,
	REMOVE_EXCEPTION
} from '../actions/exceptions';

const initialState = [];

export function exceptions(state=initialState, action) {
	switch(action.type) {
		case HANDLE_EXCEPTION:
			return [
				...state,
				{
					type: action.exceptionType,
					message: action.message,
					title: action.title,
					Id: action.Id,
					removed: false,
					createdAt: action.createdAt,
					sortValue: Date.now()
				}
			];
		case REMOVE_EXCEPTION:
			return state.map((exception) => {
				if(exception.Id === action.Id) {
					return Object.assign({}, exception, {
						removed: true
					});
				}

				return exception;
			});
		default:
			return state;
	}
}
