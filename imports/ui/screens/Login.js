import React, { Component } from 'react';
import { connect } from 'react-redux';
import SafariView from 'react-native-safari-view';
import {
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
	ImageBackground,
	Image,
	Linking,
	Platform
} from 'react-native';

import Button from '../components/Button';
import Input from '../components/Input';

import { logInUser, loginFbComplete } from '../../actions/session';
import { handleException } from '../../actions/exceptions';

class LoginScreen extends Component {
	constructor(props) {
		super(props);

		this.state = {
			saving: false,
			valid: true
		};

		this.onChangeText = this.onChangeText.bind(this);
		this.onLoginPressed = this.onLoginPressed.bind(this);
		this.loginWithFacebook = this.loginWithFacebook.bind(this);
		this.openURL = this.openURL.bind(this);
		this.handleOpenURL = this.handleOpenURL.bind(this);

		this._validations = new Map();
	}

	// Set up Linking
	componentDidMount() {
		// Add event listener to handle OAuthLogin:// URLs
		Linking.addEventListener('url', this.handleOpenURL);
		// Launched from an external URL
		Linking.getInitialURL().then((url) => {
			if (url) {
				this.handleOpenURL({ url });
			}
		});
	}

	componentWillReceiveProps(nextProps) {
		if(nextProps.authenticated && nextProps.user !== null && !nextProps.authenticating) {
			this.props.navigation.navigate('drawerStack');
		}
	}

	componentWillUnmount() {
		// Remove event listener
		Linking.removeEventListener('url', this.handleOpenURL);
	}

	loginWithFacebook() {
		this.openURL('http://localhost:3002/v1/auth/facebook');
	}

	// Open URL in a browser
	openURL(url) {
		// Use SafariView on iOS
		if (Platform.OS === 'ios') {
			SafariView.show({
				url: url,
				fromBottom: true
			});
		}
		// Or Linking.openURL on Android
		else {
			Linking.openURL(url);
		}
	}

	handleOpenURL({ url }) {
		const [, user_string] = url.match(/user=([^#]+)/);
		let result = JSON.parse(decodeURI(user_string));

		if(result.success) {
			this.props.loginFbComplete(result.user._id);
		} else if(!result.success && result.message && !result.user){
			this.props.handleException('error', result.message);
		}

		if (Platform.OS === 'ios') {
			SafariView.dismiss();
		}
	}

	onChangeText(text, valid, key) {
		let validForm = this.validateForm(key, valid);

		this.setState(() => {
			return {
				valid: validForm,
				[key]: text
			}
		});
	}

	validateForm(key, valid) {
		if(this._validations.has(key) && valid) this._validations.delete(key);
		if(!this._validations.has(key) && !valid) this._validations.set(key, valid);

		return this._validations.size === 0;
	}

	onLoginPressed() {
		this.setState(() => ({
			saving: true
		}));

		if (this.state.valid) {
			this.props.logInUser(this.state.email.toLowerCase(), this.state.password);
		}

		//OneSignal.sendTag('userId', responseData._id);
	}

	render() {
		const {
			navigation: {
				navigate
			},
			authenticating
		} = this.props;

		const {
			saving
		} = this.state;

		return (
			<ImageBackground source={require('../../../assets/login.png')} style={styles.backgroundImage}>
				<Image source={require('../../../assets/WO1_header.png')} style={styles.appHeaderImage} resizeMode="contain" />

				<View style={styles.inputContainer}>
					<Input placeholder="Email address" onChange={(text, valid) => this.onChangeText(text, valid, 'email')}
								 validations={{required: true, format: 'email'}} isSubmitted={saving} />
					<Input placeholder="Password" onChange={(text, valid) => this.onChangeText(text, valid, 'password')}
								 secureTextEntry={true} validations={{required: true}} isSubmitted={saving} />
				</View>

				<View style={styles.actionContainer}>
					<Button text="LOGIN" onPress={this.onLoginPressed} loading={authenticating} />
					<Button text="LOGIN WITH FACEBOOK" onPress={this.loginWithFacebook} fbButton={true} noMarginTop={true} />

					<TouchableOpacity onPress={() => navigate('register')} style={styles.signUpWrapper} activeOpacity={.5}>
						<Text style={styles.signUpText}>Don't have an account?</Text><Text style={[styles.signUpText, styles.signUp]}>Sign up</Text>
					</TouchableOpacity>
				</View>
			</ImageBackground>
		);
	}
}


const styles = StyleSheet.create({
	backgroundImage: {
		flex: 1,
		alignItems: 'stretch',
		flexDirection: 'column'
	},
	appHeaderImage: {
		flex: 1,
		alignSelf: 'stretch',
		height: undefined,
		width: undefined
	},
	inputContainer: {
		flex: 1
	},
	actionContainer: {
		flex: 1,
		marginTop: 20
	},
	signUpWrapper: {
		flexDirection: 'row',
		justifyContent: 'center',
		marginTop: 20
	},
	signUpText: {
		color: '#FFF'
	},
	signUp: {
		marginLeft: 3,
		fontWeight: 'bold',
		color: 'rgb(119, 121, 61)'
	}
});

function mapStateToProps(state) {
	return {
		authenticating: state.session.authenticating,
		authenticated: state.session.authenticated,
		user: state.session.user
	};
}

function mapDispatchToProps(dispatch) {
	return {
		logInUser: (username, password) => dispatch(logInUser(username, password)),
		loginFbComplete: (fbUserId) => dispatch(loginFbComplete(fbUserId)),
		handleException: (type, message, errorObject) => dispatch(handleException(type, message, errorObject))
	};
}

export default connect(mapStateToProps, mapDispatchToProps)(LoginScreen);
