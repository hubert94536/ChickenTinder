/* eslint-disable no-unused-vars */
import React from 'react'
import { Dimensions, Image, StyleSheet, Text, TouchableHighlight, View } from 'react-native'
import { NAME, PHOTO, USERNAME, ID } from 'react-native-dotenv'
// import accountsApi from '../apis/accountsApi.js'
import Alert from '../modals/Alert.js'
import AsyncStorage from '@react-native-async-storage/async-storage'
// import friendsApi from '../apis/friendsApi.js'
import Join from '../modals/Join.js'
import PropTypes from 'prop-types'
import screenStyles from '../../styles/screenStyles.js'
import socket from '../apis/socket.js'
import TabBar from '../Nav.js'

var uid = ''
var username = ''

const width = Dimensions.get('window').width
const height = Dimensions.get('window').height

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
    AsyncStorage.multiGet([UID, USERNAME]).then((res) => {
      uid = res[0][1]
      username = res[1][1]
      socket.connect()
      socket.getSocket().on('update', (res) => {
        this.setState({ invite: false })
        this.props.navigation.navigate('Group', {
          response: res,
          username: username,
        })
      })
      //uncomment if testing friends/requests
      // accountsApi.createFBUserTest('Hubert', 2, 'hubesc', 'hubesc@gmail.com', '10', '45678907')
      // accountsApi.createFBUserTest('Hanna', 3, 'hco', 'hco@gmail.com', '11', '45678901')
      // accountsApi.createFBUserTest('Anna', 4, 'annax', 'annx@gmail.com', '12', '45678902')
      // accountsApi.createFBUserTest('Helen', 5, 'helenthemelon', 'helenw@gmail.com', '13', '45678903')
      // accountsApi.createFBUserTest('Kevin', 6, 'kevint', 'kevintang@gmail.com', '14', '45678904')
      // friendsApi.createFriendshipTest(2, uid)
      // friendsApi.createFriendshipTest(3, uid)
      // friendsApi.createFriendshipTest(4, uid)
    })
  }

  createGroup() {
    socket.createRoom()
  }

  componentWillUnmount() {
    // socket.off('update')
  }

  render() {
    return (
      <View style={[screenStyles.mainContainer, screenStyles.background]}>
        <Text style={[screenStyles.text, screenStyles.title, screenStyles.slogan]}>
          Hungry? Chews wisely.
        </Text>
        {/* dummy image below */}
        <Image
          source={require('../assets/Icon_Transparent.png')}
          style={[screenStyles.image]}
        />
        <View>
          <TouchableHighlight
            onShowUnderlay={() => this.setState({ createPressed: true })}
            onHideUnderlay={() => this.setState({ createPressed: false })}
            activeOpacity={1}
            style={[screenStyles.groupCreate]}
            onPress={() => this.createGroup()}
          >
            <Text
              style={[
                styles.buttonText,
                this.state.createPressed ? { color: colors.hex } : { color: 'white' },
              ]}
            >
              Create Group
            </Text>
          </TouchableHighlight>
          <TouchableHighlight
            onShowUnderlay={() => this.setState({ joinPressed: true })}
            onHideUnderlay={() => this.setState({ joinPressed: false })}
            activeOpacity={1}
            style={[screenStyles.groupJoin]}
            onPress={() => this.setState({ join: true })}
          >
            <Text
              style={[
                styles.buttonText,
                this.state.profilePressed ? { color: 'white' } : { color: colors.hex },
              ]}
            >
              Join Group
            </Text>
          </TouchableHighlight>
        </View>
        <TabBar
          goHome={() => this.props.navigation.replace('Home')}
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
  navigation: PropTypes.object,
}

const styles = StyleSheet.create({
  background: {
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
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
  groupCreate: {
    underlayColor="white",
    backgroundColor: '#F15763',
    borderRadius: 40,
    width: width * 0.5,
    height: 45,
    justifyContent: 'center',
    alignSelf: 'center',
    margin: '3%',
  },
  groupJoin: {
    underlayColor="#F15763",
    backgroundColor: 'white',
    borderRadius: 40,
    width: width * 0.5,
    height: 45,
    justifyContent: 'center',
    alignSelf: 'center',
    borderColor: '#F15763',
    borderWidth: 2,
  },
  image: {
    width: height * 0.3, 
    height: height * 0.3,
  },
  slogan: {
    fontSize: normalize(30),
  },
})

export default Home
