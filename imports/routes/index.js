import { StackNavigator, DrawerNavigator } from 'react-navigation';

import DrawerMenu from '../ui/containers/Menu';

import Splash from '../ui/screens/Splash';
import Login from '../ui/screens/Login';
import Register from '../ui/screens/Register';
import Screen1 from '../ui/screens/Screen1';
import Screen2 from '../ui/screens/Screen2';

const DrawerNavigation = DrawerNavigator({
	Screen1: { screen: Screen1 },
	Screen2: { screen: Screen2 }
}, {
	contentComponent: DrawerMenu,
	drawerWidth: 200
});

const DrawerStack = StackNavigator({
	DrawerStack: { screen: DrawerNavigation }
}, {
	headerMode: 'screen',
	navigationOptions: ({navigation}) => ({
		headerStyle: { backgroundColor: 'rgb(68, 78, 41)' },
		title: ''
	})
});

const NotAuthenticatedStack = StackNavigator({
	login: { screen: Login },
	register: { screen: Register }
}, {
	headerMode: 'none'
});

const Routes = StackNavigator({
	splash: {screen: Splash},
	notAuthenticatedStack: { screen: NotAuthenticatedStack },
	drawerStack: { screen: Screen1 }
}, {
	headerMode: 'none',
	initialRouteName: 'splash'
});


export default Routes;
