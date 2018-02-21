import { baseUrl, baseAppUrl } from './config';

export function getBasePath() {
	return baseUrl;
}

export function getBaseAppPath() {
	return baseAppUrl;
}

// USER SPECIFIC ROUTES
export function getUser() {
	return getBasePath() + '/user';
}

export function loginUser() {
	return getBasePath() + '/login';
}

export function logoutUser() {
	return getBasePath() + '/logout';
}

export function loginFbUser(userId) {
	return getBasePath() + `/login-fb/${userId}`;
}

export function register() {
	return getBasePath() + '/register';
}

// EVENTS
export function getEvents(skip=0, limit=50, totalCount=null) {
	return getBaseAppPath() + `/events?skip=${skip}&limit=${limit}&totalCount=${totalCount}`;
}
