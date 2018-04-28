import { StackNavigator } from 'react-navigation';
import React from 'react';

import Splash from '../ui/screens/Splash';
import Login from '../ui/screens/Login';
import Register from '../ui/screens/Register';
import Home from '../ui/screens/Home';
import MyFavourites from '../ui/screens/MyFavourites';
import FilteredEvents from '../ui/screens/FilteredEvents';
import Back from '../ui/components/Back';

const AuthenticatedStack = StackNavigator({
	home: {
		screen: Home,
		navigationOptions: {
			header: null
		}
	},
	myFavourites: {
		screen: MyFavourites,
		navigationOptions: ({navigation}) => ({
			title: 'My Favourites',
			headerLeft: (<Back />),
			headerTransparent: true,
			headerStyle: {
				backgroundColor: 'rgb(68, 78, 41)'
			},
			headerTitleStyle: {
				color: '#FFFFFF'
			}
		})
	},
	filteredEvents: {
		screen: FilteredEvents,
		navigationOptions: ({navigation}) => ({
			title: 'Filtered Events',
			headerLeft: (<Back />),
			headerTransparent: true,
			headerStyle: {
				backgroundColor: 'rgb(68, 78, 41)'
			},
			headerTitleStyle: {
				color: '#FFFFFF'
			}
		})
	}
}, {
	headerMode: 'screen'
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
	AuthenticatedStack: {
		screen: AuthenticatedStack
	}
}, {
	headerMode: 'none',
	initialRouteName: 'splash'
});


export default Routes;
