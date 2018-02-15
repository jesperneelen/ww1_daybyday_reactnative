import React, { Component } from 'react';
import {
	StyleSheet,
	Text,
	TouchableOpacity,
	View
} from 'react-native';

import { NavigationActions } from 'react-navigation';

class DrawerMenu extends Component {
	_navigate(route) {
		let action = NavigationActions.navigate({
			index: 0,
			actions: [NavigationActions.navigate({routeName: 'drawerStack'})]
		});

		setTimeout(() => {
			this.props.navigation.dispatch(
				NavigationActions.navigate({
					routeName: route
				})
			);
		}, 0);

		return this.props.navigation.dispatch(action);
	}

	render() {
		return (
			<View style={styles.container}>
				<TouchableOpacity style={styles.menuItem} onPress={() => this._navigate('Screen1')}>
					<Text style={styles.menuItemText}>Screen 1</Text>
				</TouchableOpacity>
				<TouchableOpacity style={styles.menuItem} onPress={() => this._navigate('Screen2')}>
					<Text style={styles.menuItemText}>Screen 2</Text>
				</TouchableOpacity>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#FFF'
	},
	menuItem: {
		padding: 5,
		justifyContent: 'center',
		marginBottom: 2
	},
	menuItemText: {
		fontSize: 20,
		color: 'rgb(68, 78, 41)'
	}
});

export default DrawerMenu;
