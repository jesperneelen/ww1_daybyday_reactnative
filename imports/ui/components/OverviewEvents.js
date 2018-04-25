import React, { Component } from 'react';
import {
	View,
	StyleSheet,
	Dimensions,
	TouchableHighlight,
	TouchableOpacity,
	Animated
} from 'react-native';
import {
	Icon
} from 'react-native-elements';

import EventsList from './Events';

const windowHeight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;

export default class OverviewEvents extends Component {
	constructor(props) {
		super(props);

		this.state = {
			collapsed: true
		};

		this.onToggle = this.onToggle.bind(this);

		this.translateX = new Animated.Value(windowWidth);
		this.toggleRightValue = new Animated.Value(0);
		this.rotateValue = new Animated.Value(0);
	}

	onToggle() {
		this.setState((prevState) => {
			Animated.parallel([
				Animated.timing(
					this.translateX,
					{
						toValue: prevState.collapsed ? 0 : windowWidth,
						duration: 500
					}
				),
				Animated.timing(
					this.toggleRightValue,
					{
						toValue: prevState.collapsed ? windowWidth : 0,
						duration: 500
					}
				),
				Animated.timing(
					this.rotateValue,
					{
						toValue: prevState.collapsed ? .5 : 0,
						duration: 500
					}
				)
			]).start();

			return {
				collapsed: !prevState.collapsed
			};
		});
	}

	render() {
		const rotate = this.rotateValue.interpolate({
			inputRange: [0, 1],
			outputRange: ['0deg', '360deg']
		});

		const {
			componentHeight
		} = this.props;

		return (
			<View style={[styles.OverviewContainer, {height: componentHeight}]} pointerEvents={'box-none'}>
				<Animated.View style={[styles.ToggleContainer, {right: this.toggleRightValue}]}>
					<TouchableHighlight onPress={this.onToggle} underlayColor="#EEE" style={styles.Toggle}>
						<Animated.View style={{transform: [{rotateY: rotate}]}}>
							<Icon type="font-awesome" name={'chevron-left'} color={'rgb(68, 78, 41)'} size={30} />
						</Animated.View>
					</TouchableHighlight>
				</Animated.View>

				<Animated.View style={[styles.EventsWrapper, {transform: [{translateX: this.translateX}], height: componentHeight}]}>
					<TouchableOpacity onPress={this.onToggle} underlayColor="#EEE" style={[styles.CloseToggle, {height: 30}]}>
						<Icon type="ionicon" name={'ios-close-circle'} color={'rgb(68, 78, 41)'} size={30} style={{alignSelf: 'center'}} />
					</TouchableOpacity>

					<EventsList events={this.props.events} limit={50} height={componentHeight - 30} />
				</Animated.View>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	OverviewContainer: {
		position: 'absolute',
		top: 0,
		right: 0
	},
	ToggleContainer: {
		backgroundColor: '#FFF',
		position: 'absolute',
		height: windowHeight / 7,
		width: 25,
		top: windowHeight / 4,
		justifyContent: 'center',
		borderBottomLeftRadius: 5,
		borderTopLeftRadius: 5,
		zIndex: 1
	},
	Toggle: {
		flex: 1,
		justifyContent: 'center'
	},
	EventsWrapper: {
		backgroundColor: '#FFF',
		flex: 1,
		width: windowWidth
	},
	CloseToggle: {
		paddingHorizontal: 3,
		marginTop: 2,
		flex: 1,
		alignItems: 'flex-end'
	}
});
