import React from 'react'
import { createAppContainer } from 'react-navigation'
import { createStackNavigator } from 'react-navigation-stack' // 1.0.0-beta.27
import firebase from 'firebase'
import Group from './group.js'
import Home from './home.js'
import Login from './login.js'
import Match from './match.js'
import RestaurantCard from './round.js'
import Username from './username.js'
import UserProfileView from './profile.js'

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
      screen: RestaurantCard
    },
    Match: {
      screen: Match
    },
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
