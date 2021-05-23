import PropTypes from 'prop-types'
import React from 'react'
import { Text, AppState } from 'react-native'
import { REGISTRATION_TOKEN } from 'react-native-dotenv'
import PushNotification from 'react-native-push-notification'
import { createAppContainer, NavigationActions } from 'react-navigation'
import { createStackNavigator } from 'react-navigation-stack' // 1.0.0-beta.27
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import AsyncStorage from '@react-native-async-storage/async-storage'
import auth from '@react-native-firebase/auth'
import CreateAccount from './frontend/screens/CreateAccount.js'
import {
  newNotif,
  setHost,
  updateSession,
  setMatch,
  setTop,
  showKick,
  showRefresh,
  hideRefresh,
} from './frontend/redux/Actions.js'
import global from './global.js'
import Disconnect from './frontend/screens/Disconnect.js'
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
import UserInfo from './frontend/screens/UserInfo.js'
import UserProfileView from './frontend/screens/Profile.js'

let validate = false

class App extends React.Component {
  constructor() {
    super()
    this.state = {
      // can change to our loading screen
      appContainer: <Text />,
      appState: AppState.currentState,
    }
    PushNotification.configure({
      onRegister: function (token) {
        console.log('Token: ' + JSON.stringify(token))
        AsyncStorage.setItem(REGISTRATION_TOKEN, token.token)
      },
      onNotification: this.onNotification,
      onAction: function (notification) {
        console.log('Notification: ' + JSON.stringify(notification))
        if (notification.action === 'open') PushNotification.invokeApp(notification) // figure this out later
      },
      popInitialNotification: true,
      requestPermissions: true,
    })
  }

  componentDidMount() {
    let start = 'Login'
    const unsubscribe = auth().onAuthStateChanged((user) => {
      unsubscribe()
      if (user && user.displayName) {
        this.setState({ appContainer: <UserInfo /> })
        start = 'Home'
        AppState.addEventListener('change', this._handleAppStateChange)
      }
      const RootStack = createStackNavigator(
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
          Disconnect: {
            screen: Disconnect,
          },
        },
        {
          initialRouteName: start,
          headerMode: 'none',
          animationEnabled: 'false',
        },
      )
      const AppContainer = createAppContainer(RootStack)
      this.setState({ appContainer: <AppContainer ref={(nav) => (this.navigator = nav)} /> })
      validate = true
    })
  }

  componentDidUpdate() {
    if (validate) {
      socket
        .getSocket()
        .off('disconnect')
        .on('disconnect', (reason) => {
          console.log('Disconnect: ' + reason)
          if (
            reason === 'transport close' ||
            reason === 'transport error' ||
            reason === 'ping timeout'
          ) {
            this.props.showRefresh()
            socket.connect()
          } else if (auth().currentUser) {
            this.props.hideRefresh()
            this.navigator &&
              this.navigator.dispatch(NavigationActions.navigate({ routeName: 'Disconnect' }))
          }
        })
      socket
        .getSocket()
        .off('reconnect')
        .on('reconnect', (session) => {
          console.log('reconnect')
          if (session) {
            // check if member was kicked
            if (!session.members[global.uid]) {
              socket.kickLeave()
              this.props.showKick()
              this.navigator &&
                this.navigator.dispatch(NavigationActions.navigate({ routeName: 'Home' }))
              this.props.hideRefresh()
              return
            }
            // update host and session props
            this.props.updateSession(session)
            this.props.setHost(session.host === global.uid)
            // check if session is still in a group
            if (!session.resInfo) {
              this.navigator &&
                this.navigator.dispatch(NavigationActions.navigate({ routeName: 'Group' }))
            }
            // check if session is in a match
            else if (session.match) {
              this.props.setMatch(session.resInfo.find((x) => x.id === session.match))
              this.navigator &&
                this.navigator.dispatch(NavigationActions.navigate({ routeName: 'Match' }))
            }
            // check if session is in top 3
            else if (session.top3) {
              let restaurants = session.resInfo.filter((x) => session.top3.choices.includes(x.id))
              restaurants.forEach(
                (x) => (x.likes = session.top3.likes[session.top3.choices.indexOf(x.id)]),
              )
              this.props.setTop(restaurants.reverse())
              this.navigator &&
                this.navigator.dispatch(NavigationActions.navigate({ routeName: 'TopThree' }))
            }
            // check if session is in round and if user is finished swiping => going to loading
            else if (session.finished.indexOf(global.uid) !== -1) {
              this.navigator &&
                this.navigator.dispatch(NavigationActions.navigate({ routeName: 'Loading' }))
            }
            // check if session is in round and still swiping
            else {
              this.navigator &&
                this.navigator.dispatch(NavigationActions.navigate({ routeName: 'Round' }))
            }
            this.props.hideRefresh()
          }
          // no session
          else {
            this.props.hideRefresh()
            this.navigator &&
              this.navigator.dispatch(NavigationActions.navigate({ routeName: 'Home' }))
          }
        })
    }
  }

  onNotification = (notification) => {
    this.props.newNotif()
    console.log('Notification: ' + notification)
    if (!notification.userInteraction) {
      //construct using data
      const config = JSON.parse(notification.data.config)
      buildNotification(config)
    }
  }

  // detect if app is coming out of background
  _handleAppStateChange = (nextAppState) => {
    if (
      this.state.appState.match(/inactive|background/) &&
      nextAppState === 'active' &&
      auth().currentUser
    ) {
      this.props.showRefresh()
      if (socket.getSocket().connected) socket.reconnection()
      else socket.getSocket().connect()
    }
    this.setState({ appState: nextAppState })
  }

  render() {
    return this.state.appContainer
  }
}

