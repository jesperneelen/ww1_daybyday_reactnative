import React, { Component } from "react";
import { StyleSheet, Text, TouchableOpacity, View, Image } from "react-native";

class Screen2 extends Component {
	static navigationOptions = ({ navigation, screenProps }) => ({
		drawerLabel: "Screen 2",
		title: "Screen 2",
		headerLeft: (
			<View style={{ paddingHorizontal: 10 }}>
				<TouchableOpacity onPress={() => navigation.navigate("DrawerOpen")}>
					<Image source={require('../../../assets/menu.png')} style={{width: 20, height: 20}} />
				</TouchableOpacity>
			</View>
		)
	});

	render() {
		return (
			<View style={styles.container}>
				<Text>Screen 2</Text>
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

Screen2.defaultProps = {};
Screen2.propTypes = {};

export default Screen2;
