import React, { Component } from 'react';

import {
	Icon
} from 'react-native-elements';

import {
	View,
	Text,
	StyleSheet
} from 'react-native';

export default class TagItem extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		let {
			IsCity,
			DisplayName,
			backgroundColor
		} = this.props;

		return (
			<View style={[styles.Tag, {backgroundColor}]}>
				<Icon type={IsCity ? 'material-community': 'ionicon'} name={IsCity ? 'city' : 'ios-pricetags'} color={'white'} size={20} />
				<Text style={styles.TagText}>{DisplayName}</Text>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	Tag: {
		paddingVertical: 2,
		paddingHorizontal: 6,
		margin: 3,
		flexDirection: 'row',
		alignItems: 'center',
		borderRadius: 4
	},
	TagText: {
		color: 'white',
		fontSize: 11,
		marginLeft: 3
	},
});
