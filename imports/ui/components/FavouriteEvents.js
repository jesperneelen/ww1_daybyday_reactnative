import React, { Component } from 'react';
import {
	FlatList,
	View,
	Text,
	StyleSheet
} from 'react-native';

import {
	List
} from 'react-native-elements';

import EventItem from './EventItem';

export default class MyFavouriteEventsList extends Component {
	constructor(props) {
		super(props);

		this.renderItem = this.renderItem.bind(this);
		this.renderNoDataComponent = this.renderNoDataComponent.bind(this);
	}

	_keyExtractor(item, idx) {
		return idx.toString() + item._id;
	}

	renderItem({item}) {
		const {
			removeFromFavourites,
			onTagPress
		} = this.props;

		const actions = [
			{
				text: 'Remove from my favourites',
				iconName: 'ios-star-outline',
				backgroundColor: '#DA291C',
				iconColor: '#FFFFFF', iconSize: 25, iconType: 'ionicon',
				onPress: () => removeFromFavourites(item._id)
			}
		];

		return (
			<EventItem {...item} isFavouriteEvent={true} actions={actions} onTagPress={onTagPress} />
		);
	}

	renderSeparator = () => {
		return (
			<View style={styles.Separator} />
		);
	};

	renderNoDataComponent = () => {
		return (
			<View style={styles.NoDataContainer}>
				<Text style={styles.NoDataText}>
					It looks like you haven't indicated any event as favourite.
				</Text>
				<Text style={styles.NoDataText}>
					You can do this by clicking "Add to my favourites" when investigating the details of your active event!
				</Text>
			</View>
		);
	};

	render() {
		const {
			myFavouriteEvents
		} = this.props;

		return (
			<List containerStyle={styles.EventsContainer}>
				<FlatList data={myFavouriteEvents} keyExtractor={this._keyExtractor} ListEmptyComponent={this.renderNoDataComponent}
									renderItem={this.renderItem} ItemSeparatorComponent={this.renderSeparator} />
			</List>
		);
	}
}

const styles = StyleSheet.create({
	EventsContainer: {
		marginTop: 0,
		borderTopWidth: 0,
		borderBottomWidth: 0
	},
	Separator: {
		height: 1,
		width: '86%',
		backgroundColor: '#CED0CE',
		marginLeft: '7%',
		marginRight: '7%'
	},
	NoDataContainer: {
		flexDirection: 'column',
		margin: 10
	},
	NoDataText: {
		color: 'rgb(68, 78, 41)',
		fontSize: 18,
		textAlign: 'center'
	}
});
