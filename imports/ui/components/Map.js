import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
	View,
	StyleSheet
} from 'react-native';

import MapView, { Marker }  from 'react-native-maps';
import OverviewEvents from './OverviewEvents';

class Map extends Component {
	constructor(props) {
		super(props);

		this.state = {
			height: null
		};

		this.onLayout = this.onLayout.bind(this);
		this.onRegionChangeComplete = this.onRegionChangeComplete.bind(this);
	}

	componentDidUpdate() {
		let markerIDs = this.props.markers.reduce((acc, cur) => {
			acc.push(cur._id);
			return acc;
		}, []);

		this.mapView.fitToSuppliedMarkers(markerIDs, true);
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
			region
		} = this.state;

		const {
			markers,
			allEventMarkers
		} = this.props;

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
						markers && markers.length > 0 && Array.isArray(markers) ?
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
						allEventMarkers && allEventMarkers.length > 0 && Array.isArray(allEventMarkers) ?
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

				<OverviewEvents componentHeight={this.state.height} />
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
	}
});

function mapStateToProps(state) {
	return {
		markers: state.map.markers,
		allEventMarkers: state.map.allEventMarkers
	};
}

export default connect(mapStateToProps, null)(Map);
