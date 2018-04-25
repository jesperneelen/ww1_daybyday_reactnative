import {
	SET_MAP_MARKERS,
	SET_MAP_MARKERS_EVENT
} from '../actions/map';

const initialState = {
	markers: [],
	allEventMarkers: []
};

export function map(state=initialState, action) {
	switch(action.type) {
		case SET_MAP_MARKERS:
			return Object.assign({}, state, {
				markers: action.markers
			});
		case SET_MAP_MARKERS_EVENT:
			return Object.assign({}, state, {
				allEventMarkers: action.markers
			});
		default:
			return Object.assign({}, state);
	}
}
