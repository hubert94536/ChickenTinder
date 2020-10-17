import React from 'react'
import { StyleSheet, Text, TouchableHighlight, View } from 'react-native'
import AsyncStorage from '@react-native-community/async-storage'
import Invite from './invite.js'
import { NAME, PHOTO, USERNAME } from 'react-native-dotenv'
import socket from './socket.js'
import accountsApi from './accountsApi.js'
import Alert from './alert.js'
import friendsApi from './friendsApi.js'
import { ID } from 'react-native-dotenv'

var img = ''
var name = ''
var username = ''

//  gets user info
AsyncStorage.getItem(PHOTO).then((res) => (img = res))
AsyncStorage.getItem(NAME).then((res) => (name = res))
AsyncStorage.getItem(USERNAME).then((res) => (username = res))
var myId = ''

AsyncStorage.getItem(ID).then((res) => {
  myId = res
})

class Home extends React.Component {
  constructor() {
    super()
    this.state = {
      createPressed: false,
      profilePressed: false,
      searchPressed: false,
      invite: false,
      image: img,
      name: name,
      username: username,
      inviteInfo: '',
      friends: '',
      errorAlert: false
    }
    socket.connect()
    // socket.getSocket().on('reconnectRoom', res => console.log(res))
    socket.getSocket().on('invite', (res) => {
      this.setState({ invite: true, inviteInfo: res })
    })
    socket.getSocket().on('update', (res) => {
      this.props.navigation.navigate('Group', res)
    })
  }

  underlayShowCreate() {
    this.setState({ createPressed: true })
  }

  underlayHideCreate() {
    this.setState({ createPressed: false })
  }

  underlayShowProfile() {
    this.setState({ profilePressed: true })
  }

  underlayHideProfile() {
    this.setState({ profilePressed: false })
  }

  closeInvite() {
    this.setState({ invite: false })
  }

  createGroup() {
    socket.createRoom()
  }

  componentDidMount() {
    //uncomment if testing friends/requests
    // accountsApi.createFBUser('Hubert', 2, 'hubesc', 'hubesc@gmail.com', 'hjgkjgkjg'),
    // accountsApi.createFBUser('Hanna', 3, 'hco', 'hco@gmail.com', 'sfhkslfs'),
    // accountsApi.createFBUser('Anna', 4, 'annax', 'annx@gmail.com', 'ksflsfsf'),
    // accountsApi.createFBUser('Helen', 5, 'helenthemelon', 'helenw@gmail.com', 'sjdkf'),
    // accountsApi.createFBUser('Kevin', 6, 'kevint', 'kevintang@gmail.com', 'sdfddf'),
    // // console.log("My id:" + myId)
    // friendsApi.createFriendshipTest(2, myId),
    // friendsApi.createFriendshipTest(4, 2),
    // friendsApi.createFriendshipTest(3, myId),
    // friendsApi.createFriendshipTest(4, myId)
    // friendsApi.acceptFriendRequest(2)
  }

  async getFriends() {
    // Pushing accepted friends or pending requests into this.state.friends
    friendsApi
      .getFriends()
      .then((res) => {
        var friendsMap = new Object()
        for (var friend in res.friendList) {
          friendsMap[res.friendList[friend].id] = res.friendList[friend].status
        }
        this.setState({ friends: friendsMap })
        this.props.navigation.navigate('Search', {
          allFriends: friendsMap,
        })
      })
      .catch((err) =>{
        this.setState({errorAlert: true})
      })
  }

  render() {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: '#F25763',
          justifyContent: 'center',
        }}
      >
        <TouchableHighlight
          onShowUnderlay={() => this.setState({ createPressed: true })}
          onHideUnderlay={() => this.setState({ createPressed: false })}
          activeOpacity={1}
          underlayColor="#fff"
          style={styles.button}
          onPress={() => this.createGroup()}
        >
          <Text style={this.state.createPressed ? styles.yesPress : styles.noPress}>
            Create Group
          </Text>
        </TouchableHighlight>
        <TouchableHighlight
          onShowUnderlay={() => this.setState({ profilePressed: true })}
          onHideUnderlay={() => this.setState({ profilePressed: false })}
          activeOpacity={1}
          underlayColor="#fff"
          style={styles.button}
          onPress={() => this.props.navigation.navigate('Profile')}
        >
          <Text style={this.state.profilePressed ? styles.yesPress : styles.noPress}>
            My Profile
          </Text>
        </TouchableHighlight>
        {this.state.invite && (
          <Invite
            image={this.state.inviteInfo.pic}
            username={this.state.inviteInfo.username}
            name={this.state.inviteInfo.name}
            cancel={() => this.closeInvite()}
            onPress={() => this.closeInvite()}
          />
        )}
        <TouchableHighlight
          onShowUnderlay={() => this.setState({ searchPressed: true })}
          onHideUnderlay={() => this.setState({ searchPressed: false })}
          activeOpacity={1}
          underlayColor="#fff"
          style={styles.button}
          onPress={() => {
            this.getFriends()
          }}
        >
          <Text style={this.state.searchPressed ? styles.yesPress : styles.noPress}>
            Find Friends
          </Text>
        </TouchableHighlight>
        {this.state.errorAlert && (
          <Alert
            title="Error, please try again"
            button
            buttonText="Close"
            press={() => this.setState({errorAlert: false})}
            cancel={() => this.setState({errorAlert: false})}
          />
        )}
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
})

export default Home
