export const SET_MAP_MARKERS = 'SET/MAP/MARKERS';
export const SET_MAP_MARKERS_EVENT = 'SET/MAP/MARKERS/EVENTS';
export const SET_MAP_MARKERS_EXTRA = 'SET/MAP/MARKERS/EXTRA';
export const CLEAR_MAP_MARKERS_EXTRA = 'CLEAR/MAP/MARKERS/EXTRA';

export function setMarkers(tags = []) {
	return dispatch => {
		let markers = mapMarkers(tags, true);

		dispatch({
			type: SET_MAP_MARKERS,
			markers
		});
	};
}

export function setAllEventMarkers(tags = []) {
	return dispatch => {
		let markers = mapMarkers(tags);

		dispatch({
			type: SET_MAP_MARKERS_EVENT,
			markers
		});
	};
}

export function setExtraMarkers(tags = []) {
	return dispatch => {
		let markers = mapMarkers(tags);

		dispatch({
			type: SET_MAP_MARKERS_EXTRA,
			markers,
			markerIDs: markers.reduce((acc, cur) => {
				acc.push(cur._id);
				return acc;
			}, [])
		});
	};
}

export function clearExtraMarkers() {
	return {
		type: CLEAR_MAP_MARKERS_EXTRA
	};
}

function mapMarkers(tags, isFromActiveEvent=false) {
	return tags.map(tag => {
		return {
			longitude: tag.CityDetails.longitude,
			latitude: tag.CityDetails.latitude,
			title: tag.DisplayName,
			_id: tag._id,
			//for the extraMarkers state prop => make a distinct between the events/active event markers
			isFromActiveEvent
		};
	});
}
