import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { createAppContainer } from 'react-navigation'
import { createMaterialBottomTabNavigator } from 'react-navigation-material-bottom-tabs'
import Icon from 'react-native-vector-icons/FontAwesome'
import Home from './screens/home.js'
import Search from './screens/search.js'
import UserProfileView from './screens/profile.js'

import { createStackNavigator } from 'react-navigation-stack' // 1.0.0-beta.27
import firebase from 'firebase'
import Group from './screens/group.js'
import Login from './screens/login.js'
import Match from './screens/match.js'
import Round from './screens/round.js'
import Username from './screens/username.js'
import PhoneAuthScreen from './screens/PhoneAuth.js'

const HomeStack = createStackNavigator({ Home, Group, Round, Match }, {initialRouteName:'Home', headerMode: 'none'});


const hex = '#F25763'
const font = 'CircularStd-Bold'


class Notifications extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <Text style={{ fontFamily: font }}>Notifications</Text>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
})
const TabNavigator = createMaterialBottomTabNavigator(
  {
    Home: {
      screen: HomeStack,
      navigationOptions: {
        tabBarLabel: 'Home',
        tabBarIcon: <Icon name='home' size={26}/>
      },
    },
    Search: {
      screen: Search,
      navigationOptions: {
        tabBarLabel: 'Search',
        tabBarIcon: <Icon name='search' size={26}/>
      },
    },
    Notifications: {
      screen: Notifications,
      navigationOptions: {
        tabBarLabel: 'Notifications',
        tabBarIcon: <Icon name='bullhorn' size={26}/>
      },
    },
    Profile: {
      screen: UserProfileView,
      navigationOptions: {
        tabBarLabel: 'Profile',
        tabBarIcon: <Icon name='user' size={26}/>
      },
    },
  },
  {
    initialRouteName: 'Home',
    barStyle:  { backgroundColor: '#fff2f2'}
  },
)

export default createAppContainer(TabNavigator)
