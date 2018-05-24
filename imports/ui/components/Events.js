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

		this.scrolledToMiddle = false;
	}

	componentDidMount() {
		const {
			fetchEvents,
			events
		} = this.props;

		if(fetchEvents && events.length === 0) fetchEvents(true);
	}

	componentWillReceiveProps(nextProps) {
		if(nextProps.page !== this.state.page) {
			this.setState(() => ({
				page: nextProps.page
			}));
		}

		if(nextProps.activeEventIndex && nextProps.activeEventIndex !== null && !this.scrolledToMiddle && this.flatList && !nextProps.isFetching) {
			setTimeout(() => {
				this.flatList.scrollToItem({
					item: nextProps.events[nextProps.activeEventIndex],
					viewPosition: 0,
					animated: true
				});

				this.scrolledToMiddle = true;
			});
		}

		 if(nextProps.collapsed) {
		 	this.scrolledToMiddle = false;
		 }
	 }

	shouldComponentUpdate(nextProps, nextState) {
		return nextProps.lastUpdated > this.props.lastUpdated
			|| this.state.page !== nextState.page
			|| this.state.limit !== nextState.limit
			|| this.props.activeEventIndex !== nextProps.activeEventIndex
			|| this.props.maxEventIndex !== nextProps.maxEventIndex
			|| this.props.collapsed !== nextProps.collapsed;
	}

	_keyExtractor(item) {
		return item._id;
	}

	renderItem({item, index}) {
		const {
			activeEventIndex,
			maxEventIndex
		} = this.props;

		return (
			<EventItem {...item} onPress={() => this.onPressItem(index, item._id)}
								 selected={activeEventIndex === index}
								 available={maxEventIndex >= index}
								 isFavouriteEvent={false} />
		);
	}

	onPressItem(index, eventId) {
		if(this.props.activeEventIndex !== index) {
			this.props.setActiveEvent(index, eventId);
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
					this.props.fetchEvents(false, nextPage * prevState.limit, prevState.limit, this.props.totalCount);
					this.props.setPage(nextPage);
				}

				return {
					page: nextPage
				};
			});
		}
	}

	getItemLayout = (data, index) => (
		{ length: 71, offset: 71 * index, index }
	);

	render() {
		const {
			events,
			height,
			activeEventIndex,
			maxEventIndex
		} = this.props;

		return (
			<List containerStyle={[styles.EventsContainer, {height}]}>
				<FlatList ref={(flatList) => this.flatList = flatList} data={events} keyExtractor={this._keyExtractor} renderItem={this.renderItem}
									ItemSeparatorComponent={this.renderSeparator} ListFooterComponent={this.renderFooter} getItemLayout={this.getItemLayout}
									onEndReached={this.handleLoadMore} onEndReachedThreshold={.3} extraData={{activeEventIndex, maxEventIndex}} />
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
		page: state.events.page,
		maxEventIndex: state.events.maxEventIndex
	};
}

function mapDispatchToProps(dispatch) {
	return {
		fetchEvents: (init, skip, limit, totalCount) => dispatch(fetchEvents(init, skip, limit, totalCount)),
		setActiveEvent: (idx, eventId) => dispatch(setActiveEvent(idx, eventId)),
		setPage: (page) => dispatch(setPage(page))
	};
}

export default connect(mapStateToProps, mapDispatchToProps)(EventsList);
