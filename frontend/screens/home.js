import React from 'react'
import { Dimensions, Modal, Image, StyleSheet, Text, TextInput, TouchableHighlight, View } from 'react-native'
import { NAME, PHOTO, USERNAME, ID } from 'react-native-dotenv'
import AsyncStorage from '@react-native-community/async-storage'
import accountsApi from '../apis/accountsApi.js'
import Alert from '../modals/alert.js'
import friendsApi from '../apis/friendsApi.js'
import Join from '../modals/join.js'
import socket from '../apis/socket.js'
import screenStyles from '../../styles/screenStyles.js'
import TabBar from '../nav.js'
<<<<<<< HEAD
import Icon from 'react-native-vector-icons/FontAwesome'
=======
import Icon from 'react-native-vector-icons/AntDesign'
import SwitchButton from 'switch-button-react-native';
>>>>>>> cc2c3d5d891963e01c7469d1f3a17818c81af527

var img = ''
var name = ''
var username = ''

//  gets user info
AsyncStorage.getItem(PHOTO).then((res) => (img = res))
AsyncStorage.getItem(NAME).then((res) => (name = res))
AsyncStorage.getItem(USERNAME).then((res) => (username = res))
var myId = ''

const width = Dimensions.get('window').width
const height = Dimensions.get('window').height
const hex = '#F15763'

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
          alignItems: 'center',
          justifyContent: 'space-evenly',
        }}
      >
        <Text style={[screenStyles.text, screenStyles.title, { fontSize: 30 }]}>
          Hungry? Chews wisely.
        </Text>
        {/* dummy image */}
        <Image
          source={{
            uri:
              'https://banner2.cleanpng.com/20181107/fhg/kisspng-computer-icons-location-map-united-states-of-ameri-5be33fd26a48d9.3500512415416196664353.jpg',
          }}
          style={{ width: 200, height: 200 }}
        />
        <View>
          <TouchableHighlight
            onShowUnderlay={() => this.setState({ createPressed: true })}
            onHideUnderlay={() => this.setState({ createPressed: false })}
            activeOpacity={1}
            underlayColor="white"
            style={{
              backgroundColor: '#F15763',
              borderRadius: 40,
              width: width * 0.5,
              height: 45,
              justifyContent: 'center',
              alignSelf: 'center',
              margin: '3%',
            }}
            onPress={() => this.createGroup()}
          >
            <Text
              style={[
                styles.buttonText,
                this.state.createPressed ? { color: '#F15763' } : { color: 'white' },
              ]}
            >
              Create Group
            </Text>
          </TouchableHighlight>
          <TouchableHighlight
            onShowUnderlay={() => this.setState({ joinPressed: true })}
            onHideUnderlay={() => this.setState({ joinPressed: false })}
            activeOpacity={1}
            underlayColor="#F15763"
            style={{
              backgroundColor: 'white',
              borderRadius: 40,
              width: width * 0.5,
              height: 45,
              justifyContent: 'center',
              alignSelf: 'center',
              borderColor: '#F15763',
              borderWidth: 2,
            }}
            onPress={() => this.setState({ join: true })}
          >
            <Text
              style={[
                styles.buttonText,
                this.state.profilePressed ? { color: 'white' } : { color: '#F15763' },
              ]}
            >
              Join Group
            </Text>
          </TouchableHighlight>
        </View>
        <TabBar
          goHome={() => this.props.navigation.navigate('Home')}
          goSearch={() => this.props.navigation.navigate('Search')}
          goNotifs={() => this.props.navigation.navigate('Notifications')}
          goProfile={() => this.props.navigation.navigate('Profile')}
          cur="Home"
        />
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
    height: 65,
    margin: '3%',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  buttonText: {
    textAlign: 'center',
    fontFamily: 'CircularStd-Bold',
    fontSize: 18,
  },
})

export default Home
