import React, { Component } from 'react';
import moment from 'moment';
import { connect } from 'react-redux';
import {
	View,
	Text,
	StyleSheet,
	Platform,
	TouchableOpacity,
	Modal,
	ScrollView
} from 'react-native';

import {
	Icon
} from 'react-native-elements';

import Button from './Button';
import { setActiveEvent } from '../../actions/events';

class ActiveEvent extends Component {
	constructor(props) {
		super(props);

		this.state = {
			modalVisible: false
		};

		this.previousEvent = this.previousEvent.bind(this);
		this.nextEvent = this.nextEvent.bind(this);
		this.openModal = this.openModal.bind(this);
		this.closeModal = this.closeModal.bind(this);
	}

	openModal() {
		this.setState(() => ({modalVisible: true}));
	}

	closeModal() {
		this.setState(() => ({modalVisible: false}));
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
							<TouchableOpacity onPress={this.openModal}>
								<Text style={styles.Description} ellipsizeMode="tail" numberOfLines={4}>{activeEvent.Description}</Text>
							</TouchableOpacity>
						</View>
						:
						<Text style={styles.NoActiveEvent}>No active event</Text>
				}

				<Modal animationType={'fade'} transparent={true} visible={this.state.modalVisible}>
					<View style={styles.ModalContainer}>
						<View style={styles.ModalInnerContainer}>
							<ScrollView>
								<Text style={[styles.Description, {fontSize: 14}]}>{activeEvent && activeEvent.Description}</Text>
							</ScrollView>

							<Button text="CLOSE" onPress={this.closeModal} />
						</View>
					</View>
				</Modal>

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
	},
	NoActiveEvent: {
		color: '#FFF'
	},
	ModalContainer: {
		flex: 1,
		justifyContent: 'center',
		padding: 20,
		backgroundColor: 'rgba(0, 0, 0, .5)'
	},
	ModalInnerContainer: {
		alignItems: 'center',
		//backgroundColor: '#FFF',
		backgroundColor: 'rgb(139, 154, 97)',
		padding: 20,
		overflow: 'scroll'
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
