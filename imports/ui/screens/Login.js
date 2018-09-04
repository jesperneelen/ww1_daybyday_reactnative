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
	Platform,
	SafeAreaView,
	KeyboardAvoidingView,
	Keyboard,
	TouchableWithoutFeedback,
	Dimensions
} from 'react-native';

import Button from '../components/Button';
import Input from '../components/Input';

import { logInUser, loginFbComplete, initNoAccount } from '../../actions/session';
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
		this.loginWithNoAccount = this.loginWithNoAccount.bind(this);

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

	/*static getDerivedStateFromProps(nextProps, prevState) {
		if(nextProps.authenticated && nextProps.user !== null && !nextProps.authenticating) {
			nextProps.navigation.navigate('AuthenticatedStack');
		}

		return null;
	}*/

	componentWillReceiveProps(nextProps) {
		if((nextProps.authenticated && nextProps.user !== null && !nextProps.authenticating) || (nextProps.initNoAccount && nextProps.authenticated)) {
			this.props.navigation.navigate('AuthenticatedStack');
		}
	}

	componentWillUnmount() {
		// Remove event listener
		Linking.removeEventListener('url', this.handleOpenURL);
	}

	loginWithFacebook() {
		//this.openURL('http://10.2.2.2:3002/v1/auth/facebook');
		//this.openURL('http://localhost:3002/v1/auth/facebook');
		this.openURL('https://ww1-admin-api.herokuapp.com/v1/auth/facebook');
		//this.openURL('http://192.168.0.211:3002/v1/auth/facebook');
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
			Linking.openURL(url).catch((error) => {
				console.log(error);
			});
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

	loginWithNoAccount() {
		const {
			loginWithNoAccount
		} = this.props;

		if(loginWithNoAccount) {
			loginWithNoAccount();
		}
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
				<SafeAreaView style={styles.container}>
					<KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : null} enabled style={styles.container}>
						<TouchableWithoutFeedback style={styles.container} onPress={() => Keyboard.dismiss()}>
							<View style={styles.container}>
								<Image source={require('../../../assets/WO1_header.png')} style={styles.appHeaderImage} resizeMode="contain" />

								<View style={styles.inputContainer}>
									<Input placeholder="Email address" onChange={(text, valid) => this.onChangeText(text, valid, 'email')}
										   validations={{required: true, format: 'email'}} isSubmitted={saving} keyboardType="email-address"
										   iconName={'ios-mail'} iconType={'ionicon'} withIcon={true} returnKeyType="next" autoCapitalize="none"
										   onSubmitEditing={() => this.pwdInput && this.pwdInput.txtInput && this.pwdInput.txtInput.focus()} />

									<Input ref={(pwdInput) => this.pwdInput = pwdInput}
										   placeholder="Password" onChange={(text, valid) => this.onChangeText(text, valid, 'password')}
										   secureTextEntry={true} validations={{required: true}} isSubmitted={saving}
										   iconName={'ios-lock'} iconType={'ionicon'} withIcon={true} returnKeyType="go"
										   onSubmitEditing={() => this.onLoginPressed()} />
								</View>

								<View style={styles.actionContainer}>
									<Button text="LOGIN" onPress={this.onLoginPressed} loading={authenticating} />
									<Button text="LOGIN WITH FACEBOOK" onPress={this.loginWithFacebook} fbButton={true} noMarginTop={true} />

									<TouchableOpacity onPress={() => navigate('register')} style={styles.signUpWrapper} activeOpacity={.5}>
										<Text style={styles.signUpText}>Don't have an account?</Text>
										<Text style={[styles.signUpText, styles.signUp]}>Sign up</Text>
									</TouchableOpacity>

									<TouchableOpacity onPress={this.loginWithNoAccount} style={styles.withoutAccountWrapper} activeOpacity={.5}>
										<Text style={styles.withoutAccountText}>
											Continue without account
										</Text>
									</TouchableOpacity>
								</View>
							</View>
						</TouchableWithoutFeedback>
					</KeyboardAvoidingView>
				</SafeAreaView>
			</ImageBackground>
		);
	}
}

const {height, width} = Dimensions.get('window');
const aspectRatio = height/width;


const styles = StyleSheet.create({
	backgroundImage: {
		flex: 1,
		alignItems: 'stretch',
		flexDirection: 'column'
	},
	appHeaderImage: {
		flex: aspectRatio < 1.6 ? 1 : 2,
		alignSelf: 'stretch',
		height: undefined,
		width: '98%',
		marginTop: 5
	},
	container: {
		flexGrow: 1,
		flexDirection: 'column',
	},
	inputContainer: {
		flex: 2,
		alignItems: 'center',
		justifyContent: 'center'
	},
	actionContainer: {
		flex: 2
	},
	signUpWrapper: {
		flexDirection: 'row',
		justifyContent: 'center',
		marginTop: 20
	},
	signUpText: {
		color: '#FFFFFF'
	},
	signUp: {
		marginLeft: 3,
		fontWeight: 'bold',
		color: 'rgb(119, 121, 61)'
	},
	withoutAccountWrapper: {
		flexDirection: 'row',
		justifyContent: 'center',
		marginTop: 5
	},
	withoutAccountText: {
		opacity: .8,
		color: '#FFFFFF'
	}
});

function mapStateToProps(state) {
	return {
		authenticating: state.session.authenticating,
		authenticated: state.session.authenticated,
		user: state.session.user,
		initNoAccount: state.session.initNoAccount
	};
}

function mapDispatchToProps(dispatch) {
	return {
		logInUser: (username, password) => dispatch(logInUser(username, password)),
		loginFbComplete: (fbUserId) => dispatch(loginFbComplete(fbUserId)),
		handleException: (type, message, errorObject) => dispatch(handleException(type, message, errorObject)),
		loginWithNoAccount: () => dispatch(initNoAccount())
	};
}

export default connect(mapStateToProps, mapDispatchToProps)(LoginScreen);
