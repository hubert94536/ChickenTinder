/* eslint-disable no-unused-vars */
import React from 'react'
import { Text, View } from 'react-native'
import { createStackNavigator } from 'react-navigation-stack' // 1.0.0-beta.27
import { createAppContainer } from 'react-navigation'
import firebase from 'firebase'
import PushNotification from 'react-native-push-notification'
import Group from './frontend/screens/Group.js'
import Home from './frontend/screens/Home.js'
// import Invite from './frontend/modals/Invite.js'
import Login from './frontend/screens/Login.js'
import Match from './frontend/screens/Match.js'
import Notifications from './frontend/screens/Notifications.js'
import notificationsApi from './frontend/apis/notificationsApi.js'
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
import AsyncStorage from '@react-native-async-storage/async-storage'
import { ID, REGISTRATION_TOKEN } from 'react-native-dotenv'

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
    };

    PushNotification.configure({
      onRegister: function(token) {
        console.log("Token generated")
        console.log(token);
        AsyncStorage.setItem(REGISTRATION_TOKEN, token.token)
        AsyncStorage.getItem(ID).then((id) => {
          //send to back-end server to register with id
          if (id) notificationsApi.linkToken(id, token.token); 
        })
      },
      onNotification: function(notification){
        // Consider sending only data, then constructing a notification here to display to the user (as FCM base notification construction is quite limited)
        console.log("Notification received")
        console.log(notification);
        if (!notification.userInteraction){
          //construct using data
          buildNotification(notification.data)
        }
      },
      onAction: function(notification){
        console.log(notification);
        if (notification.action === "open") PushNotification.invokeApp(notification); // figure this out later
      },
      popInitialNotification: true,
      requestPermissions: true
    });
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
    return this.state.appContainer;
  }

}

/*
data: {
  type: type,
  content: content, 
  name: name,
  username: username, 
  photo: photo
}
*/
const buildNotification = (config) => {
  PushNotification.localNotification({
    /* Android Only Properties */
    channelId: 'default-channel-id',
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
    title: 'Wechews Notification', // (optional)
    message: `Type: ${config.type}, Content: ${config.content}, Name: ${config.name}, Username: ${config.username}, Photo: ${config.photo}`, // (required)
    // userInfo: { screen: 'home' }, // (optional) default: {} (using null throws a JSON value '<null>' error)
    playSound: false, // (optional) default: true
    // soundName: 'default', // (optional) Sound to play when the notification is shown. Value of 'default' plays the default sound. It can be set to a custom sound such as 'android.resource://com.xyz/raw/my_sound'. It will look for the 'my_sound' audio file in 'res/raw' directory and play it. default: 'default' (default sound is played)
    // number: 10, // (optional) Valid 32 bit integer specified as string. default: none (Cannot be zero)
  });
}