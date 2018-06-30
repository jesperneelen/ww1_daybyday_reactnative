import { Dimensions, PixelRatio, Platform } from 'react-native';

const {
	width: SCREEN_WIDTH,
} = Dimensions.get('window');

// based on iPhone 5S's scale
const scale = SCREEN_WIDTH / 320;

export function normalize(size) {
	let newSize = PixelRatio.roundToNearestPixel(size) * scale;
	return Platform.OS === 'ios' ? Math.round(newSize) : Math.round(newSize) - 2;
}
