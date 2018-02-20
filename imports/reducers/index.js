import { combineReducers } from 'redux';
import { exceptions } from './exceptions';
import { session } from './session';
import { events } from './events';

const reducers = combineReducers({
	exceptions,
	session,
	events
});

export default reducers;
