import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
	View,
	Text,
	StyleSheet,
	Platform,
	TouchableOpacity
} from 'react-native';
import {
	Icon
} from 'react-native-elements';

import { setActiveEvent } from '../../actions/events';

class ActiveEvent extends Component {
	constructor(props) {
		super(props);

		this.previousEvent = this.previousEvent.bind(this);
		this.nextEvent = this.nextEvent.bind(this);
	}

	previousEvent() {
		let {
			setActiveEvent,
			activeEventIndex
		} = this.props;

		if(setActiveEvent) {
			setActiveEvent(activeEventIndex - 1);
		}
	}

	nextEvent() {
		let {
			setActiveEvent,
			activeEventIndex
		} = this.props;

		if(setActiveEvent) {
			setActiveEvent(activeEventIndex + 1);
		}
	}

	render() {
		const {
			activeEvent,
			previousEvent,
			nextEvent
		} = this.props;

		return (
			<View style={styles.ActiveEventContainer}>
				<TouchableOpacity onPress={this.previousEvent} disabled={!previousEvent}>
					<Icon type="font-awesome" name={'chevron-left'} color={'#FFF'} size={40} />
				</TouchableOpacity>

				<Text style={{color: 'white'}}>{activeEvent ? activeEvent.Front + '/' + activeEvent.Nation : 'No active event.'}</Text>

				<TouchableOpacity onPress={this.nextEvent} disabled={!nextEvent}>
					<Icon type="font-awesome" name={'chevron-right'} color={'#FFF'} size={40} />
				</TouchableOpacity>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	ActiveEventContainer: {
		backgroundColor: 'rgb(68, 78, 41)',
		flex: 2,
		alignItems: 'center',
		justifyContent: 'space-between',
		flexDirection: 'row',
		paddingTop: Platform.OS === 'ios' ? 20 : 0,
		padding: 5
	},
	chevron: {
		width: 30,
		height: 50
	}
});

function mapStateToProps(state) {
	return {
		activeEvent: state.events.activeEvent,
		activeEventIndex: state.events.activeEventIndex,
		previousEvent: state.events.previousEvent,
		nextEvent: state.events.nextEvent
	};
}

function mapDispatchToProps(dispatch) {
	return {
		setActiveEvent: (idx) => dispatch(setActiveEvent(idx))
	};
}

export default connect(mapStateToProps, mapDispatchToProps)(ActiveEvent);
