import { handleException } from './exceptions';
import { setControlInterval } from './controls';
import { setMyFavourites } from './events';
import UsersService from '../services/UsersService';

let usersService = new UsersService();

export const LOGIN_BUSY = 'LOGIN//USER';
export const LOGIN_COMPLETED = 'LOGIN/COMPLETED';
export const LOGIN_ERROR = 'LOGIN/ERROR';
export const LOGIN_FB_COMPLETE = 'LOGIN/FB/COMPLETED';
export const LOGGED_OUT = 'LOGIN/LOGGED_OUT';
export const FETCHING_PROFILE = 'FETCHING/PROFILE';
export const FETCHING_PROFILE_ERROR = 'FETCHING/PROFILE/ERROR';
export const SET_PROFILE = 'SET/PROFILE';
export const REGISTERING_USER = 'REGISTERING/USER';
export const REGISTERING_COMPLETE = 'REGISTERING/COMPLETE';

export const LOGIN_SUCCESSFUL = 'Successfully logged in!';
export const LOGIN_INTERNAL_ERROR = 'There was a server error while trying to log in';
export const LOGOUT_SUCCESSFUL = 'Successfully logged out!';
export const LOGOUT_ERROR = 'There was a server error while trying to log out';
export const LOGIN_FB_SUCCESSFUL = 'Successfully logged in with Facebook!';
export const LOGIN_FB_ERROR = 'There was a server error while trying to log in with Facebook';
export const REGISTER_SUCCESSFUL = 'Successfully registered';
export const REGISTER_ERROR = 'There was a server error while trying to register you as a new user';


export function loginFbComplete(fbUserId) {
	return dispatch => {
		return usersService.loginFb(fbUserId)
			.then(response => {
				dispatch({
					type: LOGIN_FB_COMPLETE,
					profile: response
				});
				dispatch(setMyFavourites(response.MyFavouriteEvents));
				dispatch(setControlInterval(response.JourneyInterval));
				dispatch(handleException('success', LOGIN_FB_SUCCESSFUL));
			})
			.catch(error => {
				dispatch(handleException('error', LOGIN_FB_ERROR));
			});
	};
}

function loggingIn() {
	return {
		type: LOGIN_BUSY
	};
}

function loginComplete(profile) {
	return {
		type: LOGIN_COMPLETED,
		profile
	};
}

function loginError() {
	return {
		type: LOGIN_ERROR
	};
}

export function logInUser(username, password) {
	return dispatch => {
		dispatch(loggingIn());

		return usersService.login(username, password)
			.then(response => {
				dispatch(loginComplete(response));
				dispatch(setMyFavourites(response.MyFavouriteEvents));
				dispatch(setControlInterval(response.JourneyInterval));
				dispatch(handleException('success', LOGIN_SUCCESSFUL));
			})
			.catch(error => {
				dispatch(loginError());
				if(error.name === 'InternalException') {
					dispatch(handleException('error', LOGIN_INTERNAL_ERROR, error));
				} else if(error.name === 'LoginException') {
					dispatch(handleException('error', error.message, error));
				}
			});
	};
}

export function loggedOut() {
	return {
		type: LOGGED_OUT
	};
}

export function redirLogin() {
	//return push('/login');
}

export function logOutUser() {
	return function (dispatch) {
		dispatch(loggedOut());

		return usersService.logout()
			.then(response => {
				console.log('logOutUser response', response);
				dispatch(redirLogin());
				dispatch(handleException('success', LOGOUT_SUCCESSFUL));
			})
			.catch(error => {
				dispatch(handleException('error', LOGOUT_ERROR));
				console.log('logOutUser error', error);
			});
	};
}

function setProfile(profile) {
	return {
		type: SET_PROFILE,
		profile
	};
}

function fetchingProfile() {
	return {
		type: FETCHING_PROFILE
	};
}

function fetchingProfileError() {
	return {
		type: FETCHING_PROFILE_ERROR
	};
}

export function fetchProfile() {
	return dispatch => {
		dispatch(fetchingProfile());

		return usersService.getUser()
			.then(response => {
				setTimeout(() => {
					dispatch(setMyFavourites(response.MyFavouriteEvents));
					dispatch(setControlInterval(response.JourneyInterval));
					dispatch(setProfile(response));
				}, 750);
			})
			.catch(() => {
				dispatch(fetchingProfileError());
			});
	};
}


function registeringUser() {
	return {
		type: REGISTERING_USER
	};
}

function registerComplete(newUserProfile) {
	return {
		type: REGISTERING_COMPLETE,
		user: newUserProfile
	};
}

export function register(newUser) {
	return dispatch => {
		dispatch(registeringUser());

		return usersService.register(newUser)
			.then(response => {
				if(response.success && response.user) {
					dispatch(setMyFavourites(response.user.MyFavouriteEvents));
					dispatch(setControlInterval(response.user.JourneyInterval));
					dispatch(registerComplete(response.user));
					dispatch(handleException('success', REGISTER_SUCCESSFUL));
				} else if(!response.success) {
					dispatch(handleException('error', response.error));
				}
			})
			.catch(error => {
				dispatch(handleException('error', REGISTER_ERROR, error));
			});
	};
}
