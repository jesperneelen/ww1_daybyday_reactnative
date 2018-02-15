import React, { Component } from "react";
import { StyleSheet, Text, TouchableOpacity, View, Image } from "react-native";

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

	render() {
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

export default Screen1;
