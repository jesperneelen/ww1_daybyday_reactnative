import { combineReducers } from 'redux';
import { exceptions } from './exceptions';
import { session } from './session';
import { events } from './events';
import { controls } from './controls';

const reducers = combineReducers({
	exceptions,
	session,
	events,
	controls
});

export default reducers;
