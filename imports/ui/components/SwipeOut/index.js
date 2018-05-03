import NativeButton from './NativeButton';
import styles from './styles';

import React, {
	Component,
} from 'react';

import {
	PanResponder,
	TouchableHighlight,
	StyleSheet,
	Text,
	View,
	ViewPropTypes,
} from 'react-native';

class SwipeOutBtn extends Component {

	/*propTypes: {
		backgroundColor: PropTypes.string,
		color: PropTypes.string,
		component: PropTypes.node,
		onPress: PropTypes.func,
		text: PropTypes.node,
		type: PropTypes.string,
		underlayColor: PropTypes.string,
	},*/

	render() {
		let btn = this.props;
		let styleSwipeoutBtn = [styles.swipeoutBtn];

		//  apply "type" styles (delete || primary || secondary)
		if (btn.type === 'delete') styleSwipeoutBtn.push(styles.colorDelete);
		else if (btn.type === 'primary') styleSwipeoutBtn.push(styles.colorPrimary);
		else if (btn.type === 'secondary') styleSwipeoutBtn.push(styles.colorSecondary);

		//  apply background color
		if (btn.backgroundColor) styleSwipeoutBtn.push([{ backgroundColor: btn.backgroundColor }]);

		styleSwipeoutBtn.push([{
			height: btn.height,
			width: btn.width,
		}]);

		let styleSwipeoutBtnComponent = [];

		//  set button dimensions
		styleSwipeoutBtnComponent.push([{
			height: btn.height,
			width: btn.width,
		}]);

		let styleSwipeoutBtnText = [styles.swipeoutBtnText];

		//  apply text color
		if (btn.color) styleSwipeoutBtnText.push([{ color: btn.color }]);

		return  (
			<NativeButton
				onPress={this.props.onPress}
				underlayColor={this.props.underlayColor}
				disabled={this.props.disabled}
				style={[styles.swipeoutBtnTouchable, styleSwipeoutBtn]}
				textStyle={styleSwipeoutBtnText}>
				{
					(btn.component ?
							<View style={styleSwipeoutBtnComponent}>{btn.component}</View>
							:
							btn.text
					)
				}
			</NativeButton>
		);
	}
}

SwipeOutBtn.defaultProps = {
	backgroundColor: null,
	color: null,
	component: null,
	underlayColor: null,
	height: 0,
	onPress: null,
	disabled: false,
	text: 'Click me',
	type: '',
	width: 0
};



class SwipeOut extends Component {
	/*propTypes: {
		autoClose: PropTypes.bool,
		backgroundColor: PropTypes.string,
		close: PropTypes.bool,
		left: PropTypes.array,
		onOpen: PropTypes.func,
		onClose: PropTypes.func,
		right: PropTypes.array,
		scroll: PropTypes.func,
		style: (ViewPropTypes || View.propTypes).style,
		sensitivity: PropTypes.number,
		buttonWidth: PropTypes.number,
		disabled: PropTypes.bool,
	}*/

	constructor(props) {
		super(props);

		this.state = {
			autoClose: props.autoClose || false,
			btnWidth: 0,
			btnsLeftWidth: 0,
			btnsRightWidth: 0,
			contentHeight: 0,
			contentPos: 0,
			contentWidth: 0,
			openedRight: false,
			swiping: false,
			tweenDuration: 160,
			timeStart: null,
		};

		this._onLayout = this._onLayout.bind(this);
		this._renderButton = this._renderButton.bind(this);
		this._renderButtons = this._renderButtons.bind(this);
		this._handlePanResponderEnd = this._handlePanResponderEnd.bind(this);
		this._handlePanResponderGrant = this._handlePanResponderGrant.bind(this);
		this._handlePanResponderMove = this._handlePanResponderMove.bind(this);
		this._rubberBandEasing = this._rubberBandEasing.bind(this);
		this._autoClose = this._autoClose.bind(this);
		this._open = this._open.bind(this);
		this._close = this._close.bind(this);
		this._callOnClose = this._callOnClose.bind(this);
		this._callOnOpen = this._callOnOpen.bind(this);
		this._openRight = this._openRight.bind(this);
		this._openLeft = this._openLeft.bind(this);
	}

