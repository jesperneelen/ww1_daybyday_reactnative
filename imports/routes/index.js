import { StackNavigator } from 'react-navigation';

//import DrawerMenu from '../ui/containers/Menu';

import Splash from '../ui/screens/Splash';
import Login from '../ui/screens/Login';
import Register from '../ui/screens/Register';
import Home from '../ui/screens/Home';

import MyFavourites from '../ui/screens/MyFavourites';
import FilteredEvents from '../ui/screens/FilteredEvents';

/*const DrawerNavigation = DrawerNavigator({
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
 });*/

const AuthenticatedStack = StackNavigator({
	myFavourites: { screen: MyFavourites },
	filteredEvents: { screen: FilteredEvents }
}, {
	headerMode: 'float'
});

const NotAuthenticatedStack = StackNavigator({
	login: { screen: Login },
	register: { screen: Register }
}, {
	headerMode: 'none'
});

const Routes = StackNavigator({
	splash: { screen: Splash },
	notAuthenticatedStack: { screen: NotAuthenticatedStack },
	home: { screen: Home },
	otherStack: { screen: AuthenticatedStack }
}, {
	headerMode: 'none',
	initialRouteName: 'splash'
});


export default Routes;
