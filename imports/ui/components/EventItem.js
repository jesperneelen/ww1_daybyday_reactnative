import React, { Component } from 'react';
import {
	Text,
	StyleSheet,
	TouchableOpacity
} from 'react-native';
import moment from 'moment';

export default class EventItem extends React.Component {
	constructor(props) {
		super(props);
	}

	shouldComponentUpdate(nextProps) {
		return nextProps.selected !== this.props.selected;
	}

	render() {
		const {
			DateOfEvent,
			Front,
			Nation,
			onPress,
			selected
		} = this.props;

		return (
			<TouchableOpacity onPress={onPress} style={[styles.EventItemContainer, selected ? styles.Selected : null]}>
				<Text style={styles.DateOfEvent}>{moment(DateOfEvent, 'DD/MM/YYYY').format('MMMM Do, YYYY')}</Text>
				<Text style={styles.FrontNation}>{`${Front} / ${Nation}`}</Text>
			</TouchableOpacity>
		);
	}
}

const styles = StyleSheet.create({
	EventItemContainer: {
		paddingVertical: 10,
		paddingHorizontal: 5,
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
	FrontNation: {
		color: '#53565A',
		fontSize: 15,
		fontWeight: 'bold'
	},
	Selected: {
		backgroundColor: 'rgba(139, 154, 97, .3)'
	}
});
