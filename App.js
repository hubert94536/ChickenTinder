// // // /**
// // //  * Sample React Native App
// // //  * https://github.com/facebook/react-native
// // //  *
// // //  * @format
// // //  * @flow strict-local
// // //  */

<<<<<<< HEAD
import React from 'react'
import { Button, View, Text } from 'react-native'
import Login from './login.js'
import Home from './home.js'
import Username from './username.js'
import { createStackNavigator } from 'react-navigation-stack' // 1.0.0-beta.27
import { createAppContainer } from 'react-navigation'
import sockets from './socket.js'

start = ''
if (global.uid === undefined) start = 'Login'
else start = 'Home'
=======
import React from 'react';
import Login from './login.js';
import Home from './home.js';
import Username from './username.js';
import UserProfileView from './profile.js';
import Group from './group.js';
import {createStackNavigator} from 'react-navigation-stack'; // 1.0.0-beta.27
import {createAppContainer} from 'react-navigation';
import AsyncStorage from '@react-native-community/async-storage';
import {UID} from 'react-native-dotenv';

AsyncStorage.getItem(UID).then(value => {
  if (value === null) start = 'Login';
  else start = 'Home';
});
var start = '';
>>>>>>> d683c0d0e5e358ce448a34862fbb554019c201c4

const RootStack = createStackNavigator(
  {
    Home: {
      screen: Home
    },
    Login: {
      screen: Login
    },
    Username: {
      screen: Username,
    },
    Profile: {
      screen: UserProfileView,
    },
    Group: {
      screen: Group,
    },
  },
  {
    initialRouteName: 'Login',
    headerMode: 'none',
  },
);

const AppContainer = createAppContainer(RootStack)

export default class App extends React.Component {
  render () {
    return <AppContainer />
  }
}

// import React from 'react';
// import {Button, View, Text} from 'react-native';
// import {facebookService} from './facebookService.js';
// import UserProfileView from './profile.js';

// export default class App extends React.Component {
//   render() {
//     return <UserProfileView />;
//   }
// }
