import { handleException } from './exceptions';
import { setMarkers, setAllEventMarkers, clearExtraMarkers } from './map';
import EventsService from '../services/EventsService';
import UsersService from '../services/UsersService';

let eventsService = new EventsService();
let usersService = new UsersService();

export const FETCH_EVENTS = 'FETCH/EVENTS';
export const FETCH_EVENTS_SUCCESS = 'FETCH/EVENTS/SUCCESS';
const FETCH_EVENTS_ERROR = 'There was a server error while loading the events';

export const SET_ACTIVE_EVENT = 'SET/ACTIVE/EVENT';
export const SET_PAGE = 'SET/PAGE';
export const SET_SIDE_EVENT = 'SET/SIDE/EVENT';

export const SET_MY_FAVOURITES = 'SET/MY/FAVOURITES';
export const POPULATE_MY_FAVOURITE_EVENTS = 'POPULATE/MY/FAVOURITE/EVENTS';
export const PUSH_FAVOURITE_EVENT = 'PUSH/FAVOURITE/EVENT';
export const PUSH_FAVOURITE_EVENT_SUCCESS = 'PUSH/FAVOURITE/EVENT/SUCCESS';
export const REMOVE_FROM_FAVOURITES = 'REMOVE/FROM/FAVOURITES';
export const REMOVE_FROM_FAVOURITES_SUCCESS = 'REMOVE/FROM/FAVOURITES/SUCCESS';

export const POPULATE_FILTERED_EVENTS = 'POPULATE/FILTERED/EVENTS';
export const CLEAR_FILTERED_EVENTS = 'CLEAR/FILTERED/EVENTS';

function fetchingEvents() {
	return {
		type: FETCH_EVENTS
	};
}

export function fetchEvents(init, skip, limit, totalCount) {
	return (dispatch, getState) => {
		dispatch(fetchingEvents());

		let state, rounded;
		if(init) {
			state = getState().session;

			if(state && state.user && state.user.MaxEventIndex !== null) {
				skip = 0;
				rounded = Math.round(state.user.MaxEventIndex / 50) + 1;
				limit = rounded * 50;
			}
		}

		return eventsService.getEvents(skip, limit, totalCount)
			.then(response => {
				if(init && state && state.user && state.user.ActiveEventIndex !== null && response.events && response.events.length > 0 && Array.isArray(response.events)) {
					let idx = state.user.ActiveEventIndex;
					getAndSetMarkers(dispatch, response.events, idx);
				}

				let myFavouriteEventIds = getState().events.myFavourites;
				let eventsData = !init ? getState().events.data : [];

				let eventsWithExtraData = response.events.reduce((acc, cur, idx) => {
					if(init) {
						cur.eventIndex = idx;
					} else {
						cur.eventIndex = eventsData.length + idx;
					}

					cur.isFavouriteEvent = myFavouriteEventIds.indexOf(cur._id) > - 1;

					cur.HasCityTags = !!(cur.Tags.find(tag => tag.IsCity));
					acc.push(cur);
					return acc;
				}, []);


				if(init && myFavouriteEventIds && myFavouriteEventIds.length > 0 && Array.isArray(myFavouriteEventIds)
						&& response.events && response.events.length > 0 && Array.isArray(response.events)) {
					let populatedEvents = response.events.reduce((acc, cur) => {
						if(myFavouriteEventIds.indexOf(cur._id) > -1) {
							acc.push(cur);
						}
						return acc;
					}, []);

					dispatch(populateMyFavouriteEvents(populatedEvents));
				}

				dispatch({
					type: FETCH_EVENTS_SUCCESS,
					events: eventsWithExtraData,
					totalCount: response.totalCount,
					receivedAt: Date.now(),
					page: rounded - 1,
					init,
					maxEventIndex: state && state.user && state.user.MaxEventIndex !== null ? state.user.MaxEventIndex : null,
					activeEventIndex: state && state.user && state.user.ActiveEventIndex !== null ? state.user.ActiveEventIndex : null,
					activeEventId: state && state.user && state.user.ActiveEvent ? state.user.ActiveEvent._id : null
				});
			})
			.catch(error => {
				dispatch(handleException('error', FETCH_EVENTS_ERROR, error));
			});
	};
}

export function setActiveEvent(idx, eventId) {
	return (dispatch, getState) => {
		const state = getState().events;
		if(idx === state.data.length - 2 && idx < state.totalCount) {
			dispatch(fetchEvents(state.data.length, 50, state.totalCount));
			dispatch(setPage(state.page + 1));
		}

		dispatch(clearExtraMarkers());
		getAndSetMarkers(dispatch, state.data, idx);
		updateActiveEvent(eventId, idx, state.maxEventIndex <= idx ? idx : state.maxEventIndex);

		dispatch({
			type: SET_ACTIVE_EVENT,
			index: idx
		});
	};
}

