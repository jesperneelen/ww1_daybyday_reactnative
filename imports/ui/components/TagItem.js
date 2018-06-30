import React, { Component } from 'react';

import {
	Icon
} from 'react-native-elements';

import {
	TouchableOpacity,
	Text,
	StyleSheet
} from 'react-native';

import { normalize } from '../utils/responsive-ui';

export default class TagItem extends Component {
	constructor(props) {
		super(props);

		this.onPress = this.onPress.bind(this);
	}

	onPress() {
		const {
			onPress,
			id,
			DisplayName
		} = this.props;

		if(onPress) {
			onPress(id, DisplayName);
		}
	}

	render() {
		let {
			IsCity,
			DisplayName,
			backgroundColor
		} = this.props;

		return (
			<TouchableOpacity style={[styles.Tag, {backgroundColor}]} onPress={() => this.onPress()}>
				<Icon type={IsCity ? 'material-community': 'ionicon'} name={IsCity ? 'city' : 'ios-pricetags'} color={'white'} size={normalize(18)} />
				<Text style={styles.TagText}>{DisplayName}</Text>
			</TouchableOpacity>
		);
	}
}

const styles = StyleSheet.create({
	Tag: {
		paddingVertical: 3,
		paddingHorizontal: 6,
		margin: 3,
		flexDirection: 'row',
		alignItems: 'center',
		borderRadius: 4,
		shadowColor: 'rgb(68, 78, 41)',
		shadowOffset: { width: 0, height: 3 },
		shadowOpacity: .7,
		shadowRadius: 2,
		elevation: 2
	},
	TagText: {
		color: 'white',
		fontSize: normalize(10),
		marginLeft: 3
	},
});
