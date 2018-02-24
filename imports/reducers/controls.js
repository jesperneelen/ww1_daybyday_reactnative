import {
	ADJUST_CURRENT_CONTROL,
	SET_TIME_PASSED
} from '../actions/controls';

const initialState = {
	current: 'STOP', // PLAY - PAUSE - STOP
	timePassed: 0
};

export function controls(state=initialState, action) {
	switch(action.type) {
		case ADJUST_CURRENT_CONTROL:
			return Object.assign({}, state, {
				current: action.control
			});
		case SET_TIME_PASSED:
			return Object.assign({}, state, {
				timePassed: action.timePassed
			});
		default:
			return Object.assign({}, state);
	}
}
