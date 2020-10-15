import React from 'react'
import {
  StyleSheet,
  Text,
  TouchableHighlight,
  View
} from 'react-native'
import AsyncStorage from '@react-native-community/async-storage'
import Invite from './invite.js'
import { NAME,  PHOTO, USERNAME } from 'react-native-dotenv'
import socket from './socket.js'

var img = ''
var name = ''
var username = ''

//  gets user info
AsyncStorage.getItem(PHOTO).then(res => (img = res))
AsyncStorage.getItem(NAME).then(res => (name = res))
AsyncStorage.getItem(USERNAME).then(res => (username = res))

class Home extends React.Component {
  constructor () {
    super()
    this.state = {
      createPressed: false,
      profilePressed: false,
      invite: false,
      image: img,
      name: name,
      username: username
    }
    socket.connect()
    socket.getSocket().on('reconnectRoom', res => console.log(res))
    socket.getSocket().on('invite', (res => {
      this.setState({ invite: true })
    }))
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

  componentDidMount () {
    // uncomment if testing friends/requests
    // api.createFBUser('Hubert', 2, 'hubesc', 'hubesc@gmail.com', 'hjgkjgkjg'),
    // api.createFBUser('Hanna', 3, 'hco', 'hco@gmail.com', 'sfhkslfs'),
    // api.createFBUser('Anna', 4, 'annax', 'annx@gmail.com', 'ksflsfsf'),
    // // console.log("My id:" + myId)
    // friendsapi.createFriendship(2, myId),
    // friendsapi.createFriendship(4, 2),
    // friendsapi.createFriendship(3, myId),
    // friendsapi.createFriendship(4, myId)
    // friendsapi.acceptFriendRequest(2)
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
        {this.state.invite && <Invite image={this.state.image} name={this.state.name} onPress={() => this.setState({invite: false})}/>}
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