export function setPage(page) {
	return {
		type: SET_PAGE,
		page
	};
}

export function setSideEvent(sideEvent) {
	return {
		type: SET_SIDE_EVENT,
		sideEvent
	};
}

function updateActiveEvent(activeEvent, activeEventIndex, maxEventIndex) {
	return usersService.updateActiveEvent(activeEvent, activeEventIndex, maxEventIndex)
		.then(response => {
			if(response.success) {
				//console.log('updateActiveEvent successful!', response);
			} else {
				//TODO: error handling
			}
		})
		.catch(error => {
			console.log('updateActiveEvent error', error);
		});
}

function getAndSetMarkers(dispatch, events, eventIndex) {
	let markerIDs = [];
	let idx = eventIndex;

	if(events && events[idx] && events[idx].Tags
		&& events[idx].Tags.length > 0 && Array.isArray(events[idx].Tags)) {
		let cityTags = events[idx].Tags.filter(tag => {
			markerIDs.push(tag._id);
			return tag.IsCity;
		});

		if(cityTags && Array.isArray(cityTags)) {
			dispatch(setMarkers(cityTags));
		}
	}

	if(events && events.length > 0 && Array.isArray(events)) {
		let allEventMarkers = [];
		let allMarkerIDs = [];

		for(let i = 0; i < idx; i++) {
			let event = events[i];
			if(event.Tags && event.Tags.length > 0 && Array.isArray(event.Tags)) {
				let cityTags = event.Tags.filter(tag => {
					let result = tag.IsCity && markerIDs.indexOf(tag._id) === -1 && allMarkerIDs.indexOf(tag._id) === -1;
					allMarkerIDs.push(tag._id);
					return result;
				});

				allEventMarkers = [...allEventMarkers, ...cityTags];
			}
		}

		dispatch(setAllEventMarkers(allEventMarkers.sort((a, b) => a.DisplayName > b.DisplayName ? 1 : -1)));
	}
}


export function setMyFavourites(myFavourites) {
	return {
		type: SET_MY_FAVOURITES,
		myFavourites
	};
}

export function populateMyFavouriteEvents(myFavouriteEvents) {
	return {
		type: POPULATE_MY_FAVOURITE_EVENTS,
		myFavouriteEvents
	};
}

export function pushNewFavouriteEvent(eventId) {
	return (dispatch) => {
		dispatch({
			type: PUSH_FAVOURITE_EVENT
		});

		return usersService.pushNewFavouriteEvent(eventId)
			.then(response => {
				console.log('pushNewFavouriteEvent success', response);
				if(response.success) {
					setTimeout(() => {
						dispatch({
							type: PUSH_FAVOURITE_EVENT_SUCCESS,
							eventId
						});
					}, 350);
				} else {
					//TODO: error handling
				}
			})
			.catch(error => {
				console.log('pushNewFavouriteEvent error', error);
			});
	};
}

export function removeFromMyFavourites(eventId, noTimeOut=false) {
	return dispatch => {
		dispatch({
			type: REMOVE_FROM_FAVOURITES
		});

		return usersService.removeFromMyFavourites(eventId)
			.then(response => {
				console.log('removeFromMyFavourites success', response);
				if(response.success) {
					setTimeout(() => {
						dispatch({
							type: REMOVE_FROM_FAVOURITES_SUCCESS,
							eventId
						});
					}, noTimeOut ? 0 : 350);
				} else {
					//TODO: error handling
				}
			})
			.catch(error => {
				console.log('removeFromMyFavourites error', error);
			});
	};
}


export function populateFilteredEvents(tagId, tagDisplayName) {
	return (dispatch, getState) => {
		const {
			data: events,
			maxEventIndex
		} = getState().events;

		let filteredEvents = events.slice(0, maxEventIndex).filter(event => {
			return event && event.Tags && event.Tags.length > 0 && Array.isArray(event.Tags)
				&& event.Tags.find(tag => tag._id === tagId && tag.DisplayName === tagDisplayName);
		});

		dispatch({
			type: POPULATE_FILTERED_EVENTS,
			filteredEvents,
			params: {
				tagId,
				tagDisplayName
			}
		});
	};
}

export function clearFilteredEvents(tagId) {
	return {
		type: CLEAR_FILTERED_EVENTS,
		tagId
	};
}
