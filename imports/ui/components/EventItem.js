import React, { Component } from 'react';
import {
	View,
	Text,
	StyleSheet,
	TouchableOpacity
} from 'react-native';
import moment from 'moment';

export default class EventItem extends React.Component {
	constructor(props) {
		super(props);
	}

	shouldComponentUpdate(nextProps, nextState) {
		return false;
	}

	render() {
		const {
			DateOfEvent,
			Front,
			Nation,
			onPress
		} = this.props;

		return (
			<TouchableOpacity onPress={onPress} style={styles.EventItemContainer}>
				<Text style={styles.DateOfEvent}>{moment(DateOfEvent, 'DD/MM/YYYY').format('MMMM Do, YYYY')}</Text>
				<Text style={styles.Test}>{Front} / {Nation}</Text>
			</TouchableOpacity>
		);
	}
}

const styles = StyleSheet.create({
	EventItemContainer: {
		marginTop: 10,
		marginBottom: 10,
		marginLeft: 5,
		marginRight: 5,
		flexDirection: 'column',
		alignItems: 'center'
	},
	EventItemDetails: {
		justifyContent: 'space-around'
	},
	DateOfEvent: {
		color: 'rgb(119, 121, 61)',
		fontWeight: 'bold',
		fontSize: 20
	},
	Test: {
		color: '#53565A',
		fontSize: 15,
		fontWeight: 'bold'
	}
});
