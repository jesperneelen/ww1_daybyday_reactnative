import App  from '../routes';
import { NavigationActions } from 'react-navigation'

const initialAction = { type: NavigationActions.INIT };
const initialState = App.router.getStateForAction(initialAction);

export function navigation (state = initialState, action) {
	return App.router.getStateForAction(action, state)
}
