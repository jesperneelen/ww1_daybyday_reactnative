import { setActiveEvent } from './events';

export const ADJUST_CURRENT_CONTROL = 'ADJUST/CURRENT/CONTROL';
export const SET_TIME_PASSED = 'SET/TIME/PASSED';
export const SET_PAUSED_TIME = 'SET/PAUSED/TIME';

let timerInterval = null;

export function adjustCurrentControl(control) {
	return (dispatch, getState) => {

		let state = getState().controls;
		let pausedAt = null;
		if(state.current === 'PAUSE' && control === 'play') {
			pausedAt = state.pausedAt;
		}

		dispatch({
			type: ADJUST_CURRENT_CONTROL,
			control
		});

		if(control === 'play') {
			dispatch(play(pausedAt));
		} else if(control === 'pause') {
			let state = getState().controls;
			clearInterval(timerInterval);
			dispatch(setPausedTime(state.timePassed));
		} else if(control === 'stop' && timerInterval) {
			clearInterval(timerInterval);
			dispatch(setTimePassed(0));
		}
	};
}

function play(pausedAt) {
	return (dispatch, getState) => {
		let timePassed = pausedAt && pausedAt !== null ? pausedAt : 0;
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

function setPausedTime(pauseTime) {
	return {
		type: SET_PAUSED_TIME,
		pauseTime
	};
}
