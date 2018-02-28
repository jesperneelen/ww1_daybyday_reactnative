import React, { Component } from 'react';
import moment from 'moment';
import {
	Text,
	StyleSheet,
	TouchableOpacity
} from 'react-native';

export default class EventItem extends Component {
	constructor(props) {
		super(props);
	}

	shouldComponentUpdate(nextProps) {
		return nextProps.selected !== this.props.selected
			|| (nextProps.available && !this.props.available);
	}

	render() {
		const {
			DateOfEvent,
			Front,
			Nation,
			onPress,
			selected,
			available
		} = this.props;

		return (
			<TouchableOpacity activeOpacity={available ? .2 : 1} onPress={available ? onPress : null}
												style={[styles.EventItemContainer, selected ? styles.Selected : null, available ? null : styles.Unavailable]}>
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
		alignItems: 'center',
		height: 70
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
	},
	Unavailable: {
		backgroundColor: 'rgba(0, 0, 0, .1)'
	}
});
