import {
	SET_MAP_MARKERS,
	SET_MAP_MARKERS_EVENT,
	SET_MAP_MARKERS_EXTRA,
	CLEAR_MAP_MARKERS_EXTRA
} from '../actions/map';

const initialState = {
	markers: [],
	allEventMarkers: [],
	extraMarkers: [],
	removedMarkers: [],
	lastUpdated: Date.now()
};

export function map(state=initialState, action) {
	switch(action.type) {
		case SET_MAP_MARKERS:
			return Object.assign({}, state, {
				markers: action.markers,
				lastUpdated: Date.now()
			});
		case SET_MAP_MARKERS_EVENT:
			return Object.assign({}, state, {
				allEventMarkers: action.markers,
				lastUpdated: Date.now()
			});
		case SET_MAP_MARKERS_EXTRA:
			let markersToRemove = [
				...state.allEventMarkers.filter(marker => action.markerIDs.indexOf(marker._id) > - 1),
				...state.markers.filter(marker => action.markerIDs.indexOf(marker._id) > -1)
			];

			return Object.assign({}, state, {
				allEventMarkers: state.allEventMarkers.filter(marker => action.markerIDs.indexOf(marker._id) === -1),
				markers: state.markers.filter(marker => action.markerIDs.indexOf(marker._id) === -1),
				extraMarkers: action.markers,
				removedMarkers: markersToRemove,
				lastUpdated: Date.now()
			});
		case CLEAR_MAP_MARKERS_EXTRA:
			return Object.assign({}, state, {
				allEventMarkers: [...state.allEventMarkers, ...state.removedMarkers.filter(marker => !marker.isFromActiveEvent)],
				markers: [...state.markers, ...state.removedMarkers.filter(marker => marker.isFromActiveEvent)],
				removedMarkers: [],
				extraMarkers: [],
				lastUpdated: Date.now()
			});
		default:
			return Object.assign({}, state);
	}
}
