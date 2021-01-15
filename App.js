/* eslint-disable no-unused-vars */
import React from 'react'
import { Text } from 'react-native'
import { createAppContainer } from 'react-navigation'
import { createStackNavigator } from 'react-navigation-stack' // 1.0.0-beta.27
import firebase from 'firebase'
import CreateAccount from './frontend/screens/CreateAccount.js'
import Group from './frontend/screens/Group.js'
import Home from './frontend/screens/Home.js'
import Loading from './frontend/screens/Loading.js'
import Login from './frontend/screens/Login.js'
import Match from './frontend/screens/Match.js'
import Notifications from './frontend/screens/Notifications.js'
import PhoneAuthScreen from './frontend/screens/PhoneAuth.js'
import Round from './frontend/screens/Round.js'
import Search from './frontend/screens/Search.js'
import socket from './frontend/apis/socket.js'
import TopThree from './frontend/screens/TopThree.js'
import UserProfileView from './frontend/screens/Profile.js'

export default class App extends React.Component {
  constructor() {
    super()
    this.state = {
      // can change to our loading screen
      appContainer: <Text />,
    }
  }

  componentDidMount() {
    var start
    var unsubscribe = firebase.auth().onAuthStateChanged(async (user) => {
      if (user === null) {
        start = 'Login'
      } else {
        socket.connect()
        start = 'Home'
      }
      var RootStack = createStackNavigator(
        {
          Home: {
            screen: Home,
            navigationOptions: {
              animationEnabled: false,
            },
          },
          Login: {
            screen: Login,
          },
          Profile: {
            screen: UserProfileView,
            navigationOptions: {
              animationEnabled: false,
            },
          },
          Group: {
            screen: Group,
          },
          Round: {
            screen: Round,
          },
          Match: {
            screen: Match,
          },
          Search: {
            screen: Search,
            navigationOptions: {
              animationEnabled: false,
            },
          },
          Phone: {
            screen: PhoneAuthScreen,
          },
          Notifications: {
            screen: Notifications,
            navigationOptions: {
              animationEnabled: false,
            },
          },
          Loading: {
            screen: Loading,
          },
          CreateAccount: {
            screen: CreateAccount,
          },
          TopThree: {
            screen: TopThree,
          },
        },
        {
          initialRouteName: start,
          headerMode: 'none',
          animationEnabled: false,
        },
      )
      unsubscribe()
      var AppContainer = createAppContainer(RootStack)
      this.setState({ appContainer: <AppContainer /> })
    })
  }

  render() {
    return this.state.appContainer
  }
}
