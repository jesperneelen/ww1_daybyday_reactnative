import {
	FETCH_EVENTS,
	FETCH_EVENTS_SUCCESS,
	SET_ACTIVE_EVENT,
	SET_PAGE,
	SET_MY_FAVOURITES,
	POPULATE_MY_FAVOURITE_EVENTS,
	PUSH_FAVOURITE_EVENT,
	PUSH_FAVOURITE_EVENT_SUCCESS,
	REMOVE_FROM_FAVOURITES,
	REMOVE_FROM_FAVOURITES_SUCCESS,
	POPULATE_FILTERED_EVENTS,
	CLEAR_FILTERED_EVENTS
} from '../actions/events';

const initialState = {
	isFetching: true,
	data: [],
	lastUpdated: null,
	totalCount: null,
	previousEvent: null,
	activeEvent: null,
	activeEventIndex: null,
	maxEventIndex: null,
	nextEvent: null,
	page: 0,
	myFavourites: [],
	myFavouriteEvents: [],
	pushingOrRemovingFavourite: false,
	activeEventIsInFavourite: false,
	filteredEvents: [],
	filteredEventsParams: []
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
				maxEventIndex: action.init && action.maxEventIndex !== null ? action.maxEventIndex : state.maxEventIndex,
				previousEvent: action.init && action.activeEventIndex !== null && action.activeEventIndex !== 0 ? action.events[action.activeEventIndex - 1] : state.previousEvent,
				nextEvent: action.init && action.activeEventIndex !== null && action.activeEventIndex < action.events.length - 1  ? action.events[action.activeEventIndex + 1] : state.nextEvent,
				activeEventIsInFavourite: action.init && action.activeEventId ? state.myFavourites.indexOf(action.activeEventId) > -1 : false
			});
		case SET_ACTIVE_EVENT:
			return Object.assign({}, state, {
				activeEvent: state.data[action.index],
				activeEventIndex: action.index,
				maxEventIndex: action.index > state.maxEventIndex ? action.index : state.maxEventIndex,
				previousEvent: action.index === 0 ? null : state.data[action.index - 1],
				nextEvent: action.index === state.data.length - 1 ? null : state.data[action.index + 1],
				activeEventIsInFavourite: state.myFavourites.indexOf(state.data[action.index]._id) > -1
			});
		case SET_PAGE:
			return Object.assign({}, state, {
				page: action.page
			});
		case SET_MY_FAVOURITES:
			return Object.assign({}, state, {
				myFavourites: action.myFavourites
			});
		case POPULATE_MY_FAVOURITE_EVENTS:
			return Object.assign({}, state, {
				myFavouriteEvents: action.myFavouriteEvents.sort((a, b) => a.DayInTheWar > b.DayInTheWar)
			});
		case PUSH_FAVOURITE_EVENT:
			return Object.assign({}, state, {
				pushingOrRemovingFavourite: true
			});
		case PUSH_FAVOURITE_EVENT_SUCCESS:
			return Object.assign({}, state, {
				myFavourites: [...state.myFavourites, action.eventId],
				myFavouriteEvents: [...state.myFavouriteEvents, state.data.find(event => event._id === action.eventId)].sort((a, b) => a.DayInTheWar > b.DayInTheWar),
				pushingOrRemovingFavourite: false,
				activeEventIsInFavourite: true
			});
		case REMOVE_FROM_FAVOURITES:
			return Object.assign({}, state, {
				pushingOrRemovingFavourite: true
			});
		case REMOVE_FROM_FAVOURITES_SUCCESS:
			return Object.assign({}, state, {
				myFavourites: state.myFavourites.filter(favourite => favourite !== action.eventId),
				myFavouriteEvents: state.myFavouriteEvents.filter(favouriteEvent => favouriteEvent._id !== action.eventId),
				pushingOrRemovingFavourite: false,
				activeEventIsInFavourite: false
			});
		case POPULATE_FILTERED_EVENTS:
			return Object.assign({}, state, {
				filteredEvents: action.filteredEvents,
				filteredEventsParams: [...state.filteredEventsParams, {
					tagId: action.params.tagId,
					tagDisplayName: action.params.tagDisplayName
				}]
			});
		case CLEAR_FILTERED_EVENTS:
			return Object.assign({}, state, {
				filteredEvents: [],
				filteredEventsParams: state.filteredEventsParams.filter(param => param.tagId !== action.tagId)
			});
		default:
			return Object.assign({}, state);
	}
}
