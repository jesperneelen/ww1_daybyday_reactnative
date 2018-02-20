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
	REGISTERING_COMPLETE
} from '../actions/session';

const initialState = {
	authenticating: false,
	authenticated: false,
	error: null,
	user: null,
	fetchingProfile: true,
	fetchingProfileError: false,
	registeringUser: false
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
				user: action.profile
			});
		case LOGIN_ERROR:
			return Object.assign({}, state, {
				authenticating: false,
				authenticated: false
			});
		case LOGGED_OUT:
			return Object.assign({}, state, {
				authenticating: false,
				authenticated: false,
				user: null,
				error: null,
				fetchingProfile: false,
				fetchingProfileError: false
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
				authenticated: true
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
		case REGISTERING_COMPLETE:
			return Object.assign({}, state, {
				registeringUser: false,
				user: action.user,
				authenticated: true
			});
		default:
			return Object.assign({}, state);
	}
}
