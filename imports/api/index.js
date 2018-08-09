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

export function updateActiveEvent() {
	return getBaseAppPath() + '/user/active-event';
}

export function updateJourneyInterval() {
	return getBaseAppPath() + '/user/journey-interval';
}

export function pushNewFavouriteEvent() {
	return getBaseAppPath() + '/user/new-favourite';
}

export function removeFromMyFavourites() {
	return getBaseAppPath() + '/user/remove-favourite';
}

// EVENTS
export function getEvents(skip=0, limit=50, totalCount=null) {
	return getBaseAppPath() + `/events?skip=${skip}&limit=${limit}&totalCount=${totalCount}`;
}

export function getFreeEvents() {
	return getBaseAppPath() + '/free-events';
}
