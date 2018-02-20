import React, { Component } from "react";
import { connect } from 'react-redux';
import { StyleSheet, Text, TouchableOpacity, View, Image } from "react-native";

import {
	fetchEvents
} from '../../actions/events';

class Screen1 extends Component {
	static navigationOptions = ({ navigation, screenProps }) => ({
		drawerLabel: "Screen 1",
		title: "Screen 1",
		headerLeft: (
			<View style={{ paddingHorizontal: 10 }}>
				<TouchableOpacity onPress={() => navigation.navigate("DrawerOpen")}>
					<Image source={require('../../../assets/menu.png')} style={{width: 20, height: 20}} />
				</TouchableOpacity>
			</View>
		)
	});

	constructor(props) {
		super(props);
	}

	componentDidMount() {
		const {
			fetchEvents
		} = this.props;

		if(fetchEvents) fetchEvents();
	}

	render() {
		console.log(this.props.events);

		return (
			<View style={styles.container}>
				<Text>Screen 1</Text>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center"
	}
});

Screen1.defaultProps = {};
Screen1.propTypes = {};

function mapStateToProps(state) {
	return {
		events: state.events.data
	};
}

function mapDispatchToProps(dispatch) {
	return {
		fetchEvents: () => dispatch(fetchEvents())
	};
}

export default connect(mapStateToProps, mapDispatchToProps)(Screen1);
