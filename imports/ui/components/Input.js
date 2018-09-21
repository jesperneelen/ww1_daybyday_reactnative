import React, { Component } from 'react';
import validator from 'validator';
import { Icon } from 'react-native-elements';

import {
	TextInput,
	StyleSheet,
	View
} from 'react-native';

import { normalize } from '../utils/responsive-ui';

export default class Input extends Component {
	constructor(props) {
		super(props);

		this.onBlur = this.onBlur.bind(this);
		this.onFocus = this.onFocus.bind(this);
		this.onChange = this.onChange.bind(this);

		this.state = {
			focused: props.autoFocus ? props.autoFocus : false,
			valid: true
		};
	}

	componentDidMount() {
		this.onChange(this.props.defaultValue ? this.props.defaultValue : this.props.value, true);
	}

	static getDerivedStateFromProps(nextProps, prevState) {
		if(nextProps.isSubmitted && !prevState.valid) {
			return {
				styleOnError: styles.input_error
			};
		}

		return null;
	}

	/*componentWillReceiveProps(nextProps) {
		if(this.props.isSubmitted !== nextProps.isSubmitted && !this.state.valid) {
			this.setState(() => ({
				styleOnError: styles.input_error
			}));
		}
	}*/

	validate(value) {
		const valid = this.runValidation(value);

		if(valid !== this.state.valid) {
			this.setState((prevState) => ({
				valid: !prevState.valid,
				styleOnError: valid ? null : prevState.styleOnError
			}));
		}

		return valid;
	}

	runValidation(value) {
		let valid = true;
		const validations = this.props.validations;

		if(validations && Object.keys(validations).length > 0) {
			if(validations.required && (!value || value === null || validator.isEmpty(value))) {
				valid = false;
			}

			if(validations.format && valid) {
				switch(validations.format) {
					case 'email':
						if(!validator.isEmail(value)) valid = false; break;
				}
			}
		}

		return valid;
	}

	onChange(value, firstRender=false) {
		let valid = this.validate(value);
		if(this.props.onChange) this.props.onChange(value, valid, firstRender);
	}

	onFocus() {
		this.setState((prevState) => ({
			focused: !prevState.focused,
			styleOnFocus: styles.input_focused
		}));
	}

	onBlur() {
		this.setState((prevState) => ({
			focused: !prevState.focused,
			styleOnFocus: null
		}));
	}

	render() {
		const {
			placeholder,
			autoFocus,
			editable,
			keyboardType,
			returnKeyType,
			secureTextEntry,
			value,
			defaultValue,
			noMarginTop,
			extraStyle,
			withIcon,
			iconType,
			iconName,
			autoCapitalize,
			onSubmitEditing
		} = this.props;

		const {
			styleOnFocus,
			styleOnError
		} = this.state;

		if(withIcon) {
			return (
				<View style={[styles.InputWithIcon, styleOnFocus, styleOnError]}>
					<Icon type={iconType} name={iconName} color={'white'} size={27} />

					<TextInput ref={(txtInput) => this.txtInput = txtInput}
							   style={[styles.input, {borderBottomWidth: 0, flex: 1, ...extraStyle}]}
							   placeholder={placeholder ? placeholder : 'Enter text here ...'}
							   autoFocus={autoFocus} editable={editable} returnKeyType={returnKeyType}
							   keyboardType={keyboardType} secureTextEntry={secureTextEntry} autoCapitalize={autoCapitalize}
							   value={value} defaultValue={defaultValue} placeholderTextColor={'#FFF'}
							   onChangeText={this.onChange} onFocus={this.onFocus} onBlur={this.onBlur}
							   onSubmitEditing={onSubmitEditing} underlineColorAndroid={'transparent'} />
				</View>
			);
		}

		return (
			<TextInput style={[styles.input, styleOnFocus, styleOnError, {marginTop: noMarginTop ? 0 : 10, paddingRight: 10, ...extraStyle}]}
					   placeholder={placeholder ? placeholder : 'Enter text here ...'}
					   autoFocus={autoFocus} editable={editable} keyboardType={keyboardType} secureTextEntry={secureTextEntry}
					   value={value} defaultValue={defaultValue} placeholderTextColor={'#FFF'}
					   onChangeText={this.onChange} onFocus={this.onFocus} onBlur={this.onBlur} underlineColorAndroid={'transparent'} />
		);
	}
}

const styles = StyleSheet.create({
	InputWithIcon: {
		borderBottomWidth: 1,
		borderBottomColor: '#FFF',
		flexDirection: 'row',
		alignContent: 'center',
		paddingHorizontal: 10,
		marginTop: 13
	},
	input: {
		color: '#FFF',
		backgroundColor: 'transparent',
		height: 50,
		fontSize: normalize(16),
		paddingLeft: 10,
		alignSelf: 'stretch',
		borderBottomWidth: 1,
		borderBottomColor: '#FFF'
	},
	input_focused: {
		borderBottomWidth: 1,
		borderBottomColor: 'rgb(119, 121, 61)'
	},
	input_error: {
		borderBottomWidth: 1,
		borderBottomColor: '#E62633'
	}
});
