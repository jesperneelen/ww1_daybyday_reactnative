import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
	FlatList,
	View,
	ActivityIndicator,
	StyleSheet
} from 'react-native';
import { List } from 'react-native-elements';

import EventItem from './EventItem';
import { fetchEvents, setActiveEvent, setPage } from '../../actions/events';

class EventsList extends Component {
	constructor(props) {
		super(props);

		this.state = {
			page: props.page || 0,
			limit: props.limit || 50
		};

		this.handleLoadMore = this.handleLoadMore.bind(this);
		this.renderItem = this.renderItem.bind(this);
		this.onPressItem = this.onPressItem.bind(this);
	}

	componentDidMount() {
		const {
			fetchEvents,
			events
		} = this.props;

		if(fetchEvents && events.length === 0) fetchEvents();
	}

	componentWillReceiveProps(nextProps) {
		if(nextProps.page !== this.state.page) {
			this.setState(() => ({
				page: nextProps.page
			}));
		}
	}

	shouldComponentUpdate(nextProps, nextState) {
		return nextProps.lastUpdated > this.props.lastUpdated
			|| this.state.page !== nextState.page
			|| this.state.limit !== nextState.limit;
	}

	_keyExtractor(item, idx) {
		return item._id;
	}

	renderItem({item, index}) {
		//selected={!!this.state.selected.get(item.id)}

		return (
			<EventItem {...item} onPress={() => this.onPressItem(index)} />
		);
	}

	onPressItem(index) {
		if(this.props.activeEventIndex !== index) {
			this.props.setActiveEvent(index);
		}
	}

	renderSeparator = () => {
		return (
			<View style={styles.Separator} />
		);
	};

	renderFooter = () => {
		if(!this.props.isFetching) return null;

		return (
			<View style={styles.Footer}>
				<ActivityIndicator animating={true} size="large" />
			</View>
		);
	};

	handleLoadMore() {
		if(!this.props.isFetching) {
			this.setState((prevState) => {
				let nextPage = prevState.page;
				nextPage++;

				if((nextPage * prevState.limit) + prevState.limit < this.props.totalCount + prevState.limit) {
					this.props.fetchEvents(nextPage * prevState.limit, prevState.limit, this.props.totalCount);
					this.props.setPage(nextPage);
				}

				return {
					page: nextPage
				};
			});
		}
	}

	render() {
		const {
			events,
			height
		} = this.props;

		return (
			<List containerStyle={[styles.EventsContainer, {height}]}>
				<FlatList data={events} keyExtractor={this._keyExtractor} renderItem={this.renderItem}
									ItemSeparatorComponent={this.renderSeparator} ListFooterComponent={this.renderFooter}
									onEndReached={this.handleLoadMore} onEndReachedThreshold={0.3} />
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
	Footer: {
		paddingVertical: 20,
		borderTopWidth: 1,
		borderColor: '#CED0CE'
	}
});

function mapStateToProps(state) {
	return {
		events: state.events.data,
		isFetching: state.events.isFetching,
		lastUpdated: state.events.lastUpdated,
		totalCount: state.events.totalCount,
		activeEventIndex: state.events.activeEventIndex,
		page: state.events.page
	};
}

function mapDispatchToProps(dispatch) {
	return {
		fetchEvents: (skip, limit, totalCount) => dispatch(fetchEvents(skip, limit, totalCount)),
		setActiveEvent: (idx) => dispatch(setActiveEvent(idx)),
		setPage: (page) => dispatch(setPage(page))
	};
}


export default connect(mapStateToProps, mapDispatchToProps)(EventsList);