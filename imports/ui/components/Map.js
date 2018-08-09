import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
	View,
	StyleSheet,
	Text
} from 'react-native';

import MapView, { Marker }  from 'react-native-maps';
import ActionButton from 'react-native-action-button';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { NavigationActions } from 'react-navigation';

import OverviewEvents from './OverviewEvents';
import { logOutUser } from '../../actions/session';
import { adjustCurrentControl } from '../../actions/controls';
import { clearSessionNoAccount } from '../../actions/session';
import { customStyle } from '../shared/CustomMapStyle';
import { normalize } from '../utils/responsive-ui';

class Map extends Component {
	constructor(props) {
		super(props);

		this.state = {
			height: null,
			isFiltered: false
		};

		this.onLayout = this.onLayout.bind(this);
		this.onMarkerPress = this.onMarkerPress.bind(this);
		this.navigateToFavourites = this.navigateToFavourites.bind(this);
		this.onLogoutPress = this.onLogoutPress.bind(this);
		this.onLoginPress = this.onLoginPress.bind(this);
		this._renderMarkers = this._renderMarkers.bind(this);
	}

	shouldComponentUpdate(nextProps, nextState) {
		return this.state.height !== nextState.height
			|| this.state.isFiltered !== nextState.isFiltered
			|| this.props.lastUpdated < nextProps.lastUpdated;
	}

	componentDidUpdate() {
		const {
			extraMarkers,
			markers
		} = this.props;

		if(extraMarkers && extraMarkers.length && Array.isArray(extraMarkers)) {
			if(extraMarkers.length > 1) {
				let extraMarkerIDs = extraMarkers.reduce((acc, cur) => {
					acc.push(cur._id);
					return acc;
				}, []);

				this.mapView.fitToSuppliedMarkers(extraMarkerIDs, false);
			} else if(extraMarkers.length === 1) {
				this.mapView.animateToRegion({
					longitude: extraMarkers[0].longitude,
					longitudeDelta: 7,
					latitude: extraMarkers[0].latitude,
					latitudeDelta: 7
				});
			}

		} else if(markers && markers.length && Array.isArray(markers)) {
			if(markers.length > 1) {
				let markerIDs = markers.reduce((acc, cur) => {
					acc.push(cur._id);
					return acc;
				}, []);

				this.mapView.fitToSuppliedMarkers(markerIDs, false);
			} else if(markers.length === 1) {
				this.mapView.animateToRegion({
					longitude: markers[0].longitude,
					longitudeDelta: 7,
					latitude: markers[0].latitude,
					latitudeDelta: 7
				});
			}
		}
	}

	onMarkerPress(tagId, tagDisplayName) {
		const {
			navigation,
			adjustCurrentControl
		} = this.props;

		if(navigation && navigation.navigate && tagId && tagDisplayName && adjustCurrentControl) {
			adjustCurrentControl('stop');
			navigation.navigate('filteredEvents', {tagId, tagDisplayName});
		}
	}

	navigateToFavourites() {
		const {
			navigation,
			adjustCurrentControl
		} = this.props;

		if(navigation && navigation.navigate && adjustCurrentControl) {
			adjustCurrentControl('stop');
			navigation.navigate('myFavourites');
		}
	}

	onLogoutPress() {
		const {
			logout,
			adjustCurrentControl
		} = this.props;

		if(logout && adjustCurrentControl) {
			adjustCurrentControl('stop');
			logout();
		}
	}

	onLoginPress() {
		const resetAction = NavigationActions.reset({
			index: 0,
			key: null,
			actions: [
				NavigationActions.navigate({ routeName: 'notAuthenticatedStack' })
			]
		});

		this.props.clearSessionNoAccount();
		this.props.dispatchResetAction(resetAction);
	}

	onLayout(event) {
		let {
			height
		} = event.nativeEvent.layout;

		this.setState(() => ({
			height
		}));
	}

