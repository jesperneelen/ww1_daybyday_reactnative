import { combineReducers } from 'redux';
import { exceptions } from './exceptions';
import { session } from './session';
import { events } from './events';
import { controls } from './controls';
import { map } from './map';
import { navigation } from './navigation';

const reducers = combineReducers({
	exceptions,
	session,
	events,
	controls,
	map,
	navigation
});

export default reducers;
