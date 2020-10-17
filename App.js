import React from 'react'
import Login from './login.js'
import Home from './home.js'
import Username from './username.js'
import UserProfileView from './profile.js'
import Group from './group.js'
import Round from './round.js'
import Search from './search.js'
import firebase from 'firebase'
import { createStackNavigator } from 'react-navigation-stack' // 1.0.0-beta.27
import { createAppContainer } from 'react-navigation'
import Match from './match.js'
import Invite from './invite.js'

//  determining which landing page to show
var user = firebase.auth().currentUser
var start = ''

if (user === null) {
  start = 'Login'
} else {
  start = 'Home'
}

const RootStack = createStackNavigator(
  {
    Home: {
      screen: Home,
    },
    Login: {
      screen: Login,
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
    Round: {
      screen: Round,
    },
    Match: {
      screen: Match,
    },
    Search: {
      screen: Search,
    },
    Invite: {
      screen: Invite,
    }
  },
  {
    initialRouteName: start,
    headerMode: 'none',
  },
)
const AppContainer = createAppContainer(RootStack)
export default class App extends React.Component {
  render() {
    return <AppContainer />
  }
}
