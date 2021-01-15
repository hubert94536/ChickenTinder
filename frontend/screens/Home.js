/* eslint-disable no-unused-vars */
import React from 'react'
import { Dimensions, Image, StyleSheet, Text, TouchableHighlight, View } from 'react-native'
import { USERNAME, UID } from 'react-native-dotenv'
import AsyncStorage from '@react-native-async-storage/async-storage'
import PropTypes from 'prop-types'
import friendsApi from '../apis/friendsApi.js'
import accountsApi from '../apis/accountsApi.js'
import socket from '../apis/socket.js'
import Alert from '../modals/Alert.js'
import colors from '../../styles/colors.js'
import normalize from '../../styles/normalize.js'
import Join from '../modals/Join.js'
import TabBar from '../Nav.js'
import screenStyles from '../../styles/screenStyles.js'

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
      socket.getSocket().once('update', (res) => {
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

  render() {
    return (
      <View style={[screenStyles.mainContainer, styles.background]}>
        <Text style={[screenStyles.text, screenStyles.title, styles.slogan]}>
          Hungry? Chews wisely.
        </Text>
        {/* dummy image below */}
        <Image source={require('../assets/Icon_Transparent.png')} style={[styles.image]} />
        <View>
          <TouchableHighlight
            onShowUnderlay={() => this.setState({ createPressed: true })}
            onHideUnderlay={() => this.setState({ createPressed: false })}
            activeOpacity={1}
            underlayColor="white"
            style={[styles.buttonCreate]}
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
            underlayColor={colors.hex}
            style={[styles.buttonJoin]}
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
          goHome={() => {}}
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
    height: normalize(65),
    margin: '3%',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  buttonText: {
    textAlign: 'center',
    fontFamily: 'CircularStd-Bold',
    fontSize: normalize(18),
  },
  buttonCreate: {
    backgroundColor: colors.hex,
    borderRadius: normalize(40),
    width: normalize(width * 0.5),
    height: normalize(45),
    justifyContent: 'center',
    alignSelf: 'center',
    margin: '3%',
  },
  buttonJoin: {
    backgroundColor: 'white',
    borderRadius: normalize(40),
    width: normalize(width * 0.5),
    height: normalize(45),
    justifyContent: 'center',
    alignSelf: 'center',
    borderColor: colors.hex,
    borderWidth: 2,
  },
  image: {
    width: normalize(height * 0.3),
    height: normalize(height * 0.3),
  },
  slogan: {
    fontSize: normalize(30),
  },
})

export default Home
