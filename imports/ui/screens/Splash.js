import React, { Component } from 'react';
import { connect } from 'react-redux';
import { StyleSheet, Image, View, ActivityIndicator } from 'react-native';
import { NavigationActions } from 'react-navigation';

import {
	fetchProfile
} from '../../actions/session';

class SplashScreen extends Component {
	constructor(props) {
		super(props);
	}

	componentDidMount() {
		const {
			user,
			authenticated,
			fetchingProfileError,
			fetchProfile
		} = this.props;

		if(fetchProfile && user === null && !authenticated && !fetchingProfileError) fetchProfile();
	}

	componentWillReceiveProps(nextProps) {
		if(nextProps.fetchingProfileError && !nextProps.fetchingProfile) {
			setTimeout(() => {
				//Reset navigation, Splash screen was never here!
				nextProps.navigation.dispatch(NavigationActions.reset({
					index: 0,
					actions: [
						NavigationActions.navigate({routeName: 'notAuthenticatedStack'})
					]
				}));
			}, 2000);
		} else if(!nextProps.fetchingProfileError && !nextProps.fetchingProfile && !nextProps.registeringUser && nextProps.authenticated && nextProps.user !== null) {
			setTimeout(() => {
				//Reset navigation, Splash screen was never here!
				nextProps.navigation.dispatch(NavigationActions.reset({
					index: 0,
					actions: [
						NavigationActions.navigate({routeName: 'AuthenticatedStack'})
					]
				}));
			}, 2000);
		}
	}

	render() {
		return (
			<View style={styles.fillBackground}>
				<Image source={require('../../../assets/launch-screen-text.png')} style={styles.appHeaderImage} resizeMode="contain" />
				<ActivityIndicator style={styles.loadingIndicator} animating={true} size={'large'} />
			</View>
		);
	}
}

const styles = StyleSheet.create({
	fillBackground: {
		padding: 40,
		flex: 1,
		backgroundColor: '#444D2B',
		flexDirection: 'column',
		alignItems: 'center',
		justifyContent: 'center'
	},
	appHeaderImage: {
		flex: 6
	},
	loadingIndicator: {
		flex: 1
	}
});

function mapStateToProps(state) {
	return {
		authenticated: state.session.authenticated,
		user: state.session.user,
		fetchingProfile: state.session.fetchingProfile,
		fetchingProfileError: state.session.fetchingProfileError,
		registeringUser: state.session.registeringUser
	};
}

function mapDispatchToProps(dispatch) {
	return {
		fetchProfile: () => dispatch(fetchProfile())
	};
}

export default connect(mapStateToProps, mapDispatchToProps)(SplashScreen);
