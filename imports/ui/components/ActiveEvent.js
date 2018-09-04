import React, { Component } from 'react';
import moment from 'moment';
import { connect } from 'react-redux';
import { NavigationActions } from 'react-navigation';
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
import { adjustCurrentControl } from '../../actions/controls';
import { clearSessionNoAccount } from '../../actions/session';
import { normalize } from '../utils/responsive-ui';

class ActiveEvent extends Component {
	constructor(props) {
		super(props);

		this.state = {
			modalVisible: false,
			showYearChange: false,
			showSignInModal: false
		};

		this.openModal = this.openModal.bind(this);
		this.closeModal = this.closeModal.bind(this);
		this.addToFavourites = this.addToFavourites.bind(this);
		this.removeFromFavourites = this.removeFromFavourites.bind(this);
		this.onTagPress = this.onTagPress.bind(this);
		this.onMoreInfoPress = this.onMoreInfoPress.bind(this);
		this.closeYearModal = this.closeYearModal.bind(this);
		this.closeSignInModal = this.closeSignInModal.bind(this);
		this.onLoginPressed = this.onLoginPressed.bind(this);
	}

	static getDerivedStateFromProps(nextProps, prevState) {
		if(nextProps && nextProps.hasSideEvent && nextProps.sideEvent && nextProps.sideEvent.Type === 'Year Change') {
			if(nextProps.adjustCurrentControl) {
				nextProps.adjustCurrentControl('stop');
			}

			return {
				showYearChange: true
			};
		}

		if(nextProps.activeEventIndex + 1 === nextProps.totalCount && nextProps.totalCount) {
			return {
				showSignInModal: true
			};
		}

		return null;
	}

	openModal() {
		this.setState(() => ({modalVisible: true}));
	}

	closeModal() {
		this.setState(() => ({modalVisible: false}));
	}

	closeYearModal() {
		this.setState(() => ({showYearChange: false}));

		const {
			adjustCurrentControl
		} = this.props;

		if(adjustCurrentControl) {
			adjustCurrentControl('play');
		}
	}

