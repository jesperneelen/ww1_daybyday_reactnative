import { handleException } from './exceptions';
import EventsService from '../services/EventsService';
import UsersService from '../services/UsersService';

let eventsService = new EventsService();
let usersService = new UsersService();

export const FETCH_EVENTS = 'FETCH/EVENTS';
export const FETCH_EVENTS_SUCCESS = 'FETCH/EVENTS/SUCCESS';
const FETCH_EVENTS_ERROR = 'There was a server error while loading the events';

export const SET_ACTIVE_EVENT = 'SET/ACTIVE/EVENT';
export const SET_PAGE = 'SET/PAGE';

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

			if(state && state.user && state.user.ActiveEventIndex !== null) {
				skip = 0;
				rounded = Math.round(state.user.ActiveEventIndex / 50) + 1;
				limit = rounded * 50;
			}
		}

		return eventsService.getEvents(skip, limit, totalCount)
			.then(response => {
				dispatch({
					type: FETCH_EVENTS_SUCCESS,
					events: response.events,
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

function updateActiveEvent(activeEvent, activeEventIndex, maxEventIndex) {
	return usersService.updateActiveEvent(activeEvent, activeEventIndex, maxEventIndex)
		.then(response => {
			if(response.success) {
				//console.log('updateActiveEvent successful!', response);
			}
		})
		.catch(error => {
			console.log('updateActiveEvent error', error);
		});
}
