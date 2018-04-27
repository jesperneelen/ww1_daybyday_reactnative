export const SET_MAP_MARKERS = 'SET/MAP/MARKERS';
export const SET_MAP_MARKERS_EVENT = 'SET/MAP/MARKERS/EVENTS';

export function setMarkers(tags = []) {
	return (dispatch) => {
		console.log('setMarkers', tags);

		let markers = mapMarkers(tags);

		dispatch({
			type: SET_MAP_MARKERS,
			markers
		});
	};
}

export function setAllEventMarkers(tags = []) {
	return (dispatch) => {
		console.log('setAllEventMarkers', tags);

		let markers = mapMarkers(tags);

		dispatch({
			type: SET_MAP_MARKERS_EVENT,
			markers
		});
	};
}

function mapMarkers(tags) {
	return tags.map((tag) => {
		return {
			longitude: tag.CityDetails.longitude,
			latitude: tag.CityDetails.latitude,
			title: tag.DisplayName,
			_id: tag._id
		};
	});
}
