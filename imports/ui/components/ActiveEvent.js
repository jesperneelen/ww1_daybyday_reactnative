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
	ScrollView,
	ActivityIndicator
} from 'react-native';

import TagItem from '../components/TagItem';
import ActionBar from '../components/ActionBar';

import { pushNewFavouriteEvent, removeFromMyFavourites } from '../../actions/events';

class ActiveEvent extends Component {
	constructor(props) {
		super(props);

		this.state = {
			modalVisible: false
		};

		this.openModal = this.openModal.bind(this);
		this.closeModal = this.closeModal.bind(this);
		this.addToFavourites = this.addToFavourites.bind(this);
		this.removeFromFavourites = this.removeFromFavourites.bind(this);
	}

	openModal() {
		this.setState(() => ({modalVisible: true}));
	}

	closeModal() {
		this.setState(() => ({modalVisible: false}));
	}

	addToFavourites() {
		const {
			pushNewFavouriteEvent,
			activeEvent
		} = this.props;

		if(pushNewFavouriteEvent && activeEvent && activeEvent._id) {
			pushNewFavouriteEvent(activeEvent._id);
		}
	}

	removeFromFavourites() {
		const {
			removeFromMyFavourites,
			activeEvent
		} = this.props;

		if(removeFromMyFavourites && activeEvent && activeEvent._id) {
			removeFromMyFavourites(activeEvent._id);
		}
	}

	render() {
		const {
			activeEvent,
			isFetchingEvents,
			pushingOrRemovingFavourite,
			activeEventIsInFavourite
		} = this.props;

		let dbDateFormat = 'DD/MM/YYYY';

		const actions = [
			{
				text: activeEventIsInFavourite ? 'Remove from my favourites' : 'Add to my favourites',
				loading: pushingOrRemovingFavourite,
				iconName: activeEventIsInFavourite ? 'ios-star' : 'ios-star-outline',
				iconColor: '#FFFFFF', iconSize: 27, iconType: 'ionicon',
				onPress: activeEventIsInFavourite ? this.removeFromFavourites : this.addToFavourites
			},
			{text: 'Close', iconType: 'ionicon', iconName: 'ios-close-circle', iconColor: '#FFFFFF', iconSize: 27, onPress: this.closeModal}
		];

		return (
			<View style={styles.ActiveEventContainer}>
				{
					isFetchingEvents ?
						<View style={styles.ActiveEvent}>
							<ActivityIndicator size="large" animating={true} />
						</View>
						:
						(
							activeEvent ?
								<View style={styles.ActiveEvent}>
									{
										activeEvent.EndOfEvent && activeEvent.EndOfEvent !== null ?
											<Text style={styles.DateOfEvent}>
												{moment(activeEvent.DateOfEvent, dbDateFormat).format('MMM Do, YYYY')} - {moment(activeEvent.EndOfEvent, dbDateFormat).format('MMM Do, YYYY')}
											</Text>
											:
											<Text style={styles.DateOfEvent}>
												{moment(activeEvent.DateOfEvent, dbDateFormat).format('MMMM Do, YYYY')}
											</Text>
									}

									<Text style={styles.NationFront}>{`${activeEvent.Front} - ${activeEvent.Nation}`}</Text>

									<TouchableOpacity onPress={this.openModal}>
										<Text style={styles.Description} ellipsizeMode="tail" numberOfLines={4}>{activeEvent.Description}</Text>
									</TouchableOpacity>
								</View>
								:
								<View style={styles.ActiveEvent}>
									<Text style={styles.NoActiveEvent}>Looks like you haven't picked an active event until now :(</Text>
									<Text style={styles.NoActiveEvent}>Select one in the event overview!</Text>
								</View>
						)
				}

				{
					activeEvent ?
						<Modal animationType={'fade'} transparent={true} visible={this.state.modalVisible}>
							<View style={styles.ModalContainer}>
								<View style={styles.ModalInnerContainer}>
									<ScrollView>
										<Text style={[styles.Description, {fontSize: 14}]}>{activeEvent && activeEvent.Description}</Text>
									</ScrollView>

									<View style={styles.ModalTagsContainer}>
										{
											activeEvent.Tags && activeEvent.Tags.length > 0 && Array.isArray(activeEvent.Tags) ?
												activeEvent.Tags
													.sort((a, b) => a.DisplayName > b.DisplayName ? 1 : -1)
													.map((tag, idx) => {
														return (
															<TagItem key={idx} IsCity={tag.IsCity} DisplayName={tag.DisplayName} backgroundColor="#BEDA73" />
														)
													})
												: null
										}
									</View>

									<ActionBar actions={actions} />
								</View>
							</View>
						</Modal> : null
				}
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
		textAlign: 'center',
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
		color: '#BEDA73',
		fontSize: 17,
		textAlign: 'center'
	},
	ModalContainer: {
		flex: 1,
		justifyContent: 'center',
		padding: 20,
		backgroundColor: 'rgba(0, 0, 0, .5)'
	},
	ModalInnerContainer: {
		alignItems: 'center',
		backgroundColor: 'rgb(139, 154, 97)',
		padding: 20,
		overflow: 'scroll'
	},
	ModalTagsContainer: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		justifyContent: 'center',
		marginVertical: 10
	}
});

function mapStateToProps(state) {
	return {
		activeEvent: state.events.activeEvent,
		activeEventIndex: state.events.activeEventIndex,
		activeEventIsInFavourite: state.events.activeEventIsInFavourite,
		isFetchingEvents: state.events.isFetching,
		pushingOrRemovingFavourite: state.events.pushingOrRemovingFavourite
	};
}

function mapDispatchToProps(dispatch) {
	return {
		pushNewFavouriteEvent: (eventId) => dispatch(pushNewFavouriteEvent(eventId)),
		removeFromMyFavourites: (eventId) => dispatch(removeFromMyFavourites(eventId))
	};
}

export default connect(mapStateToProps, mapDispatchToProps)(ActiveEvent);
