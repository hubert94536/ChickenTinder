import React from 'react'
import { Image, Modal, Dimensions, StyleSheet, Text, TouchableHighlight, View } from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome'
<<<<<<< HEAD
import Home from './screens/home.js'
import Search from './screens/search.js'
import UserProfileView from './screens/profile.js'
import { createStackNavigator } from 'react-navigation-stack' // 1.0.0-beta.27
import Group from './screens/group.js'
import Match from './screens/match.js'
import Round from './screens/round.js'
import PropTypes from 'prop-types'

const HomeStack = createStackNavigator(
  { Home, Group, Round, Match },
  { initialRouteName: 'Home', headerMode: 'none' },
)

const hex = '#F25763'
const font = 'CircularStd-Bold'

class Notifications extends React.Component {
=======

const height = Dimensions.get('window').height

const hex = '#F15763'

export default class TabBar extends React.Component{
>>>>>>> 8522c47d83d5811d63c3936d16b94aec8a8de1d6
  render() {
    return (
            <View style={styles.bar}>
              <Icon name='home' style={{color: this.props.cur === 'Home' ? hex : '#8d8d8d', fontSize: 26}} onPress={() => this.props.goHome()}/>
              <Icon name='search' style={{color: this.props.cur === 'Search' ? hex : '#8d8d8d', fontSize: 26}} onPress={() => this.props.goSearch()}/>
              <Icon name='bullhorn' style={{color: this.props.cur === 'Notifs' ? hex : '#8d8d8d', fontSize: 26}}  onPress={() => this.props.goNotifs()}/>
              <Icon name='user' style={{color: this.props.cur === 'Profile' ? hex : '#8d8d8d', fontSize: 26}}  onPress={() => this.props.goProfile()}/>
            </View>

    )
  }
}

const styles = StyleSheet.create({
  bar:{
    width:'95%',
    marginBottom:'2%',
    alignSelf:'center',
    height: height*0.07, 
    backgroundColor:'#fff2f2',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    elevation: 20,
    borderWidth: 0,
    position: 'absolute',
    bottom: 0,
    flexDirection:'row',
    justifyContent:'space-evenly'
  }
})
<<<<<<< HEAD

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

Icon.propTypes = {
  focused: PropTypes.bool,
  tintColor: PropTypes.string,
}

export default createAppContainer(TabNavigator)
=======
>>>>>>> 8522c47d83d5811d63c3936d16b94aec8a8de1d6
