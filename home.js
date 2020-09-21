import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  Button,
  Alert,
  TouchableHighlight,
} from 'react-native';
import api from './api.js';
import friendsapi from './friendsapi.js';
import UserProfileView from './profile.js';
import socket from './socket.js';

class Home extends React.Component {
  constructor() {
    super();
    this.state = {
      createPressed: false,
      profilePressed: false,
    };
  }

  underlayShowCreate() {
    this.setState({createPressed: true});
  }

  underlayHideCreate() {
    this.setState({createPressed: false});
  }

  underlayShowProfile() {
    this.setState({profilePressed: true});
  }

  underlayHideProfile() {
    this.setState({profilePressed: false});
  }

  createGroup() {
    socket.createRoom();
    socket.getSocket().on('update', res => {
      this.props.navigation.navigate('Group', res);
    });
  }

  componentDidMount() {
    // api.createFBUser("isha", 0, "ishaaa", "ishag@gmail.com", "dffdsds"),
    // api.createFBUser("hanna", 0, "hco", "hannc@gmail.com", "kfdkfjs"),
    // api.createFBUser("hubert", 0, "hubes", "hubes@gmail.com", "jskfhskl"),
    // friendsapi.createFriendship("hubes", "hco"),
    // friendsapi.createFriendship("ishaaa", "hubes"),
    // friendsapi.createFriendship("hco", "ishaaa")
    // friendsapi.denyFriendRequest("ishaaa", "hco")
    
    // friendsapi.getFriends("hco")

    api.createFBUser("isha", 0, "ishaaa", "ishag@gmail.com", "dffdsds"),
    api.createFBUser("hanna", 0, "hco", "hannc@gmail.com", "kfdkfjs"),
    api.createFBUser("hubert", 0, "hubes", "hubes@gmail.com", "jskfhskl"),
    // console.log(api.getAllUsers()),
    friendsapi.createFriendship(1, 2)
    // friendsapi.createFriendship("ishaaa", "hubes"),
    // friendsapi.createFriendship("hco", "ishaaa"),
    // friendsapi.acceptFriendRequest("hubes", "ishaaa"),
    // friendsapi.denyFriendRequest("hubes", "hco")
    // console.log(friendsapi.getFriends("ishaaa"))
    // console.log(friendsapi.getFriends("hubes")),
    // friendsapi.removeFriend("hco", "hubes"),
    // console.log(friendsapi.getFriends("hubes"))
  }

  render() {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: '#F25763',
          justifyContent: 'center',
        }}>
        <TouchableHighlight
          onShowUnderlay={this.underlayShowCreate.bind(this)}
          onHideUnderlay={this.underlayHideCreate.bind(this)}
          activeOpacity={1}
          underlayColor="#fff"
          style={styles.button}
          onPress={() => this.createGroup()}>
          <Text
            style={this.state.createPressed ? styles.yesPress : styles.noPress}>
            Create Group
          </Text>
        </TouchableHighlight>
        <TouchableHighlight
          onShowUnderlay={this.underlayShowProfile.bind(this)}
          onHideUnderlay={this.underlayHideProfile.bind(this)}
          activeOpacity={1}
          underlayColor="#fff"
          style={styles.button}
          onPress={() => this.props.navigation.navigate('Profile')}>
          <Text
            style={
              this.state.profilePressed ? styles.yesPress : styles.noPress
            }>
            My Profile
          </Text>
        </TouchableHighlight>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 40,
    borderColor: '#fff',
    borderWidth: 2,
    width: '65%',
    height: 65,
    alignSelf: 'center',
    margin: '3%',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  yesPress: {
    textAlign: 'center',
    color: '#F25763',
    fontFamily: 'CircularStd-Medium',
    fontSize: 27,
    fontWeight: 'bold',
  },
  noPress: {
    textAlign: 'center',
    color: '#fff',
    fontFamily: 'CircularStd-Medium',
    fontSize: 27,
    fontWeight: 'bold',
  },
});

export default Home;
