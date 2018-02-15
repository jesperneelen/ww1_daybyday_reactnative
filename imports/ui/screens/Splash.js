import React, { Component } from 'react';
import { connect } from 'react-redux';
import { StyleSheet, Image, ImageBackground, ActivityIndicator } from 'react-native';
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
		} else if(!nextProps.fetchingProfileError && !nextProps.fetchingProfile && nextProps.authenticated && nextProps.user !== null) {
			setTimeout(() => {
				//Reset navigation, Splash screen was never here!
				nextProps.navigation.dispatch(NavigationActions.reset({
					index: 0,
					actions: [
						NavigationActions.navigate({routeName: 'drawerStack'})
					]
				}));
			}, 2000);
		}
	}

	render() {
		return (
			<ImageBackground source={require('../../../assets/wallpaper.jpg')} style={styles.backgroundImage}>
				<Image source={require('../../../assets/WO1_header.png')} style={styles.appHeaderImage} resizeMode="contain" />
				<ActivityIndicator style={styles.loadingIndicator} animating={true} size={'large'} />
			</ImageBackground>
		);
	}
}

const styles = StyleSheet.create({
	backgroundImage: {
		flex: 1,
		alignItems: 'center',
		flexDirection: 'column'
	},
	appHeaderImage: {
		flex: 1,
		alignSelf: 'stretch',
		height: undefined,
		width: undefined
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
		fetchingProfileError: state.session.fetchingProfileError
	};
}

function mapDispatchToProps(dispatch) {
	return {
		fetchProfile: () => dispatch(fetchProfile())
	};
}

export default connect(mapStateToProps, mapDispatchToProps)(SplashScreen);
