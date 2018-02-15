import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import ToastrContainer from './containers/Toastr';
import App from '../routes';

class Wrapper extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<View style={styles.wrapper}>
				<ToastrContainer />
				<App />
			</View>
		);
	}
}

const styles = StyleSheet.create({
	wrapper: {
		flex: 1
	}
});

export default Wrapper;
