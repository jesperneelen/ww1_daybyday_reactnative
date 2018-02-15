export default class BaseService {
	GetInit(method) {
		let headers = new Headers();
		headers.append('Accept', 'application/json');
		headers.append('Content-Type', 'application/json');

		return {
			headers: headers,
			method: method,
			cache: 'default',
			credentials: 'include'
		};
	}

	Update(updateObject) {
		let requestInit = this.GetInit('PUT');
		requestInit.body = JSON.stringify(updateObject);
		return requestInit;
	}

	Add(addObject) {
		let requestInit = this.GetInit('POST');
		requestInit.body = JSON.stringify(addObject);
		return requestInit;
	}
}
