import React, { Component } from 'react';
import { connect } from 'react-redux';

import {
	Animated,
	Text,
	View,
	StyleSheet,
	TouchableWithoutFeedback
} from 'react-native';

class ToastrContainer extends Component {
	constructor(props) {
		super(props);

		this.displayedNotifications = [];
	}

	getToastColor(type='success') {
		let color;
		switch(type) {
			case 'error':
				color = '#DA291C'; break;
			case 'primary':
				color = '#012169'; break;
			case 'warning':
				color = '#ED8B00'; break;
			case 'success':
				color = '#86bc25'; break;
			default:
				color = '#012169'; break;
		}

		return color;
	}

	render() {
		const {
			exceptions
		} = this.props;

		return (
			<View style={styles.toastrContainer}>
				{
					exceptions && exceptions.length > 0 && Array.isArray(exceptions) ?
						exceptions
							.filter((exception) => !exception.removed)
							.map((exception, idx) => {
								let animatedValue;

								if(this.displayedNotifications.indexOf(exception.Id) === -1) {
									this.displayedNotifications.push(exception.Id);

									animatedValue = new Animated.Value(1000);

									Animated.timing(
										animatedValue,
										{
											toValue: 0,
											duration: 350
										}).start();
								}

								return (
									<TouchableWithoutFeedback key={exception.sortValue}>
										<Animated.View style={[styles.animatedView, {backgroundColor: this.getToastColor(exception.type), top: 75 * idx, transform: [{translateX: animatedValue || 0}]}]}>
											<Text style={styles.text}>
												{exception.message}
											</Text>
										</Animated.View>
									</TouchableWithoutFeedback>
								);
							})
						: null
				}
			</View>
		);
	}
}

const styles = StyleSheet.create({
	toastrContainer: {
		position: 'absolute',
		zIndex: 1000,
		top: 20,
		left: 10,
		right: 10
	},
	animatedView: {
		height: 70,
		position: 'absolute',
		left: 0,
		right: 0,
		marginBottom: 3,
		justifyContent: 'center',
		zIndex: 1000
	},
	text: {
		marginLeft: 10,
		color: '#FFF',
		fontSize: 14,
		fontWeight: 'bold'
	}
});

function mapStateToProps(state) {
	return {
		exceptions: state.exceptions
	};
}

export default connect(mapStateToProps)(ToastrContainer);
