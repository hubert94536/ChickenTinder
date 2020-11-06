import React from 'react'
import { StyleSheet, Text, TouchableHighlight, View } from 'react-native'
import { NAME, PHOTO, USERNAME, ID } from 'react-native-dotenv'
import AsyncStorage from '@react-native-community/async-storage'
import accountsApi from '../apis/accountsApi.js'
import Alert from '../modals/alert.js'
import friendsApi from '../apis/friendsApi.js'
import Invite from '../modals/invite.js'
import socket from '../apis/socket.js'
import screenStyles from '../../styles/screenStyles.js'

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
      errorAlert: false,
    }
    socket.connect()
    // socket.getSocket().on('reconnectRoom', res => console.log(res))
    socket.getSocket().on('invite', (res) => {
      this.setState({ invite: true, inviteInfo: res })
    })
    socket.getSocket().on('update', (res) => {
      this.setState({ invite: false })
      this.props.navigation.navigate('Group', res)
    })
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
    // friendsApi.createFriendshipTest(myId, 2),
    // friendsApi.createFriendshipTest(4, 2),
    // friendsApi.createFriendshipTest(myId, 3),
    // friendsApi.createFriendshipTest(myId, 4)
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
      .catch((err) => {
        this.setState({ errorAlert: true })
      })
    this.setState({ friends: friendsMap })
    this.props.navigation.navigate('Search', {
      allFriends: friendsMap,
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
          style={[screenStyles.bigButton, styles.button]}
          onPress={() => this.createGroup()}
        >
          <Text
            style={[
              styles.buttonText,
              this.state.createPressed ? { color: '#F25763' } : { color: 'white' },
            ]}
          >
            Create Group
          </Text>
        </TouchableHighlight>
        <TouchableHighlight
          onShowUnderlay={() => this.setState({ profilePressed: true })}
          onHideUnderlay={() => this.setState({ profilePressed: false })}
          activeOpacity={1}
          underlayColor="#fff"
          style={[screenStyles.bigButton, styles.button]}
          onPress={() => this.props.navigation.navigate('Profile')}
        >
          <Text
            style={[
              styles.buttonText,
              this.state.profilePressed ? { color: '#F25763' } : { color: 'white' },
            ]}
          >
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
          style={[screenStyles.bigButton, styles.button]}
          onPress={() => {
            this.getFriends()
          }}
        >
          <Text
            style={[
              styles.buttonText,
              this.state.searchPressed ? { color: '#F25763' } : { color: 'white' },
            ]}
          >
            Find Friends
          </Text>
        </TouchableHighlight>
        {this.state.errorAlert && (
          <Alert
            title="Error, please try again"
            button
            buttonText="Close"
            press={() => this.setState({ errorAlert: false })}
            cancel={() => this.setState({ errorAlert: false })}
          />
        )}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  button: {
    height: 65,
    margin: '3%',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  buttonText: {
    textAlign: 'center',
    fontFamily: 'CircularStd-Medium',
    fontSize: 27,
    fontWeight: 'bold',
  },
})

export default Home
