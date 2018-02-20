import { baseUrl } from './config';

export function getBasePath() {
	return baseUrl;
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

//EVENTS
export function getEvents() {
	return getBasePath() + '/events';
}
