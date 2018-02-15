import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
	StyleSheet,
	View,
	ImageBackground,
} from 'react-native';

import Button from '../components/Button';
import Input from '../components/Input';

import { logInUser } from '../../actions/session';

class RegisterScreen extends Component {
	constructor(props) {
		super(props);

		this.state = {
			saving: false,
			valid: true
		};

		this.onChangeText = this.onChangeText.bind(this);
		this.onSignUp = this.onSignUp.bind(this);

		this._validations = new Map();
	}

	componentWillReceiveProps(nextProps) {
		/*if(nextProps.authenticated && nextProps.user !== null && !nextProps.authenticating) {
			this.props.navigation.navigate('drawerStack');
		}*/
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
			this.props.logInUser(this.state.email.toLowerCase(), this.state.password);
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
				<View style={styles.inputContainer}>
					<Input placeholder="First name" onChange={(text, valid) => this.onChangeText(text, valid, 'FirstName')}
								 validations={{required: true}} isSubmitted={saving} />
					<Input placeholder="Last name" onChange={(text, valid) => this.onChangeText(text, valid, 'LastName')}
								 validations={{required: true}} isSubmitted={saving} />
					<Input placeholder="Email address" onChange={(text, valid) => this.onChangeText(text, valid, 'Email')}
								 validations={{required: true}} isSubmitted={saving} />
					<Input placeholder="Password" onChange={(text, valid) => this.onChangeText(text, valid, 'Password')}
								 secureTextEntry={true} validations={{required: true}} isSubmitted={saving} />
					<Input placeholder="Confirm password" onChange={(text, valid) => this.onChangeText(text, valid, 'ConfirmPassword')}
								 secureTextEntry={true} validations={{required: true}} isSubmitted={saving} />
				</View>

				<View style={styles.actionContainer}>
					<Button text="SIGN UP" onPress={this.onSignUp} loading={authenticating} />
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
	inputContainer: {
		//flex: 1
	},
	actionContainer: {
		//flex: 1,
		marginTop: 20
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


export default connect(mapStateToProps, mapDispatchToProps)(RegisterScreen);
