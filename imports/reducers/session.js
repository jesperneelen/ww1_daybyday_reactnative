import {
	LOGIN_BUSY,
	LOGIN_COMPLETED,
	LOGIN_FB_COMPLETE,
	LOGIN_ERROR,
	LOGGED_OUT,
	FETCHING_PROFILE,
	SET_PROFILE,
	FETCHING_PROFILE_ERROR,
	REGISTERING_USER,
	REGISTERING_USER_ERROR,
	REGISTERING_COMPLETE,
	INIT_NO_ACCOUNT,
	CLEAR_SESSION_NO_ACCOUNT
} from '../actions/session';

const initialState = {
	authenticating: false,
	authenticated: false,
	error: null,
	user: null,
	fetchingProfile: true,
	fetchingProfileError: false,
	registeringUser: false,
	initNoAccount: false
};

export function session(state = initialState, action) {
	switch(action.type) {
		case LOGIN_BUSY:
			return Object.assign({}, state, {
				authenticating: true
			});
		case LOGIN_FB_COMPLETE:
		case LOGIN_COMPLETED:
			return Object.assign({}, state, {
				authenticating: false,
				authenticated: true,
				fetchingProfileError: false,
				user: action.profile,
				initNoAccount: false
			});
		case LOGIN_ERROR:
			return Object.assign({}, state, {
				authenticating: false,
				authenticated: false
			});
		case LOGGED_OUT:
			return Object.assign({}, initialState, {
				fetchingProfile: false
			});
		case FETCHING_PROFILE:
			return Object.assign({}, state, {
				fetchingProfile: true,
			});
		case SET_PROFILE:
			return Object.assign({}, state, {
				fetchingProfileError: false,
				fetchingProfile: false,
				user: action.profile,
				authenticated: true,
				initNoAccount: false
			});
		case FETCHING_PROFILE_ERROR:
			return Object.assign({}, state, {
				fetchingProfileError: true,
				fetchingProfile: false,
				user: null
			});
		case REGISTERING_USER:
			return Object.assign({}, state, {
				registeringUser: true
			});
		case REGISTERING_USER_ERROR:
			return Object.assign({}, state, {
				registeringUser: false
			});
		case REGISTERING_COMPLETE:
			return Object.assign({}, state, {
				registeringUser: false,
				user: action.user,
				authenticated: true,
				initNoAccount: false
			});
		case INIT_NO_ACCOUNT:
			return Object.assign({}, state, {
				initNoAccount: true,
				authenticated: true,
				fetchingProfile: false
			});
		case CLEAR_SESSION_NO_ACCOUNT:
			return Object.assign({}, state, {
				initNoAccount: false,
				authenticated: false
			});
		default:
			return Object.assign({}, state);
	}
}
