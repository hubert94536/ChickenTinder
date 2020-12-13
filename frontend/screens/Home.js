/* eslint-disable no-unused-vars */
import React from 'react'
import { Dimensions, Image, StyleSheet, Text, TouchableHighlight, View } from 'react-native'
import { NAME, PHOTO, USERNAME, ID } from 'react-native-dotenv'
import AsyncStorage from '@react-native-community/async-storage'
import PropTypes from 'prop-types'
// import friendsApi from '../apis/friendsApi.js'
// import accountsApi from '../apis/accountsApi.js'
import socket from '../apis/socket.js'
import Alert from '../modals/alert.js'
import Join from '../modals/join.js'
import TabBar from '../nav.js'
import screenStyles from '../../styles/screenStyles.js'

var id = ''
var name = ''
var photo = ''
var username = ''

const width = Dimensions.get('window').width

class Home extends React.Component {
  constructor() {
    super()
    this.state = {
      createPressed: false,
      joinPressed: false,
      searchPressed: false,
      join: false,
      inviteInfo: '',
      friends: '',
      errorAlert: false,
    }
    AsyncStorage.multiGet([ID, NAME, PHOTO, USERNAME]).then((res) => {
      id = res[0][1]
      name = res[1][1]
      photo = res[2][1]
      username = res[3][1]
      socket.connect(id, name, photo, username)
      socket.getSocket().on('update', (res) => {
        this.setState({ invite: false })
        this.props.navigation.navigate('Group', {
          response: res,
          id: id,
          name: name,
          photo: photo,
          username: username,
        })
      })
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
        {/* dummy image below */}
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
        <Join
          visible={this.state.join}
          username={this.state.inviteInfo.username}
          name={this.state.inviteInfo.name}
          cancel={() => this.setState({ join: false })}
          onPress={() => this.setState({ join: false })}
        />
        {this.state.errorAlert && (
          <Alert
            title="Error, please try again"
            buttonAff="Close"
            height="20%"
            press={() => this.setState({ errorAlert: false })}
            cancel={() => this.setState({ errorAlert: false })}
          />
        )}
      </View>
    )
  }
}

Home.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
  }),
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
