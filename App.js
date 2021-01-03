/* eslint-disable no-unused-vars */
import React from 'react'
import { Text, View } from 'react-native'
import { createStackNavigator } from 'react-navigation-stack' // 1.0.0-beta.27
import { createAppContainer } from 'react-navigation'
import firebase from 'firebase'
import Group from './frontend/screens/Group.js'
import Home from './frontend/screens/Home.js'
// import Invite from './frontend/modals/Invite.js'
import Login from './frontend/screens/Login.js'
import Match from './frontend/screens/Match.js'
import Notifications from './frontend/screens/Notifications.js'
import Round from './frontend/screens/Round.js'
import Search from './frontend/screens/Search.js'
import Username from './frontend/screens/Username.js'
import UserProfileView from './frontend/screens/Profile.js'
import PhoneAuthScreen from './frontend/screens/PhoneAuth.js'
import Loading from './frontend/screens/Loading.js'
import TabBar from './frontend/Nav.js'
import TopThree from './frontend/screens/TopThree.js'
import CreateAccount from './frontend/screens/CreateAccount.js'
import PropTypes from 'prop-types'

// class Notifications extends React.Component {
//   render() {
//     return (
//       <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
//         <Text>Notifications</Text>
//         <TabBar
//           goHome={() => this.props.navigation.navigate('Home')}
//           goSearch={() => this.props.navigation.navigate('Search')}
//           goNotifs={() => this.props.navigation.navigate('Notifications')}
//           goProfile={() => this.props.navigation.navigate('Profile')}
//           cur="Notifs"
//         />
//       </View>
//     )
//   }
// }

// Notifications.propTypes = {
//   navigation: PropTypes.object,
// }

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
        start = 'Login'
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
          initialRouteName: 'CreateAccount',
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