const mapStateToProps = (state) => {
  return {
    session: state.session.session,
  }
}

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      newNotif,
      setHost,
      updateSession,
      setMatch,
      setTop,
      showKick,
      showRefresh,
      hideRefresh,
    },
    dispatch,
  )

export default connect(mapStateToProps, mapDispatchToProps)(App)

App.propTypes = {
  newNotif: PropTypes.func,
  setHost: PropTypes.func,
  updateSession: PropTypes.func,
  setMatch: PropTypes.func,
  setTop: PropTypes.func,
  showRefresh: PropTypes.func,
  hideRefresh: PropTypes.func,
  showKick: PropTypes.func,
}

/*
data: 
  config: "{
      type: type,
      content: content, 
      name: name,
      username: username, 
      photo: photo
    }" : string
*/
const buildNotification = (config) => {
  var message = { title: 'Wechews Notification', message: 'Default Message' }
  if (config.type == 'pending') {
    message = {
      title: 'New Friend Request',
      message: `${config.name} has sent you a friend request!`,
    }
  }
  if (config.type == 'accepted') {
    message = {
      title: 'Friend Request Accepted',
      message: `You are now friends with ${config.name}!`,
    }
  }
  if (config.type == 'invite') {
    message = { title: 'New Invite', message: `${config.name} has sent you an invite!` }
  }
  PushNotification.localNotification({
    channelId: 'default-channel-id',
    ...message,
  })
}

/* Notification Template */
// PushNotification.localNotification({
//   /* Android Only Properties */
//   channelId: 'default-channel-id',
// ticker: 'My Notification Ticker', // (optional)
// autoCancel: true, // (optional) default: true
// largeIcon: 'ic_launcher', // (optional) default: "ic_launcher"
// smallIcon: 'ic_notification', // (optional) default: "ic_notification" with fallback for "ic_launcher"
// bigText: 'My big text that will be shown when notification is expanded', // (optional) default: "message" prop
// subText: 'This is a subText', // (optional) default: none
// color: 'red', // (optional) default: system default
// vibrate: true, // (optional) default: true
// vibration: 300, // vibration length in milliseconds, ignored if vibrate=false, default: 1000
// tag: 'some_tag', // (optional) add tag to message
// group: 'group', // (optional) add group to message
// groupSummary: false, // (optional) set this notification to be the group summary for a group of notifications, default: false
// ongoing: false, // (optional) set whether this is an "ongoing" notification
// actions: ['Yes', 'No'], // (Android only) See the doc for notification actions to know more
// invokeApp: true, // (optional) This enable click on actions to bring back the application to foreground or stay in background, default: true

// when: null, // (optionnal) Add a timestamp pertaining to the notification (usually the time the event occurred). For apps targeting Build.VERSION_CODES.N and above, this time is not shown anymore by default and must be opted into by using `showWhen`, default: null.
// usesChronometer: false, // (optional) Show the `when` field as a stopwatch. Instead of presenting `when` as a timestamp, the notification will show an automatically updating display of the minutes and seconds since when. Useful when showing an elapsed time (like an ongoing phone call), default: false.
// timeoutAfter: null, // (optional) Specifies a duration in milliseconds after which this notification should be canceled, if it is not already canceled, default: null

/* iOS only properties */
// alertAction: 'view', // (optional) default: view
// category: '', // (optional) default: empty string

/* iOS and Android properties */
// id: this.lastId, // (optional) Valid unique 32 bit integer specified as string. default: Autogenerated Unique ID
// title: 'Wechews Notification', // (optional)
// message: `Type: ${config.type}, Content: ${config.content}, Name: ${config.name}, Username: ${config.username}, Photo: ${config.photo}`, // (required)
// userInfo: { screen: 'home' }, // (optional) default: {} (using null throws a JSON value '<null>' error)
// playSound: false, // (optional) default: true
// soundName: 'default', // (optional) Sound to play when the notification is shown. Value of 'default' plays the default sound. It can be set to a custom sound such as 'android.resource://com.xyz/raw/my_sound'. It will look for the 'my_sound' audio file in 'res/raw' directory and play it. default: 'default' (default sound is played)
// number: 10, // (optional) Valid 32 bit integer specified as string. default: none (Cannot be zero)
// });
