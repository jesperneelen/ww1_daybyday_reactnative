import {
	FETCH_EVENTS,
	FETCH_EVENTS_SUCCESS
} from '../actions/events';

const initialState = {
	isFetching: true,
	data: [],
	lastUpdated: null
};

export function events(state = initialState, action) {
	switch(action.type) {
		case FETCH_EVENTS:
			return Object.assign({}, state, {
				isFetching: true
			});
		case FETCH_EVENTS_SUCCESS:
			return Object.assign({}, state, {
				isFetching: false,
				data: action.events,
				lastUpdated: action.receivedAt
			});
		default:
			return Object.assign({}, state);
	}
}
