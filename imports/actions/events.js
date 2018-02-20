import { handleException } from './exceptions';
import EventsService from '../services/EventsService';

let eventsService = new EventsService();

export const FETCH_EVENTS = 'FETCH/EVENTS';
export const FETCH_EVENTS_SUCCESS = 'FETCH/EVENTS/SUCCESS';
const FETCH_EVENTS_ERROR = 'There was a server error while loading the events';

function fetchingEvents() {
	return {
		type: FETCH_EVENTS
	};
}

export function fetchEvents() {
	return dispatch => {
		dispatch(fetchingEvents());

		return eventsService.getEvents()
			.then(response => {
				dispatch({
					type: FETCH_EVENTS_SUCCESS,
					events: response,
					receivedAt: Date.now()
				});
			})
			.catch(error => {
				dispatch(handleException('error', FETCH_EVENTS_ERROR, error));
			});
	};
}
