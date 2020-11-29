import React from 'react'
import { Text } from 'react-native'
import { createStackNavigator } from 'react-navigation-stack' // 1.0.0-beta.27
import { createAppContainer } from 'react-navigation'
import firebase from 'firebase'
import createAccount from './frontend/screens/createAccount.js'
import Group from './frontend/screens/group.js'
import Home from './frontend/screens/home.js'
import Invite from './frontend/modals/invite.js'
import Login from './frontend/screens/login.js'
import Match from './frontend/screens/match.js'
import Notif from './frontend/screens/notif.js'
import Round from './frontend/screens/round.js'
import Search from './frontend/screens/search.js'
import Username from './frontend/screens/username.js'
import UserProfileView from './frontend/screens/profile.js'
import PhoneAuthScreen from './frontend/screens/PhoneAuth.js'

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
    var unsubscribe = firebase.auth().onAuthStateChanged((user) => {
      if (user === null) {
        start = 'Match'
      } else {
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
          createAccount: {
            screen: createAccount,
          },
          Username: {
            screen: Username,
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
            screen: Notif,
            navigationOptions: {
              animationEnabled: false,
            },
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
