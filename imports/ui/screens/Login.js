import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
	ImageBackground,
	Image
} from 'react-native';

import Button from '../components/Button';
import Input from '../components/Input';

import { logInUser } from '../../actions/session';

class LoginScreen extends Component {
	constructor(props) {
		super(props);

		this.state = {
			saving: false,
			valid: true
		};

		this.onChangeText = this.onChangeText.bind(this);
		this.onLoginPressed = this.onLoginPressed.bind(this);
		this.onFbLoginPressed = this.onFbLoginPressed.bind(this);

		this._validations = new Map();
	}

	componentWillReceiveProps(nextProps) {
		if(nextProps.authenticated && nextProps.user !== null && !nextProps.authenticating) {
			this.props.navigation.navigate('drawerStack');
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

	onFbLoginPressed() {
		this.props.navigation.navigate('drawerStack');
	}

	onLoginPressed() {
		this.setState(() => ({
			saving: true
		}));

		if (this.state.valid) {
			this.props.logInUser(this.state.email.toLowerCase(), this.state.password);
		}

		//OneSignal.sendTag('userId', responseData._id);
		//AuthService.setAuthInfo(responseData, (result) => {
		//if(result.success) {
		//this.props.navigation.navigate('Map');
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
								 validations={{required: true}} isSubmitted={saving} />
					<Input placeholder="Password" onChange={(text, valid) => this.onChangeText(text, valid, 'password')}
								 secureTextEntry={true} validations={{required: true}} isSubmitted={saving} />
				</View>

				<View style={styles.actionContainer}>
					<Button text="LOGIN" onPress={this.onLoginPressed} loading={authenticating} />
					<Button text="LOGIN WITH FACEBOOK" onPress={this.onFbLoginPressed} fbButton={true} noMarginTop={true} />

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
		logInUser: (username, password) => dispatch(logInUser(username, password))
	};
}


export default connect(mapStateToProps, mapDispatchToProps)(LoginScreen);
