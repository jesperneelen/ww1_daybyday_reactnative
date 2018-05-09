import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
	StyleSheet,
	View
} from 'react-native';

import {
	populateFilteredEvents,
	clearFilteredEvents
} from '../../actions/events';

import FilteredEventList from '../components/FilteredList';

class FilteredEvents extends Component {
	constructor(props) {
		super(props);

		this.onTagPress = this.onTagPress.bind(this);
	}

	componentDidMount() {
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

	render() {
		const {
			filteredEvents,
			filteredEventsParams
		} = this.props;

		return (
			<View style={styles.ScreenContainer}>
				<FilteredEventList filteredEvents={filteredEvents}
													 onTagPress={this.onTagPress}
													 filteredEventsParams={filteredEventsParams} />
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

function mapStateToProps(state, ownProps) {
	return {
		filteredEvents: state.events.filteredEvents[ownProps.navigation.state.params.tagId],
		filteredEventsParams: state.events.filteredEventsParams
	};
}

function mapDispatchToProps(dispatch) {
	return {
		populateFilteredEvents: (tagId, tagDisplayName) => dispatch(populateFilteredEvents(tagId, tagDisplayName)),
		clearFilteredEvents: (tagId) => dispatch(clearFilteredEvents(tagId))
	};
}

export default connect(mapStateToProps, mapDispatchToProps)(FilteredEvents);
