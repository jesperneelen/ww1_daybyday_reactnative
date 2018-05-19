import React, { Component } from 'react';
import moment from 'moment';
import {
	Text,
	StyleSheet,
	TouchableOpacity,
	View
} from 'react-native';

import ActionButton from 'react-native-action-button';
import Icon from 'react-native-vector-icons/Ionicons';

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
			actions,
			onTagPress,
			actionsType
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
											<TagItem key={idx} id={tag._id} IsCity={tag.IsCity} DisplayName={tag.DisplayName}
															 backgroundColor="rgba(139, 154, 97, .8)" onPress={onTagPress} />
										);
									})
								: null
						}
					</View>
					{
						actionsType === 'button' && actions && actions.length > 0 && Array.isArray(actions) ?
							<ActionButton spacing={2} offsetY={15} offsetX={5} activeOpacity={.6} outRangeScale={1} size={35}
														buttonColor={'#839A42'} position={'right'} verticalOrientation={'down'} degrees={180}
														renderIcon={() => (<Icon name="md-more" style={[styles.actionButtonIcon, {fontSize: 24}]} />)}>
								{
									actions.map((action, idx) => {
										return (
											<ActionButton.Item key={idx} buttonColor={action.backgroundColor} size={28} spaceBetween={10}
																				 onPress={() => action.onPress()} title={action.text}
																				 textStyle={{color: '#FFFFFF', fontWeight: '600', backgroundColor: '#BEDA73'}}
																				 textContainerStyle={{backgroundColor: '#BEDA73', borderColor: '#BEDA73'}}>
												<Icon name={action.iconName} style={styles.actionButtonIcon} />
											</ActionButton.Item>
										);
									})
								}
							</ActionButton>
							: (
								!actionsType && actions && actions.length > 0 && Array.isArray(actions) ?
									<ActionBar actions={actions} />
									: null
							)
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
		paddingVertical: 15,
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
	},
	actionButtonIcon: {
		fontSize: 14,
		color: 'white'
	}
});
