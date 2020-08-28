import React from 'react';
import {StyleSheet, Text, View, Button} from 'react-native';
import {createBottomTabNavigator, createAppContainer} from 'react-navigation';
import {createMaterialBottomTabNavigator} from 'react-navigation-material-bottom-tabs';
class HomeScreen extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <Text>Home Screen</Text>
      </View>
    );
  }
}
class ProfileScreen extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <Text>Profile Screen</Text>
      </View>
    );
  }
}
class SavedScreen extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <Text>Saved Screen</Text>
      </View>
    );
  }
}
class GroupsScreen extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <Text>Group Screen</Text>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
const TabNavigator = createMaterialBottomTabNavigator(
  {
    Home: {
      screen: HomeScreen,
      navigationOptions: {
        tabBarLabel: 'Home',
      },
    },
    Profile: {
      screen: ProfileScreen,
      navigationOptions: {
        tabBarLabel: 'Profile',
      },
    },
    Saved: {
      screen: SavedScreen,
      navigationOptions: {
        tabBarLabel: 'Saved',
      },
    },
    Groups: {
      screen: GroupsScreen,
      navigationOptions: {
        tabBarLabel: 'Groups',
      },
    },
  },
  {
    initialRouteName: 'Home',
    barStyle: {backgroundColor: '#FB6767'},
  },
);

export default createAppContainer(TabNavigator);
