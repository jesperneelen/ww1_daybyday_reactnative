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

class Map extends Component {
	constructor(props) {
		super(props);

		this.state = {
			height: null,
			isFiltered: false
		};

		this.onLayout = this.onLayout.bind(this);
		this.onRegionChangeComplete = this.onRegionChangeComplete.bind(this);
	}

	componentDidUpdate() {
		if(this.props.markers && Array.isArray(this.props.markers)) {
			if(this.props.markers.length > 1) {
				let markerIDs = this.props.markers.reduce((acc, cur) => {
					acc.push(cur._id);
					return acc;
				}, []);

				this.mapView.fitToSuppliedMarkers(markerIDs, true);
			} else if(this.props.markers.length === 1) {
				this.mapView.animateToRegion({
					longitude: this.props.markers[0].longitude,
					longitudeDelta: 5,
					latitude: this.props.markers[0].latitude,
					latitudeDelta: 5
				});
			}
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

	onRegionChangeComplete(region) {
		this.setState(() => ({ region }));
	}

	render() {
		const {
			markers,
			allEventMarkers
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
				>
					{
						markers && Array.isArray(markers) ?
							markers.map((marker, idx) => {
								return (
									<Marker
										key={idx}
										title={marker.title}
										tracksViewChanges={false}
										identifier={marker._id}
										pinColor={'blue'}
										coordinate={{
											latitude: marker.latitude,
											longitude: marker.longitude
										}}
									/>
								)
							}) : null
					}

					{
						!isFiltered && allEventMarkers && allEventMarkers.length > 0 && Array.isArray(allEventMarkers) ?
							allEventMarkers.map((marker, idx) => {
								return (
									<Marker
										key={idx}
										title={marker.title}
										tracksViewChanges={false}
										identifier={marker._id}
										coordinate={{
											latitude: marker.latitude,
											longitude: marker.longitude
										}}
									/>
								)
							}) : null
					}
				</MapView>

				<ActionButton buttonColor={'rgb(68, 78, 41)'} position={'left'}
											spacing={5} offsetY={12} offsetX={12} activeOpacity={.6}
											renderIcon={() => isFiltered ?
												(<Icon name="filter-remove" style={styles.actionButtonIcon} /> )
												: (<Icon name="filter" style={styles.actionButtonIcon} />)
											}
											onPress={() => this.setState((prevState) => ({isFiltered: !prevState.isFiltered}))} />

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
	},
});

function mapStateToProps(state) {
	return {
		markers: state.map.markers,
		allEventMarkers: state.map.allEventMarkers
	};
}

export default connect(mapStateToProps, null)(Map);
