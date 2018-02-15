import { AppRegistry } from 'react-native';
import React, { Component } from 'react';
import { Provider } from 'react-redux';

import { store } from './imports/store/configureStore';
import App from './imports/ui';

class WW1DayByDay extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<Provider store={store}>
				<App />
			</Provider>
		)
	}
}

AppRegistry.registerComponent('WO1_daybyday', () => WW1DayByDay);
