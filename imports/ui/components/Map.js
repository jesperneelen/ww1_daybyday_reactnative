import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
	View,
	StyleSheet
} from 'react-native';

import MapView, { Marker }  from 'react-native-maps';
import ActionButton from 'react-native-action-button';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import OverviewEvents from './OverviewEvents';
import { logOutUser } from '../../actions/session';
import { adjustCurrentControl } from '../../actions/controls';
import { customStyle } from '../shared/CustomMapStyle';

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
		this._renderMarkers = this._renderMarkers.bind(this);
	}

	componentDidUpdate() {
		const {
			extraMarkers,
			markers
		} = this.props;

		if(extraMarkers && extraMarkers.length > 0 && Array.isArray(extraMarkers)) {
			let extraMarkerIDs = extraMarkers.reduce((acc, cur) => {
				acc.push(cur._id);
				return acc;
			}, []);

			setTimeout(() => {
				this.mapView.fitToSuppliedMarkers(extraMarkerIDs, true);
			}, 10);
		} else if(markers && Array.isArray(markers)) {
			if(markers.length > 1) {
				let markerIDs = markers.reduce((acc, cur) => {
					acc.push(cur._id);
					return acc;
				}, []);

				//timeout for performance reasons
				setTimeout(() => {
					this.mapView.fitToSuppliedMarkers(markerIDs, true);
				}, 10);
			} else if(markers.length === 1 && Array.isArray(markers)) {
				this.mapView.animateToRegion({
					longitude: markers[0].longitude,
					longitudeDelta: 5,
					latitude: markers[0].latitude,
					latitudeDelta: 5
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
					}}
					onPress={() => this.onMarkerPress(marker._id, marker.title)}
					onCalloutPress={() => this.onMarkerPress(marker._id, marker.title)}
				/>
			);
		});
	}

	render() {
		const {
			markers,
			allEventMarkers,
			extraMarkers
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
					<ActionButton.Item buttonColor="#814137" title="Sign Out" onPress={() => this.onLogoutPress()}>
						<Icon name="logout-variant" style={styles.actionButtonIcon} />
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
		fontSize: 22,
		color: 'white'
	}
});

function mapStateToProps(state) {
	return {
		markers: state.map.markers,
		allEventMarkers: state.map.allEventMarkers,
		extraMarkers: state.map.extraMarkers
	};
}

function mapDispatchToProps(dispatch) {
	return {
		logout: () => dispatch(logOutUser()),
		adjustCurrentControl: (ctrlType) => dispatch(adjustCurrentControl(ctrlType))
	};
}

export default connect(mapStateToProps, mapDispatchToProps)(Map);
