import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
	View,
	StyleSheet
} from 'react-native';

import MyFavouriteEvents from '../components/FavouriteEvents';
import { removeFromMyFavourites, setSideEvent } from '../../actions/events';

class MyFavourites extends Component {
	constructor(props) {
		super(props);

		this.removeFromFavourites = this.removeFromFavourites.bind(this);
		this.onTagPress = this.onTagPress.bind(this);
		this.onMoreInfoPress = this.onMoreInfoPress.bind(this);
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

	render() {
		const {
			myFavouriteEvents
		} = this.props;

		return (
			<View style={styles.ScreenContainer}>
				<MyFavouriteEvents myFavouriteEvents={myFavouriteEvents}
													 removeFromFavourites={this.removeFromFavourites}
													 onTagPress={this.onTagPress}
													 onMoreInfoPress={this.onMoreInfoPress} />
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
		myFavourites: state.events.myFavourites
	};
}

function mapDispatchToProps(dispatch) {
	return {
		removeFromMyFavourites: (eventId, noTimeOut) => dispatch(removeFromMyFavourites(eventId, noTimeOut)),
		setSideEvent: (sideEvent) => dispatch(setSideEvent(sideEvent))
	};
}

export default connect(mapStateToProps, mapDispatchToProps)(MyFavourites);
