import React, { Component } from 'react';
import moment from 'moment';
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
			activeEventIndex,
			previousEvent
		} = this.props;

		if(setActiveEvent) {
			setActiveEvent(activeEventIndex - 1, previousEvent._id);
		}
	}

	nextEvent() {
		let {
			setActiveEvent,
			activeEventIndex,
			nextEvent
		} = this.props;

		if(setActiveEvent) {
			setActiveEvent(activeEventIndex + 1, nextEvent._id);
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

				{
					activeEvent ?
						<View style={styles.ActiveEvent}>
							<Text style={styles.DateOfEvent}>{moment(activeEvent.DateOfEvent, 'DD/MM/YYYY').format('MMMM Do, YYYY')}</Text>
							<Text style={styles.NationFront}>{`${activeEvent.Front}/${activeEvent.Nation}`}</Text>
							<Text style={styles.Description} ellipsizeMode="tail" numberOfLines={4}>{activeEvent.Description}</Text>
						</View>
						:
						<Text>No active event</Text>
				}

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
		flex: 3,
		alignItems: 'center',
		justifyContent: 'space-between',
		flexDirection: 'row',
		paddingTop: Platform.OS === 'ios' ? 20 : 0,
		padding: 5
	},
	ActiveEvent: {
		flexDirection: 'column',
		alignItems: 'center',
		flex: 1,
		padding: 4
	},
	DateOfEvent: {
		color: '#C9E779',
		fontWeight: 'bold',
		fontSize: 23
	},
	NationFront: {
		color: '#BEDA73',
		fontWeight: '500',
		fontSize: 17
	},
	Description: {
		color: '#FFF',
		justifyContent: 'center',
		fontSize: 12,
		textAlign: 'center'
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
		setActiveEvent: (idx, eventId) => dispatch(setActiveEvent(idx, eventId))
	};
}

export default connect(mapStateToProps, mapDispatchToProps)(ActiveEvent);
