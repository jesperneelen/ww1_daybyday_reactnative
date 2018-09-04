import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
	StyleSheet,
	View,
	InteractionManager,
	ActivityIndicator
} from 'react-native';

import { NavigationActions } from 'react-navigation';

import {
	populateFilteredEvents,
	clearFilteredEvents,
	setSideEvent,
	setActiveEvent,
	removeFromMyFavourites,
	pushNewFavouriteEvent
} from '../../actions/events';

import {
	setExtraMarkers
} from '../../actions/map';

import FilteredEventList from '../components/FilteredList';

class FilteredEvents extends Component {
	constructor(props) {
		super(props);

		this.state = {
			loading: true
		};

		this.removeFromFavourites = this.removeFromFavourites.bind(this);
		this.addToFavourites = this.addToFavourites.bind(this);
		this.onTagPress = this.onTagPress.bind(this);
		this.onMoreInfoPress = this.onMoreInfoPress.bind(this);
		this.setFilterEventAsActiveEvent = this.setFilterEventAsActiveEvent.bind(this);
		this.showFavouriteOnMap = this.showFavouriteOnMap.bind(this);
	}

	componentDidMount() {
		// 1: Component is mounted off-screen
		// => the code below causes a major performance boost!
		InteractionManager.runAfterInteractions(() => {
			// 2: Component is done animating
			// 3: Start fetching the filtered events
			const {
				populateFilteredEvents,
				navigation: {
					state: {
						params
					}
				}
			} = this.props;

			if(populateFilteredEvents && params && params.tagId && params.tagDisplayName) {
				populateFilteredEvents(params.tagId, params.tagDisplayName);
			}
		});
	}

	static getDerivedStateFromProps(nextProps, prevState) {
		const {
			filteredEvents
		} = nextProps;

		if(filteredEvents && Array.isArray(filteredEvents) && prevState.loading) {
			return {
				loading: false
			};
		}

		return null;
	}

	componentWillUnmount() {
		const {
			clearFilteredEvents,
			navigation: {
				state: {
					params
				}
			}
		} = this.props;

		if(clearFilteredEvents && params && params.tagId) {
			clearFilteredEvents(params.tagId);
		}
	}

	onTagPress(tagId, tagDisplayName) {
		const {
			navigation
		} = this.props;

		if(navigation && navigation.navigate && tagId && tagDisplayName) {
			navigation.navigate('filteredEvents', {tagId, tagDisplayName});
		}
	}

	onMoreInfoPress(sideEvent) {
		const {
			navigation,
			setSideEvent
		} = this.props;

		if(navigation && navigation.navigate && sideEvent && setSideEvent) {
			setSideEvent(sideEvent);
			navigation.navigate('sideEvent', {SideEventTitle: sideEvent.Title});
		}
	}

	setFilterEventAsActiveEvent(eventIdx, eventId) {
		const {
			setActiveEvent
		} = this.props;

		if(setActiveEvent && eventIdx && eventId) {
			setActiveEvent(eventIdx, eventId);
			this._navigateHome();
		}
	}

	showFavouriteOnMap(eventTags) {
		const {
			setExtraMarkers
		} = this.props;

		if(setExtraMarkers && eventTags) {
			setExtraMarkers(eventTags);
			this._navigateHome();
		}
	}

	_navigateHome() {
		const {
			navigation
		} = this.props;

		navigation.dispatch(NavigationActions.reset({
			index: 0,
			actions: [
				NavigationActions.navigate({routeName: 'home'})
			]
		}));
	}

	removeFromFavourites(eventId) {
		const {
			removeFromMyFavourites
		} = this.props;

		if(removeFromMyFavourites && eventId) {
			removeFromMyFavourites(eventId, true);
		}
	}

	addToFavourites(eventId) {
		const {
			addToFavourites
		} = this.props;

		if(addToFavourites && eventId) {
			addToFavourites(eventId);
		}
	}

	render() {
		const {
			filteredEvents,
			filteredEventsParams,
			activeEventIndex,
			pushingOrRemovingFavourite
		} = this.props;

		const {
			loading
		} = this.state;

		return (
			<View style={[styles.ScreenContainer, loading ? styles.LoadingContainer : null]}>
				{
					!!loading ?
						<ActivityIndicator animating={true} size="large" />
						: <FilteredEventList filteredEvents={filteredEvents}
											 activeEventIndex={activeEventIndex}
											 removeFromFavourites={this.removeFromFavourites}
											 addToFavourites={this.addToFavourites}
											 onTagPress={this.onTagPress}
											 onMoreInfoPress={this.onMoreInfoPress}
											 onSetActiveEventPress={this.setFilterEventAsActiveEvent}
											 showFavouriteOnMap={this.showFavouriteOnMap}
											 filteredEventsParams={filteredEventsParams}
											 pushingOrRemovingFavourite={pushingOrRemovingFavourite} />
				}
			</View>
		);
	}
}

const styles = StyleSheet.create({
	ScreenContainer: {
		flex: 1,
		backgroundColor: '#FFFFFF'
	},
	LoadingContainer: {
		flexDirection: 'column',
		justifyContent: 'center',
		alignItems: 'center'
	}
});

function mapStateToProps(state, ownProps) {
	return {
		filteredEvents: state.events.filteredEvents[ownProps.navigation.state.params.tagId],
		filteredEventsParams: state.events.filteredEventsParams,
		activeEventIndex: state.events.activeEventIndex,
		pushingOrRemovingFavourite: state.events.pushingOrRemovingFavourite
	};
}

function mapDispatchToProps(dispatch) {
	return {
		populateFilteredEvents: (tagId, tagDisplayName) => dispatch(populateFilteredEvents(tagId, tagDisplayName)),
		clearFilteredEvents: (tagId) => dispatch(clearFilteredEvents(tagId)),
		setSideEvent: (sideEvent) => dispatch(setSideEvent(sideEvent)),
		setActiveEvent: (eventIdx, eventId) => dispatch(setActiveEvent(eventIdx, eventId)),
		setExtraMarkers: (eventTags) => dispatch(setExtraMarkers(eventTags)),
		removeFromMyFavourites: (eventId) => dispatch(removeFromMyFavourites(eventId)),
		addToFavourites: (eventId) => dispatch(pushNewFavouriteEvent(eventId))
	};
}

export default connect(mapStateToProps, mapDispatchToProps)(FilteredEvents);
