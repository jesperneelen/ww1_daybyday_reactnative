import { createStore, applyMiddleware } from 'redux';
import reducers from '../reducers';
import thunk from 'redux-thunk';
import logger from 'redux-logger';

import {
	createReduxBoundAddListener,
	createReactNavigationReduxMiddleware,
} from 'react-navigation-redux-helpers';

// Note: createReactNavigationReduxMiddleware must be run before createReduxBoundAddListener
const middleware = createReactNavigationReduxMiddleware(
	'root',
	state => state.navigation,
);

export const addListener = createReduxBoundAddListener('root');

export const store = createStore(
	reducers,
	applyMiddleware(thunk),
	//applyMiddleware(thunk, logger),
	applyMiddleware(middleware)
);
