import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
	View,
	StyleSheet
} from 'react-native';
import { NavigationActions } from 'react-navigation';

import MyFavouriteEvents from '../components/FavouriteEvents';
import { removeFromMyFavourites, setSideEvent, setActiveEvent } from '../../actions/events';
import { setExtraMarkers } from '../../actions/map';

class MyFavourites extends Component {
	constructor(props) {
		super(props);

		this.removeFromFavourites = this.removeFromFavourites.bind(this);
		this.onTagPress = this.onTagPress.bind(this);
		this.onMoreInfoPress = this.onMoreInfoPress.bind(this);
		this.setFavouriteAsActiveEvent = this.setFavouriteAsActiveEvent.bind(this);
		this.showFavouriteOnMap = this.showFavouriteOnMap.bind(this);
	}

	removeFromFavourites(eventId) {
		const {
			removeFromMyFavourites
		} = this.props;

		if(removeFromMyFavourites && eventId) {
			removeFromMyFavourites(eventId, true);
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

	setFavouriteAsActiveEvent(eventIdx, eventId) {
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

		const backAction = NavigationActions.back({
			key: 'home'
		});

		navigation.dispatch({type: NavigationActions.BACK, action: backAction});
	}

	render() {
		const {
			myFavouriteEvents,
			activeEventIndex
		} = this.props;

		return (
			<View style={styles.ScreenContainer}>
				<MyFavouriteEvents myFavouriteEvents={myFavouriteEvents}
													 activeEventIndex={activeEventIndex}
													 removeFromFavourites={this.removeFromFavourites}
													 onTagPress={this.onTagPress}
													 onMoreInfoPress={this.onMoreInfoPress}
													 onSetActiveEventPress={this.setFavouriteAsActiveEvent}
													 showFavouriteOnMap={this.showFavouriteOnMap} />
			</View>
		);
	}
}

const styles = StyleSheet.create({
	ScreenContainer: {
		flex: 1,
		backgroundColor: '#FFFFFF'
	}
});

function mapStateToProps(state) {
	return {
		myFavouriteEvents: state.events.myFavouriteEvents,
		activeEventIndex: state.events.activeEventIndex
	};
}

function mapDispatchToProps(dispatch) {
	return {
		removeFromMyFavourites: (eventId, noTimeOut) => dispatch(removeFromMyFavourites(eventId, noTimeOut)),
		setSideEvent: (sideEvent) => dispatch(setSideEvent(sideEvent)),
		setActiveEvent: (eventIdx, eventId) => dispatch(setActiveEvent(eventIdx, eventId)),
		setExtraMarkers: (eventTags) => dispatch(setExtraMarkers(eventTags))
	};
}

export default connect(mapStateToProps, mapDispatchToProps)(MyFavourites);
