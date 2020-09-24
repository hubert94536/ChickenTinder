import React from 'react';
import Login from './login.js';
import Home from './home.js';
import Username from './username.js';
import UserProfileView from './profile.js';
import Group from './group.js';
import RestaurantCard from './round.js';
import {UID} from 'react-native-dotenv';
import firebase from 'firebase';
import {createStackNavigator} from 'react-navigation-stack'; // 1.0.0-beta.27
import {createAppContainer} from 'react-navigation';

var start = '';
// doesnt work
firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    // User is signed in.
    start = 'Home'
    console.log('logged')
  } else {
    // No user is signed in.
    start = 'Login'
  }
});

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
      screen: RestaurantCard,
    },
  },
  {
    initialRouteName: start,
    headerMode: 'none',
  },
);

const AppContainer = createAppContainer(RootStack);

export default class App extends React.Component {
  render() {
    return <AppContainer />;
  }
}

// import React from 'react';
// import Search from './search.js';

// export default class App extends React.Component {
//   render() {
//     return <Search />;
//   }
// }
