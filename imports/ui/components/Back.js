import React, { PureComponent } from 'react';

import {
	TouchableOpacity,
	StyleSheet
} from 'react-native';

import {
	Icon
} from 'react-native-elements';

import {
	normalize
} from '../utils/responsive-ui';

import { NavigationActions, withNavigation } from 'react-navigation';

class BackButton extends PureComponent {
	constructor(props) {
		super(props);

		this.goBack = this.goBack.bind(this);
	}

	goBack() {
		const {
			navigation
		} = this.props;

		if(navigation && navigation.dispatch) {
			const backAction = NavigationActions.back({
				key: 'home'
			});

			navigation.dispatch({type: NavigationActions.BACK, action: backAction});
		}
	}

	render() {
		return(
			<TouchableOpacity onPress={this.goBack} style={styles.BackButton}>
				<Icon name="ios-arrow-back" type="ionicon" size={normalize(30)} color="#FFFFFF" />
			</TouchableOpacity>
		);
	}
}

const styles = StyleSheet.create({
	BackButton: {
		marginLeft: 10
	}
});

export default withNavigation(BackButton);
