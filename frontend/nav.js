import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { createAppContainer } from 'react-navigation'
import { createBottomTabNavigator } from 'react-navigation-tabs'
// import { createMaterialBottomTabNavigator } from 'react-navigation-material-bottom-tabs'
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
import TabBar from './TabBar.js'

const HomeStack = createStackNavigator(
  { Home, Group, Round, Match },
  { initialRouteName: 'Home', headerMode: 'none' },
)

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

const TabNavigator = createBottomTabNavigator(
  {
    Home: {
      screen: HomeStack,
      tabBarAccessibilityLabel: 'Home',
      navigationOptions: {
        tabBarLabel: 'Home',
        tabBarIcon: ({ focused, tintColor }) => (
          <Icon focused={focused} name="home" color={tintColor} size={26} />
        ),
      },
    },
    Search: {
      screen: Search,
      tabBarAccessibilityLabel: 'Search',
      navigationOptions: {
        tabBarLabel: 'Search',
        tabBarIcon: ({ focused, tintColor }) => (
          <Icon focused={focused} name="search" color={tintColor} size={26} />
        ),
      },
    },
    Notifications: {
      screen: Notifications,
      tabBarAccessibilityLabel: 'Notifications',
      navigationOptions: {
        tabBarLabel: 'Notifications',
        tabBarIcon: ({ focused, tintColor }) => (
          <Icon focused={focused} name="bullhorn" color={tintColor} size={26} />
        ),
      },
    },
    Profile: {
      screen: UserProfileView,
      tabBarAccessibilityLabel: 'Profile',
      navigationOptions: {
        tabBarLabel: 'Profile',
        tabBarIcon: ({ focused, tintColor }) => (
          <Icon focused={focused} name="user" color={tintColor} size={26} />
        ),
      },
    },
  },
  {
    initialRouteName: 'Home',
    tabBarOptions: {
      backgroundColor: 'white',
      activeTintColor: hex,
      inactiveTintColor: '#777777',
      showLabel: false,
      style: {
        margin: '2%',
        backgroundColor: '#fff2f2',
        borderWidth: 0,
        borderRadius: 10,
        elevation: 20,
      },
    },
  },
)

export default createAppContainer(TabNavigator)
