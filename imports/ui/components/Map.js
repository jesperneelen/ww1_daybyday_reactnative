import React, { Component } from 'react';
import {
	View,
	StyleSheet,
	Image
} from 'react-native';

import OverviewEvents from './OverviewEvents';

export default class Map extends Component {
	constructor(props) {
		super(props);

		this.state = {
			height: null
		};

		this.onLayout = this.onLayout.bind(this);
	}

	onLayout(event) {
		let {
			height
		} = event.nativeEvent.layout;

		this.setState(() => ({
			height
		}));
	}

	render() {
		return (
			<View style={styles.mapContainer} onLayout={this.onLayout}>
				<Image source={require('../../../assets/gmap-example.jpg')} style={styles.mapImage} />

				<OverviewEvents componentHeight={this.state.height} />
			</View>
		);
	}
}

const styles = StyleSheet.create({
	mapContainer: {
		backgroundColor: 'red',
		flex: 9,
		alignItems: 'stretch',
	},
	mapImage: {
		flex: 1,
		alignSelf: 'stretch',
		height: undefined,
		width: undefined
	}
});
