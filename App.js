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

var user = firebase.auth().currentUser;
var start = '';

if (user === null) {
  start = 'Login';
} else {
  start = 'Home';
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
      screen: RestaurantCard,
    },
  },
  {
    initialRouteName: 'Home',
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
// import FilterSelector from './filter.js';
// import Group from './group.js';
// import UserProfileView from './profile.js';

// export default class App extends React.Component {
//   render() {
//     return (
//       // <FilterSelector
//       //   username={'hannaco'}
//       //   host={'hannaco'}
//       //   isHost={true}
//       //   press={() => console.log('press')}
//       // />
//       <UserProfileView />
//     );
//   }
// }
