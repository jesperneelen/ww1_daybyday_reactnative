import { combineReducers } from 'redux';
import { exceptions } from './exceptions';
import { session } from './session';

const reducers = combineReducers({
	exceptions,
	session
});

export default reducers;