	_renderMarkers(markersToRender, pinColor) {
		return markersToRender.map(marker => {
			return (
				<Marker
					key={marker._id}
					title={marker.title}
					identifier={marker._id}
					trackViewChanges={false}
					pinColor={pinColor}
					coordinate={{
						latitude: marker.latitude,
						longitude: marker.longitude
					}}>
					<MapView.Callout onPress={() => this.onMarkerPress(marker._id, marker.title)}>
						<Text style={styles.calloutStyle}>{marker.title}</Text>
					</MapView.Callout>
				</Marker>
			);
		});
	}

	render() {
		const {
			markers,
			allEventMarkers,
			extraMarkers,
			initNoAccount
		} = this.props;

		const {
			isFiltered,
			height
		} = this.state;

		return (
			<View style={styles.mapContainer} onLayout={this.onLayout}>
				<MapView
					ref={(mapView) => this.mapView = mapView}
					provider="google"
					zoomEnabled={true}
					loadingEnabled={true}
					style={styles.map}
					customMapStyle={customStyle}
				>
					{
						markers && Array.isArray(markers) ?
							this._renderMarkers(markers, '#1CB417')
							: null
					}

					{
						!isFiltered && allEventMarkers && allEventMarkers.length > 0 && Array.isArray(allEventMarkers) ?
							this._renderMarkers(allEventMarkers, '#9A5449')
							: null
					}

					{
						extraMarkers && extraMarkers.length > 0 && Array.isArray(extraMarkers) ?
							this._renderMarkers(extraMarkers, '#636755')
							: null
					}
				</MapView>

				<ActionButton spacing={5} offsetY={12} offsetX={12} activeOpacity={.6} outRangeScale={1.4}
							  buttonColor={'#839A42'} position={'left'} verticalOrientation={'down'} degrees={180}
							  renderIcon={() => (<Icon name="dots-vertical" style={styles.actionButtonIcon} />)}>
					<ActionButton.Item buttonColor="#433781" title="My Favourites" onPress={() => this.navigateToFavourites()}>
						<Icon name="star" style={styles.actionButtonIcon} />
					</ActionButton.Item>
					<ActionButton.Item buttonColor={initNoAccount ? '#1CB417' : '#814137'} title={initNoAccount ? 'Sign In' : 'Sign Out'}
									   onPress={initNoAccount ? () => this.onLoginPress() : () => this.onLogoutPress()}>
						<Icon name={initNoAccount ? 'login-variant' : "logout-variant"} style={styles.actionButtonIcon} />
					</ActionButton.Item>
				</ActionButton>

				<ActionButton buttonColor={'rgb(68, 78, 41)'} position={'left'} offsetY={12} offsetX={12} activeOpacity={.6}
							  onPress={() => this.setState((prevState) => ({isFiltered: !prevState.isFiltered}))}
							  renderIcon={() => isFiltered ?
								  (<Icon name="filter-remove" style={styles.actionButtonIcon} /> )
								  : (<Icon name="filter" style={styles.actionButtonIcon} />)
							  } />

				<OverviewEvents componentHeight={height} />
			</View>
		);
	}
}

const styles = StyleSheet.create({
	mapContainer: {
		flex: 9,
		alignItems: 'stretch'
	},
	map: {
		flex: 1
	},
	actionButtonIcon: {
		fontSize: normalize(22),
		color: 'white'
	},
	calloutStyle: {
		fontSize: normalize(14),
		color: 'rgb(68, 78, 41)',
		alignSelf: 'center',
		fontWeight: '700',
		paddingVertical: 3,
		paddingHorizontal: 5
	}
});

function mapStateToProps(state) {
	return {
		markers: state.map.markers,
		allEventMarkers: state.map.allEventMarkers,
		extraMarkers: state.map.extraMarkers,
		lastUpdated: state.map.lastUpdated,
		initNoAccount: state.session.initNoAccount
	};
}

function mapDispatchToProps(dispatch) {
	return {
		logout: () => dispatch(logOutUser()),
		adjustCurrentControl: (ctrlType) => dispatch(adjustCurrentControl(ctrlType)),
		dispatchResetAction: (resetAction) => dispatch(resetAction),
		clearSessionNoAccount: () => dispatch(clearSessionNoAccount())
	};
}

export default connect(mapStateToProps, mapDispatchToProps)(Map);
