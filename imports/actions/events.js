import { handleException } from './exceptions';
import EventsService from '../services/EventsService';

let eventsService = new EventsService();

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

export function fetchEvents(skip, limit, totalCount) {
	return dispatch => {
		dispatch(fetchingEvents());

		return eventsService.getEvents(skip, limit, totalCount)
			.then(response => {
				dispatch({
					type: FETCH_EVENTS_SUCCESS,
					events: response.events,
					totalCount: response.totalCount,
					receivedAt: Date.now()
				});
			})
			.catch(error => {
				dispatch(handleException('error', FETCH_EVENTS_ERROR, error));
			});
	};
}

export function setActiveEvent(idx) {
	return (dispatch, getState) => {
		const state = getState().events;
		if(idx === state.data.length - 2 && idx < state.totalCount) {
			dispatch(fetchEvents(state.data.length, 50, state.totalCount));
			dispatch(setPage(state.page + 1));
		}

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
