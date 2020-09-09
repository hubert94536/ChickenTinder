// /**
//  * Sample React Native App
//  * https://github.com/facebook/react-native
//  *
//  * @format
//  * @flow strict-local
//  */

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

const RootStack = createStackNavigator(
  {
    Home: {
      screen: Home
    },
    Login: {
      screen: Login
    },
    Username: {
      screen: Username
    }
  },
  {
    initialRouteName: start,
    headerMode: 'none'
  }
)

const AppContainer = createAppContainer(RootStack)

export default class App extends React.Component {
  render () {
    return <AppContainer />
  }
}

// import React from 'react';
// import {Button, View, Text} from 'react-native';
// import Group from './group.js';

// export default class App extends React.Component {
//   render() {
//     return <Group />;
//   }
// }
