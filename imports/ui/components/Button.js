import React, { Component } from 'react';

import {
	TouchableHighlight,
	Text,
	StyleSheet,
	View,
	ActivityIndicator
} from 'react-native';

export default class Button extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		const {
			onPress,
			text,
			noMarginTop,
			inverted,
			fbButton,
			loading
		} = this.props;

		return (
			<TouchableHighlight onPress={onPress} style={[styles.defaultButton, fbButton ? styles.fbButton : (inverted ? styles.invertedButton : styles.button), {marginTop: noMarginTop ? 0 : 10}]}
													underlayColor={fbButton ? 'rgba(68, 104, 176, .5)' : 'rgba(119, 121, 61, .5)'}>
				{
					!loading || loading === undefined ?
						<Text style={[styles.defaultButtonText, inverted ? styles.invertedButtonText : styles.buttonText]}>
							{text}
						</Text>
						:
						<View style={styles.loading}>
							<ActivityIndicator size="small" animating={true} />
						</View>
				}
			</TouchableHighlight>
		);
	}
}

const styles = StyleSheet.create({
	defaultButton: {
		alignItems: 'center',
		paddingLeft: 25,
		paddingRight: 25,
		paddingTop: 13,
		paddingBottom: 13,
		justifyContent: 'center',
		height: 50
	},
	defaultButtonText: {
		fontSize: 12,
		fontWeight: 'bold'
	},
	button: {
		backgroundColor: 'rgb(119, 121, 61)'
	},
	buttonText: {
		color: '#FFF'
	},
	invertedButton: {
		backgroundColor: '#fff'
	},
	invertedButtonText: {
		color: 'rgb(119, 121, 61)'
	},
	fbButton: {
		backgroundColor: 'rgb(68, 104, 176)'
	},
	loading: {
		position: 'absolute',
		left: 0,
		right: 0,
		top: 0,
		bottom: 0,
		alignItems: 'center',
		justifyContent: 'center'
	}
});
