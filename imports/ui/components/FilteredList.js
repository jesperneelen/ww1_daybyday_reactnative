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
			filteredEventsParams
		} = this.props;

		const actions = [

		];

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
			<EventItem {...copiedItem} isFavouriteEvent={true} actions={actions} onTagPress={onTagPress} />
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
			filteredEvents
		} = this.props;

		return (
			<List containerStyle={styles.EventsContainer}>
				<FlatList data={filteredEvents} keyExtractor={this._keyExtractor} ListEmptyComponent={this.renderNoDataComponent}
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
