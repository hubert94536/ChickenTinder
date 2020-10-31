import React from 'react'
import { Dimensions, StyleSheet, Text, TouchableHighlight, View } from 'react-native'
import { NAME, PHOTO, USERNAME, ID } from 'react-native-dotenv'
import AsyncStorage from '@react-native-community/async-storage'
import accountsApi from '../apis/accountsApi.js'
import Alert from '../modals/alert.js'
import friendsApi from '../apis/friendsApi.js'
import Join from '../modals/join.js'
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

const width = Dimensions.get('window').width

AsyncStorage.getItem(ID).then((res) => {
  myId = res
})

class Home extends React.Component {
  constructor() {
    super()
    this.state = {
      createPressed: false,
      joinPressed: false,
      searchPressed: false,
      join: false,
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

  // async getFriends() {
  //   // Pushing accepted friends or pending requests into this.state.friends
  //   friendsApi
  //     .getFriends()
  //     .then((res) => {
  //       var friendsMap = new Object()
  //       for (var friend in res.friendList) {
  //         friendsMap[res.friendList[friend].id] = res.friendList[friend].status
  //       }
  //       this.setState({ friends: friendsMap })
  //       this.props.navigation.navigate('Search', {
  //         allFriends: friendsMap,
  //       })
  //     })
  //     .catch((err) => {
  //       this.setState({ errorAlert: true })
  //     })
  // }

  render() {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: 'white',
          alignItems:'center',
          justifyContent: 'space-evenly',
        }}
      >
        <Text style={[screenStyles.text, screenStyles.title, {fontSize: 30}]}>Hungry? Chews wisely.</Text>
        <View >
        <TouchableHighlight
          onShowUnderlay={() => this.setState({ createPressed: true })}
          onHideUnderlay={() => this.setState({ createPressed: false })}
          activeOpacity={1}
          underlayColor="white"
          style={{backgroundColor: '#F25763', borderRadius: 40, width: width*0.5, height: 45, justifyContent:'center', alignSelf:'center', margin:'3%'}}
          onPress={() => this.createGroup()}
        >
          <Text style={[styles.buttonText, this.state.createPressed ? {color: '#F25763'} : {color: 'white'}]}>
            Create Group
          </Text>
        </TouchableHighlight>
        <TouchableHighlight
          onShowUnderlay={() => this.setState({ joinPressed: true })}
          onHideUnderlay={() => this.setState({ joinPressed: false })}
          activeOpacity={1}
          underlayColor="#F25763"
          style={{backgroundColor: 'white', borderRadius: 40, width: width*0.5, height: 45, justifyContent:'center', alignSelf:'center', borderColor:'#F25763', borderWidth:2, margin:'3%'}}
          onPress={() => this.setState({join: true})}
        >
          <Text style={[styles.buttonText, this.state.profilePressed ? {color: 'white'} : {color: '#F25763'}]}>
            Join Group
          </Text>
        </TouchableHighlight>
        </View>
        {this.state.join && (
          <Join
            image={this.state.inviteInfo.pic}
            username={this.state.inviteInfo.username}
            name={this.state.inviteInfo.name}
            cancel={() => this.setState({ join: false })}
            onPress={() => this.setState({ join: false })}
          />
        )}
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
    height: 65, margin: '3%', flexDirection: 'column', justifyContent: 'center'
  },
  buttonText: {
    textAlign: 'center',
    fontFamily: 'CircularStd-Bold',
    fontSize: 18,
  },
})

export default Home
