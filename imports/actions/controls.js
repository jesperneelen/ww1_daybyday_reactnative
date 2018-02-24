import { setActiveEvent } from './events';

export const ADJUST_CURRENT_CONTROL = 'ADJUST/CURRENT/CONTROL';
export const SET_TIME_PASSED = 'SET/TIME/PASSED';

let playInterval = null;
let timerInterval = null;


export function adjustCurrentControl(control) {
	return dispatch => {

		dispatch({
			type: ADJUST_CURRENT_CONTROL,
			control
		});

		if(control === 'play') {
			dispatch(play());
		} else if(control === 'pause') {
			console.log('ACTIVATE PAUSE');
		} else if(control === 'stop' && timerInterval) {
			console.log('ACTIVATE STOP');
			clearInterval(timerInterval);
			dispatch(setTimePassed(0));
		}
	};
}

function play() {
	return (dispatch, getState) => {
		let timePassed = 0;
		timerInterval = setInterval(() => {
			timePassed += 1000;
			dispatch(setTimePassed(timePassed));

			if(timePassed === 10000) {
				timePassed = 0;
				let state = getState().events;
				let activeEventId = state.data[state.activeEventIndex + 1]._id;
				dispatch(setActiveEvent(state.activeEventIndex + 1, activeEventId));
			}
		}, 1000);
	};
}

function setTimePassed(timePassed) {
	return {
		type: SET_TIME_PASSED,
		timePassed
	};
}
