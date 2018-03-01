import { setActiveEvent } from './events';
import { handleException } from './exceptions';
import UsersService from '../services/UsersService';

export const ADJUST_CURRENT_CONTROL = 'ADJUST/CURRENT/CONTROL';
export const SET_TIME_PASSED = 'SET/TIME/PASSED';
export const SET_PAUSED_TIME = 'SET/PAUSED/TIME';
export const SET_INTERVAL = 'SET/INTERVAL';
export const SET_INTERVAL_ERROR = 'There was a server error while adjusting your journey interval.';

let usersService = new UsersService();
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
		} else if((control === 'stop' || control === 'next/previous' || control === 'interval') && timerInterval) {
			clearInterval(timerInterval);
			dispatch(setTimePassed(0));
		}
	};
}

function play(pausedAt) {
	return (dispatch, getState) => {
		console.log('pausedAt', pausedAt);
		let timePassed = pausedAt && pausedAt !== null ? pausedAt : 0;
		console.log('time passed 1', timePassed);

		clearInterval(timerInterval);
		timerInterval = setInterval(() => {
			console.log('time passed 2', timePassed);
			timePassed += 1000;
			dispatch(setTimePassed(timePassed));

			if(timePassed === 10000 || timePassed > 10000) {
				timePassed = 0;
				let state = getState().events;
				let activeEventId = state.data[state.activeEventIndex + 1]._id;
				dispatch(setActiveEvent(state.activeEventIndex + 1, activeEventId));
			}
		}, 1000);

		console.log('end interval');

		/*let state = getState().events;
		let activeEventId = state.data[state.activeEventIndex + 1]._id;
		dispatch(setActiveEvent(state.activeEventIndex + 1, activeEventId));*/
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

export function adjustJourneyInterval(interval) {
	return dispatch => {
		return usersService.updateJourneyInterval(interval)
			.then(response => {
				if(response.success) {
					dispatch(setInterval(interval));
				} else {
					dispatch(handleException('error', SET_INTERVAL_ERROR));
				}
			})
			.catch(error => {
				dispatch(handleException('error', SET_INTERVAL_ERROR, error));
			});
	};
}

export function setInterval(interval) {
	return {
		type: SET_INTERVAL,
		interval
	};
}
