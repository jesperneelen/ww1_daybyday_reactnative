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

export default class FilteredEventList extends Component {
	constructor(props) {
		super(props);

		this.renderItem = this.renderItem.bind(this);
		this.renderNoDataComponent = this.renderNoDataComponent.bind(this);
	}

	_keyExtractor(item, index) {
		return index.toString() + item._id;
	}

	renderItem({item}) {
		const {
			onTagPress,
			onMoreInfoPress,
			onSetActiveEventPress,
			showFavouriteOnMap,
			filteredEventsParams,
			activeEventIndex,
			removeFromFavourites,
			addToFavourites
		} = this.props;

		let actions = [];

		if(!item.isFavouriteEvent) {
			actions.push({
				text: 'Add to my favourites',
				backgroundColor: 'rgb(139, 154, 97)',
				iconName: 'ios-star-outline',
				iconColor: '#FFFFFF',
				iconSize: 25,
				iconType: 'ionicon',
				onPress: () => addToFavourites(item._id)
			});
		} else {
			actions.push({
				text: 'Remove from my favourites',
				backgroundColor: '#DA291C',
				iconName: 'ios-star',
				iconColor: '#FFFFFF',
				iconSize: 25,
				iconType: 'ionicon',
				onPress: () => removeFromFavourites(item._id)
			});
		}

		if(activeEventIndex !== item.eventIndex) {
			//Only add option if this event isn't the current active event
			actions.push({
				text: 'Set as active event',
				backgroundColor: '#1CB417',
				iconName: 'ios-book',
				iconColor: '#FFFFFF',
				iconSize: 25,
				iconType: 'ionicon',
				onPress: () => onSetActiveEventPress(item.eventIndex, item._id)
			});

			//Only add option if there is a "IsCity" in the tags => calculated in the event action fetchEvents()
			if(item.HasCityTags && item.Tags && item.Tags.length > 0 && Array.isArray(item.Tags)) {
				let cityTags = item.Tags.reduce((acc, cur) => {
					if(cur.IsCity) acc.push(cur);
					return acc;
				}, []);

				actions.push({
					text: 'Show on "Day by Day" map',
					backgroundColor: '#636755',
					iconName: 'ios-map',
					iconColor: '#FFFFFF',
					iconSize: 25,
					iconType: 'ionicon',
					onPress: () => showFavouriteOnMap(cityTags)
				});
			}
		}

		if(item && item.SideEvent && item.SideEvent.Type !== 'Year Change') {
			actions.push({
				text: `More info about ${item.SideEvent.Title}`,
				backgroundColor: '#433781',
				iconType: 'ionicon',
				iconName: 'ios-information-circle',
				iconColor: '#FFFFFF',
				iconSize: 25,
				onPress: () => onMoreInfoPress(item.SideEvent)
			});
		}

		const copiedItem = Object.assign({}, item, {
			Tags: item.Tags.reduce((acc, cur) => {
				let isSameTag = false;

				filteredEventsParams.forEach(param => {
					if(param.tagId === cur._id && param.tagDisplayName === cur.DisplayName) {
						isSameTag = true;
					}
				});

				if(!isSameTag) {
					acc.push(cur);
				}

				return acc;
			}, [])
		});

		return (
			<EventItem {...copiedItem} isComplexEvent={true} actions={actions} onTagPress={onTagPress} actionsType="button" />
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
					It looks like there aren't any events for this specific tag!
				</Text>
				<Text style={styles.NoDataText}>
					Choose another one!
				</Text>
			</View>
		);
	};

	render() {
		const {
			filteredEvents,
			pushingOrRemovingFavourite
		} = this.props;

		return (
			<List containerStyle={styles.EventsContainer}>
				<FlatList data={filteredEvents} keyExtractor={this._keyExtractor} ListEmptyComponent={this.renderNoDataComponent}
									renderItem={this.renderItem} ItemSeparatorComponent={this.renderSeparator} extraData={{pushingOrRemovingFavourite}} />
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
