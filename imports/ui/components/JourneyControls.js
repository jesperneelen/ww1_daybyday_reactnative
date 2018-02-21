import React, { Component } from 'react';
import {
	View,
	StyleSheet,
	TouchableOpacity
} from 'react-native';

import {
	Icon
} from 'react-native-elements';

export default class JourneyControls extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<View style={styles.ControlsContainer}>
				<View style={[styles.ActionWrapper, {borderLeftWidth: 0}]}>
					<TouchableOpacity onPress={() => console.log('onPress play')}>
						<Icon name={'play'} type="font-awesome" color={'#FFF'} size={25} />
					</TouchableOpacity>
				</View>

				<View style={styles.ActionWrapper}>
					<TouchableOpacity onPress={() => console.log('onPress pause')}>
						<Icon name={'pause'} type="font-awesome" color={'#FFF'} size={25} />
					</TouchableOpacity>
				</View>

				<View style={styles.ActionWrapper}>
					<TouchableOpacity onPress={() => console.log('onPress stop')}>
						<Icon name={'stop'} type="font-awesome" color={'#FFF'} size={25} />
					</TouchableOpacity>
				</View>

				<View style={styles.ActionWrapper}>
					<TouchableOpacity onPress={() => console.log('onPress timer')}>
						<Icon name={'ios-timer'} type="ionicon" color={'#FFF'} size={25} />
					</TouchableOpacity>
				</View>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	ControlsContainer: {
		backgroundColor: 'rgb(68, 78, 41)',
		flex: 1,
		flexDirection: 'row'
	},
	ActionWrapper: {
		flex: 1,
		alignSelf: 'center',
		borderLeftWidth: 1,
		borderLeftColor: '#FFF'
	}
});
