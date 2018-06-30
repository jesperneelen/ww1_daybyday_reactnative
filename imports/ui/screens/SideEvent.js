import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
	StyleSheet,
	View,
	Text,
	ScrollView
} from 'react-native';

import { normalize } from '../utils/responsive-ui';

class SideEvent extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		const {
			sideEvent
		} = this.props;

		if(sideEvent && sideEvent !== null) {
			return (
				<View style={styles.ScreenContainer}>
					<ScrollView>
						<Text style={styles.Description}>
							{sideEvent.FullText}
						</Text>
					</ScrollView>
				</View>
			);
		}

		return null;
	}
}

const styles = StyleSheet.create({
	ScreenContainer: {
		flex: 1,
		backgroundColor: '#FFFFFF',
		overflow: 'scroll'
	},
	Description: {
		paddingHorizontal: 10,
		marginTop: 12,
		opacity: 0.9,
		justifyContent: 'center',
		fontSize: normalize(12),
		textAlign: 'center'
	}
});

function mapStateToProps(state) {
	return {
		sideEvent: state.events.sideEvent
	};
}

export default connect(mapStateToProps)(SideEvent);
