import {
	FETCH_EVENTS,
	FETCH_EVENTS_SUCCESS,
	SET_ACTIVE_EVENT,
	SET_PAGE
} from '../actions/events';

const initialState = {
	isFetching: true,
	data: [],
	lastUpdated: null,
	totalCount: null,
	previousEvent: null,
	activeEvent: null,
	activeEventIndex: null,
	nextEvent: null,
	page: 0
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
				data: state.data.concat(action.events),
				lastUpdated: action.receivedAt,
				totalCount: action.totalCount,
				page: action.init ? action.page : state.page,
				activeEvent: action.init && action.activeEventId ? action.events.find(event => event._id === action.activeEventId) : state.activeEvent,
				activeEventIndex: action.init && action.activeEventIndex !== null ? action.activeEventIndex : state.activeEventIndex,
				previousEvent: action.init && action.activeEventIndex !== null && action.activeEventIndex !== 0 ? action.events[action.activeEventIndex - 1] : state.previousEvent,
				nextEvent: action.init && action.activeEventIndex !== null && action.activeEventIndex < action.events.length - 1  ? action.events[action.activeEventIndex + 1] : state.nextEvent
			});
		case SET_ACTIVE_EVENT:
			return Object.assign({}, state, {
				activeEvent: state.data[action.index],
				activeEventIndex: action.index,
				previousEvent: action.index === 0 ? null : state.data[action.index - 1],
				nextEvent: action.index === state.data.length - 1 ? null : state.data[action.index + 1]
			});
		case SET_PAGE:
			return Object.assign({}, state, {
				page: action.page
			});
		default:
			return Object.assign({}, state);
	}
}
