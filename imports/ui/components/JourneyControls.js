import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
	View,
	StyleSheet,
	TouchableOpacity,
	ProgressViewIOS,
	Platform
} from 'react-native';

import {
	Icon
} from 'react-native-elements';

import {
	adjustCurrentControl
} from '../../actions/controls';

class JourneyControls extends Component {
	constructor(props) {
		super(props);

		this.onControlPress = this.onControlPress.bind(this);
	}

	onControlPress(control) {
		const {
			adjustCurrentControl,
			currentControl
		} = this.props;

		if(adjustCurrentControl && control && currentControl !== control) {
			adjustCurrentControl(control);
		}
	}

	render() {
		const {
			timePassed,
			currentControl
		} = this.props;

		return (
			<View style={{flexDirection: 'column', flex: 1}}>
				{
					Platform.OS === 'ios' ?
						<ProgressViewIOS progress={timePassed/10000} progressTintColor={'#C9E779'} trackTintColor={'#FFF'} style={styles.ProgressView} />
						: null
				}

				<View style={styles.ControlsContainer}>
					<View style={[styles.ActionWrapper, {borderLeftWidth: 0}]}>
						<TouchableOpacity onPress={() => this.onControlPress('play')}>
							<Icon name={'play'} type="font-awesome" color={currentControl === 'PLAY' ? '#C9E779' : '#8B9A61'} size={24} />
						</TouchableOpacity>
					</View>

					<View style={styles.ActionWrapper}>
						<TouchableOpacity onPress={() => this.onControlPress('pause')}>
							<Icon name={'pause'} type="font-awesome" color={currentControl === 'PAUSE' ? '#C9E779' : '#8B9A61'} size={24} />
						</TouchableOpacity>
					</View>

					<View style={styles.ActionWrapper}>
						<TouchableOpacity onPress={() => this.onControlPress('stop')}>
							<Icon name={'stop'} type="font-awesome" color={currentControl === 'STOP' ? '#C9E779' : '#8B9A61'} size={24} />
						</TouchableOpacity>
					</View>

					<View style={styles.ActionWrapper}>
						<TouchableOpacity onPress={() => console.log('onPress timer')}>
							<Icon name={'ios-timer'} type="ionicon" color={'#FFF'} size={24} />
						</TouchableOpacity>
					</View>
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
	},
	ProgressView: {
		height: 5,
		padding: 0
	}
});

function mapStateToProps(state) {
	return {
		currentControl: state.controls.current,
		timePassed: state.controls.timePassed
	};
}

function mapDispatchToProps(dispatch) {
	return {
		adjustCurrentControl: (control) => dispatch(adjustCurrentControl(control))
	};
}

export default connect(mapStateToProps, mapDispatchToProps)(JourneyControls);
