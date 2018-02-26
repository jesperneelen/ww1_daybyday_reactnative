import {
	ADJUST_CURRENT_CONTROL,
	SET_TIME_PASSED,
	SET_PAUSED_TIME
} from '../actions/controls';

const initialState = {
	current: 'STOP', // PLAY - PAUSE - STOP
	timePassed: 0,
	pausedAt: null
};

export function controls(state=initialState, action) {
	switch(action.type) {
		case ADJUST_CURRENT_CONTROL:
			return Object.assign({}, state, {
				current: action.control.toUpperCase()
			});
		case SET_TIME_PASSED:
			return Object.assign({}, state, {
				timePassed: action.timePassed
			});
		case SET_PAUSED_TIME:
			return Object.assign({}, state, {
				pausedAt: action.pauseTime
			});
		default:
			return Object.assign({}, state);
	}
}
