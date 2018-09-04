import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
	StyleSheet,
	View,
	ImageBackground,
	Keyboard,
	KeyboardAvoidingView,
	SafeAreaView,
	TouchableWithoutFeedback,
	Platform
} from 'react-native';

import Button from '../components/Button';
import Input from '../components/Input';

import { register } from '../../actions/session';
import { handleException } from '../../actions/exceptions';

class RegisterScreen extends Component {
	constructor(props) {
		super(props);

		this.state = {
			saving: false,
			valid: true
		};

		this.onChangeText = this.onChangeText.bind(this);
		this.onSignUp = this.onSignUp.bind(this);
		this.setFocusAfterSubmitEditing = this.setFocusAfterSubmitEditing.bind(this);

		this._validations = new Map();
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

	onSignUp() {
		this.setState(() => ({
			saving: true
		}));

		if (this.state.valid) {
			const {
				Password,
				ConfirmPassword,
				FirstName,
				LastName,
				Email
			} = this.state;

			const {
				handleException,
				register
			} = this.props;

			if(Password && ConfirmPassword && Password.trim() !== ConfirmPassword.trim()) {
				handleException('error', 'Passwords don\'t match');
			} else if(register) {
				let newUser = {
					FirstName,
					LastName,
					Email,
					_password: Password
				};

				register(newUser);
			}
		}
	}

	setFocusAfterSubmitEditing(refName) {
		this[refName] && this[refName].txtInput && this[refName].txtInput.focus();
	}

	render() {
		const {
			navigation: {
				goBack
			},
			registeringUser
		} = this.props;

		const {
			saving
		} = this.state;

		return (
			<ImageBackground source={require('../../../assets/register.png')} style={styles.backgroundImage}>
				<SafeAreaView style={styles.container}>
					<KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : null} enabled style={styles.container}>
						<TouchableWithoutFeedback style={styles.container} onPress={() => Keyboard.dismiss()}>
							<View style={styles.container}>
								<View>
									<Input placeholder="First name" onChange={(text, valid) => this.onChangeText(text, valid, 'FirstName')}
										   validations={{required: true}} isSubmitted={saving} returnKeyType="next"
										   iconName={'ios-person'} iconType={'ionicon'} withIcon={true}
										   onSubmitEditing={() => this.setFocusAfterSubmitEditing('lastNameInput')} />

									<Input placeholder="Last name" onChange={(text, valid) => this.onChangeText(text, valid, 'LastName')}
										   validations={{required: true}} isSubmitted={saving} returnKeyType="next"
										   iconName={'ios-person'} iconType={'ionicon'} withIcon={true}
										   ref={(input) => this.lastNameInput = input}
										   onSubmitEditing={() => this.setFocusAfterSubmitEditing('emailInput')} />

									<Input placeholder="Email address" onChange={(text, valid) => this.onChangeText(text, valid, 'Email')}
										   validations={{required: true, format: 'email'}} isSubmitted={saving}
										   autoCapitalize="none" keyboardType="email-address" returnKeyType="next"
										   iconName={'ios-mail'} iconType={'ionicon'} withIcon={true}
										   ref={(input) => this.emailInput = input}
										   onSubmitEditing={() => this.setFocusAfterSubmitEditing('pwdInput')} />

									<Input placeholder="Password" onChange={(text, valid) => this.onChangeText(text, valid, 'Password')}
										   secureTextEntry={true} validations={{required: true}} isSubmitted={saving} returnKeyType="next"
										   iconName={'ios-lock'} iconType={'ionicon'} withIcon={true}
										   ref={(input) => this.pwdInput = input}
										   onSubmitEditing={() => this.setFocusAfterSubmitEditing('pwdConfirmInput')} />

									<Input placeholder="Confirm password" onChange={(text, valid) => this.onChangeText(text, valid, 'ConfirmPassword')}
										   secureTextEntry={true} validations={{required: true}} isSubmitted={saving} returnKeyType="go"
										   iconName={'ios-checkmark'} iconType={'ionicon'} withIcon={true}
										   onSubmitEditing={() => this.onSignUp()} ref={(input) => this.pwdConfirmInput = input} />
								</View>

								<View style={styles.actionContainer}>
									<Button text="SIGN UP" onPress={this.onSignUp} loading={registeringUser} />
									<Button text="BACK" onPress={() => goBack()} inverted={true} noMarginTop={true} />
								</View>
							</View>
						</TouchableWithoutFeedback>
					</KeyboardAvoidingView>
				</SafeAreaView>
			</ImageBackground>
		);
	}
}


const styles = StyleSheet.create({
	backgroundImage: {
		flex: 1,
		alignItems: 'stretch',
		flexDirection: 'column',
		justifyContent: 'center'
	},
	container: {
		flex: 1,
		flexDirection: 'column',
		justifyContent: 'center'
	},
	actionContainer: {
		marginTop: 20
	}
});

function mapStateToProps(state) {
	return {
		registeringUser: state.session.registeringUser,
		authenticated: state.session.authenticated,
		user: state.session.user
	};
}

function mapDispatchToProps(dispatch) {
	return {
		register: (newUser) => dispatch(register(newUser)),
		handleException: (type, message) => dispatch(handleException(type, message))
	};
}


export default connect(mapStateToProps, mapDispatchToProps)(RegisterScreen);
