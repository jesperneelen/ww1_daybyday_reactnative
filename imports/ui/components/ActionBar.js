import React, { Component } from 'react';

import {
	Icon
} from 'react-native-elements';

import {
	View,
	Text,
	StyleSheet,
	TouchableOpacity,
	ActivityIndicator
} from 'react-native';

export const ActionBar = ({actions}) => {
	return (
		<View style={styles.ActionsContainer}>
			<View style={styles.Actions}>
				{
					actions && actions.length > 0 && Array.isArray(actions) ?
						actions.map((action, idx) => {
							return (
								<TouchableOpacity key={idx} style={[styles.Action, {backgroundColor: action.backgroundColor || 'rgb(119, 121, 61)'}]} onPress={() => action.onPress()}>
									{
										action.loading ?
											<ActivityIndicator animating={true} size="small" />
											: <Icon type={action.iconType} name={action.iconName} color={action.iconColor} size={action.iconSize} />
									}

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
		flexDirection: 'row',
		flexWrap: 'wrap'
	},
	Action: {
		marginTop: 2,
		marginLeft: 2,
		paddingVertical: 4,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		flexGrow: 1
	},
	ActionText: {
		color: '#FFFFFF',
		marginLeft: 4,
		fontSize: 12
	}
});