	closeSignInModal() {
		this.setState(() => ({
			showSignInModal: false
		}));
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

	onTagPress(tagId, tagDisplayName) {
		const {
			navigation,
			adjustCurrentControl
		} = this.props;

		if(navigation && navigation.navigate && adjustCurrentControl) {
			this.setState(() => ({
				modalVisible: false
			}));

			adjustCurrentControl('stop');
			navigation.navigate('filteredEvents', {tagId, tagDisplayName})
		}
	}

	onMoreInfoPress() {
		const {
			navigation,
			sideEvent,
			hasSideEvent,
			adjustCurrentControl
		} = this.props;

		if(navigation && navigation.navigate && hasSideEvent && sideEvent && adjustCurrentControl) {
			this.setState(() => ({
				modalVisible: false
			}));

			adjustCurrentControl('stop');
			navigation.navigate('sideEvent', {SideEventTitle: sideEvent.Title});
		}
	}

	onLoginPressed() {
		this.setState(() => ({
			showSignInModal: false
		}));

		const resetAction = NavigationActions.reset({
			index: 0,
			key: null,
			actions: [
				NavigationActions.navigate({ routeName: 'notAuthenticatedStack' })
			]
		});

		this.props.clearSessionNoAccount();
		this.props.dispatchResetAction(resetAction);
	}

	render() {
		const {
			activeEvent,
			isFetchingEvents,
			pushingOrRemovingFavourite,
			activeEventIsInFavourite,
			sideEvent,
			hasSideEvent
		} = this.props;

		let dbDateFormat = 'DD/MM/YYYY';

		let actions = [
			{
				text: activeEventIsInFavourite ? 'Remove from my favourites' : 'Add to my favourites',
				loading: pushingOrRemovingFavourite,
				iconName: activeEventIsInFavourite ? 'ios-star' : 'ios-star-outline',
				iconColor: '#FFFFFF',
				iconSize: normalize(23),
				iconType: 'ionicon',
				//backgroundColor: '#1CB417',
				onPress: activeEventIsInFavourite ? this.removeFromFavourites : this.addToFavourites
			},
			{
				text: 'Close',
				iconType: 'ionicon',
				iconName: 'ios-close-circle',
				iconColor: '#FFFFFF',
				iconSize: normalize(23),
				//backgroundColor: '#DA291C',
				onPress: this.closeModal
			}
		];

		if(hasSideEvent && sideEvent && sideEvent.Type !== 'Year Change') {
			actions.push({
				text: `More info about ${sideEvent.Title}`,
				iconType: 'ionicon',
				iconName: 'ios-information-circle',
				iconColor: '#FFFFFF',
				iconSize: normalize(23),
				backgroundColor: '#433781',
				onPress: this.onMoreInfoPress
			});
		}

		let yearChangeActions = [
			{
				text: 'Close',
				iconType: 'ionicon',
				iconName: 'ios-close-circle',
				iconColor: '#FFFFFF',
				iconSize: normalize(23),
				onPress: this.closeYearModal
			}
		];

		let signInModalActions = [
			{
				text: 'Sign me up!',
				iconType: 'material-community',
				iconName: 'login-variant',
				iconColor: '#FFFFFF',
				backgroundColor: '#1CB417',
				iconSize: normalize(23),
				onPress: this.onLoginPressed
			},
			{
				text: 'Close',
				iconType: 'ionicon',
				iconName: 'ios-close-circle',
				iconColor: '#FFFFFF',
				backgroundColor: '#814137',
				iconSize: normalize(23),
				onPress: this.closeSignInModal
			}
		];

		return (
			<View style={styles.ActiveEventContainer}>
				{
					isFetchingEvents && activeEvent === null ?
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

									<Text style={styles.NationFront}>{`${activeEvent.Front} / ${activeEvent.Nation}`}</Text>

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
						<Modal animationType={'fade'} transparent={true} visible={this.state.modalVisible} onRequestClose={() => {console.log('Modal has been closed.')}}>
							<View style={styles.ModalContainer}>
								<View style={styles.ModalInnerContainer}>
									<ScrollView>
										<Text style={[styles.Description, {fontSize: normalize(12)}]}>{activeEvent && activeEvent.Description}</Text>
									</ScrollView>

									<View style={styles.ModalTagsContainer}>
										{
											activeEvent.Tags && activeEvent.Tags.length > 0 && Array.isArray(activeEvent.Tags) ?
												activeEvent.Tags
													.sort((a, b) => a.DisplayName > b.DisplayName ? 1 : -1)
													.map((tag, idx) => {
														return (
															<TagItem key={idx} IsCity={tag.IsCity} DisplayName={tag.DisplayName} backgroundColor="#BEDA73"
																	 onPress={this.onTagPress} id={tag._id} />
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

				{
					hasSideEvent && sideEvent && sideEvent.Type === 'Year Change' ?
						<Modal animationType={'fade'} transparent={true} visible={this.state.showYearChange} onRequestClose={() => {console.log('Modal has been closed.')}}>
							<View style={styles.ModalContainer}>
								<View style={styles.ModalInnerContainer}>
									<Text style={styles.Title}>{sideEvent && sideEvent.Title}</Text>
									<ScrollView>
										<Text style={[styles.Description, {fontSize: normalize(12), marginBottom: 10}]}>{sideEvent && sideEvent.FullText}</Text>
									</ScrollView>

									<ActionBar actions={yearChangeActions} />
								</View>
							</View>
						</Modal>
						: null
				}

				<Modal animationType={'fade'} transparent={true} visible={this.state.showSignInModal} onRequestClose={() => {console.log('Modal has been closed.')}}>
					<View style={styles.ModalContainer}>
						<View style={styles.ModalInnerContainer}>
							<ScrollView>
								<Text style={[styles.Description, {fontSize: normalize(12), marginBottom: 10}]}>
									This is the last event you can view in detail without creating an account.
									Would you like to sign up? Click on the button below!
								</Text>
							</ScrollView>

							<ActionBar actions={signInModalActions} />
						</View>
					</View>
				</Modal>
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
		fontSize: normalize(21)
	},
	NationFront: {
		color: '#BEDA73',
		fontWeight: '500',
		fontSize: normalize(15)
	},
	Title: {
		fontSize: normalize(18),
		fontWeight: 'bold',
		color: '#FFFFFF',
		marginBottom: 5
	},
	Description: {
		color: '#FFFFFF',
		justifyContent: 'center',
		fontSize: normalize(11),
		textAlign: 'center'
	},
	NoActiveEvent: {
		color: '#BEDA73',
		fontSize: normalize(15),
		textAlign: 'center'
	},
	ModalContainer: {
		flex: 1,
		justifyContent: 'center',
		padding: 15,
		backgroundColor: 'rgba(0, 0, 0, .5)'
	},
	ModalInnerContainer: {
		alignItems: 'center',
		backgroundColor: 'rgb(139, 154, 97)',
		padding: 15,
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
		pushingOrRemovingFavourite: state.events.pushingOrRemovingFavourite,
		hasSideEvent: state.events.hasSideEvent,
		sideEvent: state.events.sideEvent,
		totalCount: state.events.totalCount,
		initNoAccount: state.session.initNoAccount
	};
}

function mapDispatchToProps(dispatch) {
	return {
		pushNewFavouriteEvent: (eventId) => dispatch(pushNewFavouriteEvent(eventId)),
		removeFromMyFavourites: (eventId) => dispatch(removeFromMyFavourites(eventId)),
		adjustCurrentControl: (ctrlType) => dispatch(adjustCurrentControl(ctrlType)),
		dispatchResetAction: (resetAction) => dispatch(resetAction),
		clearSessionNoAccount: () => dispatch(clearSessionNoAccount())
	};
}

export default connect(mapStateToProps, mapDispatchToProps)(ActiveEvent);
