import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
	View,
	StyleSheet,
	TouchableOpacity,
	ProgressViewIOS,
	Platform,
	Modal,
	Picker
} from 'react-native';

import {
	Icon
} from 'react-native-elements';

import {
	adjustCurrentControl,
	adjustJourneyInterval
} from '../../actions/controls';

import {
	setActiveEvent
} from '../../actions/events';

import ActionBar from '../components/ActionBar';

class JourneyControls extends Component {
	constructor(props) {
		super(props);

		this.state = {
			intervalModalVisible: false,
			interval: props.interval && props.interval.toString()
		};

		this.onControlPress = this.onControlPress.bind(this);
		this.previousEvent = this.previousEvent.bind(this);
		this.nextEvent = this.nextEvent.bind(this);
		this.onOpenIntervalModal = this.onOpenIntervalModal.bind(this);
		this.onCloseIntervalModal = this.onCloseIntervalModal.bind(this);
		this.saveInterval = this.saveInterval.bind(this);
	}

	shouldComponentUpdate(nextProps, nextState) {
		return nextState.intervalModalVisible !== this.state.intervalModalVisible
				|| nextState.interval !== this.state.interval
				|| nextProps.currentControl !== this.props.currentControl
				|| nextProps.timePassed !== this.props.timePassed
				|| nextProps.interval !== this.props.interval
				|| nextProps.activeEventIndex !== this.props.activeEventIndex;
	}

	onControlPress(control) {
		const {
			adjustCurrentControl,
			currentControl
		} = this.props;

		if(adjustCurrentControl && control && currentControl !== control.toUpperCase()) {
			adjustCurrentControl(control);
		}
	}

	previousEvent() {
		let {
			setActiveEvent,
			activeEventIndex,
			previousEvent,
			adjustCurrentControl
		} = this.props;

		if(setActiveEvent && adjustCurrentControl) {
			setActiveEvent(activeEventIndex - 1, previousEvent._id);
			adjustCurrentControl('next/previous');
		}
	}

	nextEvent() {
		let {
			setActiveEvent,
			activeEventIndex,
			nextEvent,
			adjustCurrentControl
		} = this.props;

		if(setActiveEvent && adjustCurrentControl) {
			setActiveEvent(activeEventIndex + 1, nextEvent._id);
			adjustCurrentControl('next/previous');
		}
	}

	onOpenIntervalModal() {
		this.setState(() => ({
			intervalModalVisible: true
		}));
	}

	onCloseIntervalModal() {
		this.setState(() => ({
			intervalModalVisible: false
		}));
	}

	saveInterval() {
		const {
			adjustJourneyInterval,
			adjustCurrentControl
		} = this.props;

		const {
			interval
		} = this.state;

		if(adjustJourneyInterval && interval) {
			adjustJourneyInterval(parseInt(interval));
			adjustCurrentControl('interval');

			this.setState(() => ({
				intervalModalVisible: false
			}));
		}
	}

