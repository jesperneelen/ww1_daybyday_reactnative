import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
	View,
	StyleSheet
} from 'react-native';

import MyFavouriteEvents from '../components/FavouriteEvents';
import { removeFromMyFavourites } from '../../actions/events';

class MyFavourites extends Component {
	constructor(props) {
		super(props);

		this.removeFromFavourites = this.removeFromFavourites.bind(this);
	}

	removeFromFavourites(eventId) {
		const {
			removeFromMyFavourites
		} = this.props;

		if(removeFromMyFavourites && eventId) {
			removeFromMyFavourites(eventId, true);
		}
	}

	render() {
		const {
			myFavouriteEvents
		} = this.props;

		return (
			<View style={styles.ScreenContainer}>
				<MyFavouriteEvents myFavouriteEvents={myFavouriteEvents}
													 removeFromFavourites={this.removeFromFavourites} />
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
		removeFromMyFavourites: (eventId, noTimeOut) => dispatch(removeFromMyFavourites(eventId, noTimeOut))
	};
}

export default connect(mapStateToProps, mapDispatchToProps)(MyFavourites);
