import React from 'react'
import {
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
} from 'react-native';
import socket from './socket.js';
import api from './accountsApi.js';
import friendsApi from './friendsApi.js';
import { ID } from 'react-native-dotenv'
import AsyncStorage from '@react-native-community/async-storage'

var myId = ''


AsyncStorage.getItem(ID).then(res => {
  myId = res
})
  
class Home extends React.Component {
  constructor () {
    super()
    this.state = {
      createPressed: false,
      profilePressed: false,
      friends: new Object(),
    };
    socket.connect()
    socket.getSocket().on('reconnectRoom', res => console.log(res))
  }

  underlayShowCreate () {
    this.setState({ createPressed: true })
  }

  underlayHideCreate () {
    this.setState({ createPressed: false })
  }

  underlayShowProfile () {
    this.setState({ profilePressed: true })
  }

  underlayHideProfile () {
    this.setState({ profilePressed: false })
  }

  createGroup () {
    socket.createRoom()
    socket.getSocket().on('update', res => {
      this.props.navigation.navigate('Group', res)
    })
  }


  
  componentDidMount() {
    //uncomment if testing friends/requests
    api.createFBUser('Hubert', 2, 'hubesc', 'hubesc@gmail.com', 'hjgkjgkjg'),
    api.createFBUser('Hanna', 3, 'hco', 'hco@gmail.com', 'sfhkslfs'),
    api.createFBUser('Anna', 4, 'annax', 'annx@gmail.com', 'ksflsfsf'),
    api.createFBUser('Helen', 5, 'helenthemelon', 'helenw@gmail.com', 'sjdkf'),
    api.createFBUser('Kevin', 6, 'kevint', 'kevintang@gmail.com', 'sdfddf'),
    
    // console.log("My id:" + myId)
    friendsApi.createFriendship(2, myId),
    friendsApi.createFriendship(4, 2),
    friendsApi.createFriendship(3, myId),
    friendsApi.createFriendship(4, myId)
    friendsApi.acceptFriendRequest(2)
  

  }

  getFriends() {
    // Pushing accepted friends or pending requests into this.state.friends
    friendsApi
      .getFriends()
      .then(res => {
        var friendsMap = new Object();
        for (var friend in res.friendList) {
          friendsMap[res.friendList[friend].id] = res.friendList[friend].status
        }
        this.setState({ friends: friendsMap});
        // console.log(this.state.friends)

        this.props.navigation.navigate('Search', {
          allFriends: friendsMap
        })
      })
      .catch(err => console.log(err));
  }

  render () {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: '#F25763',
          justifyContent: 'center'
        }}
      >
        <TouchableHighlight
          onShowUnderlay={this.underlayShowCreate.bind(this)}
          onHideUnderlay={this.underlayHideCreate.bind(this)}
          activeOpacity={1}
          underlayColor='#fff'
          style={styles.button}
          onPress={() => this.createGroup()}
        >
          <Text
            style={this.state.createPressed ? styles.yesPress : styles.noPress}
          >
            Create Group
          </Text>
        </TouchableHighlight>
        <TouchableHighlight
          onShowUnderlay={this.underlayShowProfile.bind(this)}
          onHideUnderlay={this.underlayHideProfile.bind(this)}
          activeOpacity={1}
          underlayColor='#fff'
          style={styles.button}
          onPress={() => this.props.navigation.navigate('Profile')}
        >
          <Text
            style={
              this.state.profilePressed ? styles.yesPress : styles.noPress
            }
          >
            My Profile
          </Text>
        </TouchableHighlight>
        <TouchableHighlight
          onShowUnderlay={this.underlayShowProfile.bind(this)}
          onHideUnderlay={this.underlayHideProfile.bind(this)}
          activeOpacity={1}
          underlayColor="#fff"
          style={styles.button}
          onPress={() => {
            this.getFriends()
            }}>
          <Text
            style={
              this.state.profilePressed ? styles.yesPress : styles.noPress
            }>
            Find Friends
          </Text>
        </TouchableHighlight>
      </View>
    )
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
    justifyContent: 'center'
  },
  yesPress: {
    textAlign: 'center',
    color: '#F25763',
    fontFamily: 'CircularStd-Medium',
    fontSize: 27,
    fontWeight: 'bold'
  },
  noPress: {
    textAlign: 'center',
    color: '#fff',
    fontFamily: 'CircularStd-Medium',
    fontSize: 27,
    fontWeight: 'bold'
  }
})

export default Home
