import BaseService from './BaseService';
import * as api from '../api';

export default class EventsService {
	constructor() {
		this.baseService = new BaseService();
	}

	getEvents() {
		let url = api.getEvents();

		return fetch(url, this.baseService.GetInit('GET'))
			.then(response => {
				if(response.status >= 400) {
					throw new Error('Bad response from server');
				} else {
					return response.json();
				}
			});
	}
}
