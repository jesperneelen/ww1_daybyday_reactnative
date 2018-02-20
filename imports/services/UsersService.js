import BaseService from './BaseService';
import * as api from '../api';

function InternalException(message) {
	this.message = message;
	this.name = 'InternalException';
}

function LoginException(message) {
	this.message = message;
	this.name = 'LoginException';
}

export default class UsersService {
	constructor() {
		this.baseService = new BaseService();
	}

	login(username, password) {
		let url = api.loginUser();

		return fetch(url, this.baseService.Add({username, password}))
			.then(async response => {
				if(response.status >= 500) {
					throw new InternalException('Bad response from server');
				} else if(response.status >= 400) {
					let json = await response.json();
					throw new LoginException(json.message);
				} else {
					return response.json();
				}
			});
	}

	loginFb(userId) {
		let url = api.loginFbUser(userId);

		return fetch(url, this.baseService.GetInit('GET'))
			.then(response => {
				if(response.status >= 400) {
					throw new Error('Bad response from server');
				} else {
					return response.json();
				}
			});
	}

	getUser() {
		let url = api.getUser();

		return fetch(url, this.baseService.GetInit('GET'))
			.then(response => {
				if(response.status >= 400) {
					throw new Error('Bad response from server');
				} else {
					return response.json();
				}
			});
	}

	logout() {
		let url = api.logoutUser();

		return fetch(url, this.baseService.GetInit('GET'))
			.then(response => {
				return response.json();
			});
	}

	register(newUser) {
		let url = api.register();

		return fetch(url, this.baseService.Add(newUser))
			.then(response => {
				if(response.status >= 500) {
					throw new Error('Bad response from server');
				} else {
					return response.json();
				}
			});
	}
}
