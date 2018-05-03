import React, { Component } from 'react';
import { connect } from 'react-redux';
import { View, StyleSheet } from 'react-native';
import { addNavigationHelpers } from 'react-navigation';

import ToastrContainer from './containers/Toastr';
import App from '../routes';
import { addListener } from '../store/configureStore';

class Wrapper extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<View style={styles.wrapper}>
				<ToastrContainer />

				<App navigation={addNavigationHelpers({
					dispatch: this.props.dispatch,
					state: this.props.navigation,
					addListener
				})} />
			</View>
		);
	}
}

const styles = StyleSheet.create({
	wrapper: {
		flex: 1
	}
});

const mapStateToProps = state => ({
	navigation: state.navigation
});

export default connect(mapStateToProps)(Wrapper);