	render() {
		const {
			timePassed,
			currentControl,
			maxEventIndex,
			activeEventIndex,
			previousEvent,
			nextEvent,
			interval
		} = this.props;

		const {
			intervalModalVisible
		} = this.state;

		let enablePrevious = !!previousEvent;
		let enableNext = nextEvent && activeEventIndex < maxEventIndex;

		const actions = [
			{text: 'Save', iconType: 'ionicon', iconName: 'md-checkmark-circle', iconSize: 25, iconColor: '#FFFFFF', onPress: this.saveInterval},
			{text: 'Close', iconType: 'ionicon', iconName: 'ios-close-circle', iconSize: 25, iconColor: '#FFFFFF', onPress: this.onCloseIntervalModal}
		];

		return (
			<View style={{flexDirection: 'column', flex: 1}}>
				{
					Platform.OS === 'ios' ?
						<ProgressViewIOS progress={timePassed/parseInt(interval)} progressTintColor={'#C9E779'} trackTintColor={'#FFF'} style={styles.ProgressView} />
						: null
				}

				<View style={styles.ControlsContainer}>
					<View style={[styles.ActionWrapper, {borderLeftWidth: 0}]}>
						<TouchableOpacity onPress={enablePrevious ? this.previousEvent : null} activeOpacity={enablePrevious ? .2 : 1}>
							<Icon name={'fast-backward'} type="font-awesome" color={enablePrevious ? '#C9E779' : '#8B9A61'} size={24} />
						</TouchableOpacity>
					</View>

					{
						currentControl === 'PLAY' ?
							<View style={styles.ActionWrapper}>
								<TouchableOpacity onPress={() => this.onControlPress('pause')}>
									<Icon name={'pause'} type="font-awesome" color={'#C9E779'} size={24} />
								</TouchableOpacity>
							</View>
							:
							<View style={styles.ActionWrapper}>
								<TouchableOpacity onPress={() => this.onControlPress('play')}>
									<Icon name={'play'} type="font-awesome" color={'#C9E779'} size={24} />
								</TouchableOpacity>
							</View>
					}

					<View style={styles.ActionWrapper}>
						<TouchableOpacity onPress={() => this.onControlPress('stop')}>
							<Icon name={'stop'} type="font-awesome" color={'#C9E779'} size={24} />
						</TouchableOpacity>
					</View>

					<View style={styles.ActionWrapper}>
						<TouchableOpacity onPress={enableNext ? this.nextEvent : null} activeOpacity={enableNext ? .2 : 1}>
							<Icon name={'fast-forward'} type="font-awesome" color={enableNext ? '#C9E779' : '#8B9A61'} size={24} />
						</TouchableOpacity>
					</View>

					<View style={[styles.ActionWrapper, {borderLeftWidth: 2, borderLeftColor: '#FFF'}]}>
						<TouchableOpacity onPress={this.onOpenIntervalModal}>
							<Icon name={'ios-timer'} type="ionicon" color={'#FFF'} size={24} />
						</TouchableOpacity>
					</View>

					<Modal animationType={'fade'} transparent={true} visible={intervalModalVisible}>
						<View style={styles.ModalContainer}>
							<View style={styles.ModalInnerContainer}>
								<Picker itemStyle={{color: '#FFF'}} selectedValue={this.state.interval}
												onValueChange={(itemValue, itemIndex) => this.setState(() => ({interval: itemValue}))}>
									<Picker.Item label="10 seconds" value="10000" />
									<Picker.Item label="30 seconds" value="30000" />
									<Picker.Item label="60 seconds" value="60000" />
								</Picker>

								{/*<Button text="SAVE" onPress={this.saveInterval} />
								<Button text="CLOSE" onPress={this.onCloseIntervalModal} />*/}

								<ActionBar actions={actions} />
							</View>
						</View>
					</Modal>
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
		alignSelf: 'center'
	},
	ProgressView: {
		height: 5,
		padding: 0
	},
	ModalContainer: {
		flex: 1,
		justifyContent: 'center',
		padding: 20,
		backgroundColor: 'rgba(0, 0, 0, .5)'
	},
	ModalInnerContainer: {
		backgroundColor: 'rgb(139, 154, 97)',
		padding: 20
	}
});

function mapStateToProps(state) {
	return {
		currentControl: state.controls.current,
		timePassed: state.controls.timePassed,
		interval: state.controls.interval,
		activeEventIndex: state.events.activeEventIndex,
		maxEventIndex: state.events.maxEventIndex,
		previousEvent: state.events.previousEvent,
		nextEvent: state.events.nextEvent
	};
}

function mapDispatchToProps(dispatch) {
	return {
		adjustCurrentControl: (control) => dispatch(adjustCurrentControl(control)),
		setActiveEvent: (idx, eventId) => dispatch(setActiveEvent(idx, eventId)),
		adjustJourneyInterval: (interval) => dispatch(adjustJourneyInterval(interval))
	};
}

export default connect(mapStateToProps, mapDispatchToProps)(JourneyControls);
