import { setActiveEvent } from './events';
import { handleException } from './exceptions';
import UsersService from '../services/UsersService';

export const ADJUST_CURRENT_CONTROL = 'ADJUST/CURRENT/CONTROL';
export const SET_TIME_PASSED = 'SET/TIME/PASSED';
export const SET_PAUSED_TIME = 'SET/PAUSED/TIME';
export const SET_CONTROL_INTERVAL = 'SET/CONTROL/INTERVAL';
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
		let timePassed = pausedAt && pausedAt !== null ? pausedAt : 0;

		timerInterval = setInterval(() => {
			timePassed += 1000;
			dispatch(setTimePassed(timePassed));

			let interval = getState().controls.interval;

			if(timePassed === interval || timePassed > interval) {
				timePassed = 0;
				let state = getState().events;

				let activeEventId = state.data[state.activeEventIndex + 1] && state.data[state.activeEventIndex + 1]._id;
				if(activeEventId) dispatch(setActiveEvent(state.activeEventIndex + 1, activeEventId));

				// stop the journey when we reach the last event
				if(state.activeEventIndex + 2 === state.totalCount || state.activeEventIndex + 1 === state.totalCount) {
					dispatch(adjustCurrentControl('stop'));
				}
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

export function adjustJourneyInterval(interval) {
	return (dispatch, getState) => {
		const initNoAccount = getState().session.initNoAccount;

		if(!initNoAccount) {
			return usersService.updateJourneyInterval(interval)
				.then(response => {
					if(response.success) {
						dispatch(setControlInterval(interval));
					} else {
						dispatch(handleException('error', SET_INTERVAL_ERROR));
					}
				})
				.catch(error => {
					dispatch(handleException('error', SET_INTERVAL_ERROR, error));
				});
		} else {
			dispatch(setControlInterval(interval));
		}
	};
}

export function setControlInterval(interval) {
	return {
		type: SET_CONTROL_INTERVAL,
		interval
	};
}
