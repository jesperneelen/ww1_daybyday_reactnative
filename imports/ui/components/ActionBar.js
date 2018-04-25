import React, { Component } from 'react';

import {
	Icon
} from 'react-native-elements';

import {
	View,
	Text,
	StyleSheet,
	TouchableOpacity
} from 'react-native';

export const ActionBar = ({actions}) => {
	return (
		<View style={styles.ActionsContainer}>
			<View style={styles.Actions}>
				{
					actions && actions.length > 0 && Array.isArray(actions) ?
						actions.map((action, idx) => {
							return (
								<TouchableOpacity key={idx} style={styles.Action} onPress={() => action.onPress()}>
									<Icon type={action.iconType} name={action.iconName} color={action.iconColor} size={action.iconSize} />
									<Text style={styles.ActionText}>{action.text}</Text>
								</TouchableOpacity>
							);
						})
						: null
				}
			</View>
		</View>
	);
};

export default ActionBar;

const styles = StyleSheet.create({
	ActionsContainer: {
		flexDirection: 'row'
	},
	Actions: {
		flex: 1,
		flexDirection: 'row'
	},
	Action: {
		marginLeft: 2,
		paddingVertical: 4,
		backgroundColor: 'rgb(119, 121, 61)',
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		flexGrow: 1
	},
	ActionText: {
		color: '#FFFFFF',
		marginLeft: 4
	}
});
