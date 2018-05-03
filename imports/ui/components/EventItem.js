import React, { Component } from 'react';
import moment from 'moment';
import {
	Text,
	StyleSheet,
	TouchableOpacity,
	View
} from 'react-native';

import TagItem from './TagItem';
import ActionBar from './ActionBar';

export default class EventItem extends Component {
	constructor(props) {
		super(props);
	}

	shouldComponentUpdate(nextProps) {
		return nextProps.selected !== this.props.selected
			|| (nextProps.available && !this.props.available)
			|| this.props.isFavouriteEvent !== nextProps.isFavouriteEvent;
	}

	render() {
		const {
			DateOfEvent,
			EndOfEvent,
			Front,
			Nation,
			onPress,
			selected,
			available,
			isFavouriteEvent,
			Description,
			Tags,
			actions
		} = this.props;

		const children = [
			EndOfEvent && EndOfEvent !== null ?
			<Text style={styles.DateOfEvent} key="dateOfEvent-endOfEvent">{moment(DateOfEvent, 'DD/MM/YYYY').format('MMM Do, YYYY')} - {moment(EndOfEvent, 'DD/MM/YYYY').format('MMM Do, YYYY')}</Text>
			: <Text style={styles.DateOfEvent} key="dateOfEvent">{moment(DateOfEvent, 'DD/MM/YYYY').format('MMMM Do, YYYY')}</Text>,
			<Text style={styles.FrontNation} key="frontNation">{`${Front} / ${Nation}`}</Text>
		];

		if(isFavouriteEvent) {
			return (
				<View style={styles.EventItemContainer}>
					{children}

					<Text style={styles.Description}>{Description}</Text>,

					<View style={styles.TagContainer}>
						{
							Tags && Tags.length > 0 && Array.isArray(Tags) ?
								Tags
									.sort((a, b) => a.DisplayName > b.DisplayName ? 1 : -1)
									.map((tag, idx) => {
										return (
											<TagItem key={idx} IsCity={tag.IsCity} DisplayName={tag.DisplayName} backgroundColor="rgba(139, 154, 97, .8)" />
										)
									})
								: null
						}
					</View>

					{
						actions && actions.length > 0 && Array.isArray(actions) ?
							<ActionBar actions={actions} />
							: null
					}
				</View>
			);
		}

		return (
			<TouchableOpacity activeOpacity={available ? .2 : 1} onPress={available ? onPress : null}
												style={[
													styles.EventItemContainer,
													selected ? styles.Selected : null,
													available ? null : styles.Unavailable,
													{height: 70}
												]}>
				{children}
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
		fontSize: 16,
		fontWeight: 'bold'
	},
	Selected: {
		backgroundColor: 'rgba(139, 154, 97, .3)'
	},
	Unavailable: {
		backgroundColor: 'rgba(0, 0, 0, .1)'
	},
	Description: {
		marginTop: 12,
		opacity: 0.9,
		justifyContent: 'center',
		fontSize: 14,
		textAlign: 'center'
	},
	TagContainer: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		justifyContent: 'center',
		marginVertical: 12
	}
});
