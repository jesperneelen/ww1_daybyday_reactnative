import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';

import ActiveEvent from '../components/ActiveEvent';
import JourneyControls from '../components/JourneyControls';
import Map from '../components/Map';

export default class Home extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		const {
			navigation
		} = this.props;

		return (
			<View style={styles.container}>
				<ActiveEvent navigation={navigation} />

				<Map navigation={navigation} />

				<JourneyControls />
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center'
	}
});