	componentWillMount() {
		this._panResponder = PanResponder.create({
			onStartShouldSetPanResponder: (event, gestureState) => true,
			onStartShouldSetPanResponderCapture: (event, gestureState) => this.state.openedLeft || this.state.openedRight,
			onMoveShouldSetPanResponderCapture: (event, gestureState) => Math.abs(gestureState.dx) > this.props.sensitivity && Math.abs(gestureState.dy) <= this.props.sensitivity,
			onPanResponderGrant: this._handlePanResponderGrant,
			onPanResponderMove: this._handlePanResponderMove,
			onPanResponderRelease: this._handlePanResponderEnd,
			onPanResponderTerminate: this._handlePanResponderEnd,
			onShouldBlockNativeResponder: (event, gestureState) => false,
			onPanResponderTerminationRequest: () => false,
		});
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.close) this._close();
		if (nextProps.openRight) this._openRight();
		if (nextProps.openLeft) this._openLeft();
	}

	_handlePanResponderGrant(e, gestureState) {
		//console.log('_handlePanResponderGrant', e, gestureState);
		if (this.props.disabled) return;
		if (!this.state.openedLeft && !this.state.openedRight) {
			this._callOnOpen();
		} else {
			this._callOnClose();
		}
		this.refs.swipeoutContent.measure((ox, oy, width, height) => {
			let buttonWidth = this.props.buttonWidth || (width/5);
			this.setState({
				btnWidth: buttonWidth,
				btnsLeftWidth: this.props.left ? buttonWidth*this.props.left.length : 0,
				btnsRightWidth: this.props.right ? buttonWidth*this.props.right.length : 0,
				swiping: true,
				timeStart: (new Date()).getTime(),
			});
		});
	}

	_handlePanResponderMove(e, gestureState) {
		//console.log('_handlePanResponderMove', e, gestureState);
		if (this.props.disabled) return;
		let posX = gestureState.dx;
		let posY = gestureState.dy;
		let leftWidth = this.state.btnsLeftWidth;
		let rightWidth = this.state.btnsRightWidth;

		if(this.state.openedRight) {
			posX = gestureState.dx - rightWidth;
		} else if (this.state.openedLeft) {
			posX = gestureState.dx + leftWidth;
		}

		//  prevent scroll if moveX is true
		let moveX = Math.abs(posX) > Math.abs(posY);
		if (this.props.scroll) {
			if (moveX) this.props.scroll(false);
			else this.props.scroll(true);
		}
		if (this.state.swiping) {
			//  move content to reveal swipeout
			if (posX < 0 && this.props.right) {
				this.setState({ contentPos: Math.min(posX, 0) })
			} else if (posX > 0 && this.props.left) {
				this.setState({ contentPos: Math.max(posX, 0) })
			}
		}
	}

	_handlePanResponderEnd(e, gestureState) {
		//console.log('_handlePanResponderEnd', e, gestureState);
		if (this.props.disabled) return;
		let posX = gestureState.dx;
		let contentPos = this.state.contentPos;
		let contentWidth = this.state.contentWidth;
		let btnsLeftWidth = this.state.btnsLeftWidth;
		let btnsRightWidth = this.state.btnsRightWidth;

		//  minimum threshold to open swipeout
		let openX = contentWidth*0.33;

		//  should open swipeout
		let openLeft = posX > openX || posX > btnsLeftWidth/2;
		let openRight = posX < -openX || posX < -btnsRightWidth/2;

		//  account for open swipeouts
		if (this.state.openedRight) openRight = posX-openX < -openX;
		if (this.state.openedLeft) openLeft = posX+openX > openX;

		//  reveal swipeout on quick swipe
		let timeDiff = (new Date()).getTime() - this.state.timeStart < 200;
		if (timeDiff) {
			openRight = posX < -openX/10 && !this.state.openedLeft;
			openLeft = posX > openX/10 && !this.state.openedRight;
		}

		if (this.state.swiping) {
			if (openRight && contentPos < 0 && posX < 0) {
				this._open(-btnsRightWidth, 'right');
			} else if (openLeft && contentPos > 0 && posX > 0) {
				this._open(btnsLeftWidth, 'left');
			} else {
				this._close();
			}
		}

		//  Allow scroll
		if (this.props.scroll) this.props.scroll(true);
	}

	/*_tweenContent(state, endValue) {
		this.tweenState(state, {
			easing: tweenState.easingTypes.easeInOutQuad,
			duration: endValue === 0 ? this.state.tweenDuration*1.5 : this.state.tweenDuration,
			endValue: endValue,
		});
	}*/

	_rubberBandEasing(value, limit) {
		if (value < 0 && value < limit) return limit - Math.pow(limit - value, 0.85);
		else if (value > 0 && value > limit) return limit + Math.pow(value - limit, 0.85);
		return value;
	}

	//  close swipeout on button press
	_autoClose(btn) {
		if (this.state.autoClose) this._close();
		let onPress = btn.onPress;
		if (onPress) onPress();
	}

	_open(contentPos, direction) {
		const left = direction === 'left';
		const { sectionID, rowID, onOpen } = this.props;
		onOpen && onOpen(sectionID, rowID, direction);
		//this._tweenContent('contentPos', contentPos);
		this.setState({
			contentPos,
			openedLeft: left,
			openedRight: !left,
			swiping: false,
		});
	}

	_close() {
		const { sectionID, rowID, onClose } = this.props;
		if (onClose && (this.state.openedLeft || this.state.openedRight)) {
			const direction = this.state.openedRight ? 'right' : 'left';
			onClose(sectionID, rowID, direction);
		}
		//this._tweenContent('contentPos', 0);
		this._callOnClose();
		this.setState({
			openedRight: false,
			openedLeft: false,
			swiping: false,
		});
	}

	_callOnClose() {
		if (this.props.onClose) this.props.onClose(this.props.sectionID, this.props.rowID);
	}

	_callOnOpen() {
		if (this.props.onOpen) this.props.onOpen(this.props.sectionID, this.props.rowID);
	}

	_openRight() {
		this.refs.swipeoutContent.measure((ox, oy, width, height) => {
			let btnWidth = this.props.buttonWidth || (width/5);

			this.setState({
				btnWidth,
				btnsRightWidth: this.props.right ? btnWidth*this.props.right.length : 0,
			}, () => {
				//this._tweenContent('contentPos', -this.state.btnsRightWidth);
				this._callOnOpen();
				this.setState({
					contentPos: -this.state.btnsRightWidth,
					openedLeft: false,
					openedRight: true,
					swiping: false
				});
			});
		});
	}

	_openLeft() {
		this.refs.swipeoutContent.measure((ox, oy, width, height) => {
			let btnWidth = this.props.buttonWidth || (width/5);

			this.setState({
				btnWidth,
				btnsLeftWidth: this.props.left ? btnWidth*this.props.left.length : 0,
			}, () => {
				//this._tweenContent('contentPos', this.state.btnsLeftWidth);
				this._callOnOpen();
				this.setState({
					contentPos: this.state.btnsLeftWidth,
					openedLeft: true,
					openedRight: false,
					swiping: false
				});
			});
		});
	}

	render() {
		let contentWidth = this.state.contentWidth;
		//let posX = this.tweenState.getTweeningValue('contentPos');
		let posX = this.state.contentPos;

		let styleSwipeout = [styles.swipeout, this.props.style];
		if (this.props.backgroundColor) {
			styleSwipeout.push([{ backgroundColor: this.props.backgroundColor }]);
		}

		let limit = -this.state.btnsRightWidth;
		if (posX > 0) limit = this.state.btnsLeftWidth;

		let styleLeftPos = {
			left: {
				left: 0,
				overflow: 'hidden',
				width: Math.min(limit*(posX/limit), limit),
			},
		};

		let styleRightPos = {
			right: {
				left: Math.abs(contentWidth + Math.max(limit, posX)),
				right: 0,
			},
		};

		console.log('-----------');
		console.log(Math.abs(contentWidth + limit));

		let styleContentPos = {
			content: {
				left: this._rubberBandEasing(posX, limit),
			},
		};

		let styleContent = [styles.swipeoutContent];
		styleContent.push(styleContentPos.content);

		let styleRight = [styles.swipeoutBtns];
		styleRight.push(styleRightPos.right);

		let styleLeft = [styles.swipeoutBtns];
		styleLeft.push(styleLeftPos.left);

		let isRightVisible = posX < 0;
		let isLeftVisible = posX > 0;

		return (
			<View style={styleSwipeout}>
				<View
					ref="swipeoutContent"
					style={styleContent}
					onLayout={this._onLayout}
					{...this._panResponder.panHandlers}
				>
					{this.props.children}
				</View>
				{ this._renderButtons(this.props.right, isRightVisible, styleRight) }
				{ this._renderButtons(this.props.left, isLeftVisible, styleLeft) }
			</View>
		);
	}

	_onLayout(event) {
		let { width, height } = event.nativeEvent.layout;
		this.setState({
			contentWidth: width,
			contentHeight: height,
		});
	}

	_renderButtons(buttons, isVisible, style) {
		if (buttons && isVisible) {
			return (
				<View style={style}>
					{ buttons.map(this._renderButton) }
				</View>
			);
		} else {
			return (
				<View/>
			);
		}
	}

	_renderButton(btn, i) {
		return (
			<SwipeOutBtn
				backgroundColor={btn.backgroundColor}
				color={btn.color}
				component={btn.component}
				disabled={btn.disabled}
				height={this.state.contentHeight}
				key={i}
				onPress={() => this._autoClose(btn)}
				text={btn.text}
				type={btn.type}
				underlayColor={btn.underlayColor}
				width={this.state.btnWidth}
			/>
		);
	}
}

SwipeOut.defaultProps = {
	disabled: false,
	rowID: -1,
	sectionID: -1,
	sensitivity: 50
};

SwipeOut.NativeButton = NativeButton;
SwipeOut.SwipeoutButton = SwipeOutBtn;

export default SwipeOut;
