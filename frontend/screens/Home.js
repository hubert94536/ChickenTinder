/* eslint-disable no-unused-vars */
import React from 'react'
import { Dimensions, Image, StyleSheet, Text, TouchableHighlight, View } from 'react-native'
import { USERNAME, NAME, PHOTO, PHONE, EMAIL } from 'react-native-dotenv'
import AsyncStorage from '@react-native-async-storage/async-storage'
import PropTypes from 'prop-types'
import friendsApi from '../apis/friendsApi.js'
import accountsApi from '../apis/accountsApi.js'
import socket from '../apis/socket.js'
import Alert from '../modals/Alert.js'
import colors from '../../styles/colors.js'
import global from '../../global.js'
import Join from '../modals/Join.js'
import TabBar from '../Nav.js'
import screenStyles from '../../styles/screenStyles.js'

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

    socket.getSocket().once('update', (res) => {
      this.setState({ invite: false })
      global.host = res.members[res.host].username
      global.code = res.code
      global.isHost = res.members[res.host].username === global.username
      this.props.navigation.navigate('Group', {
        response: res,
      })
    })

    socket.getSocket().once('update', (res) => {
      this.setState({ invite: false })
      global.host = res.host
      this.props.navigation.navigate('Group', {
        response: res,
        username: global.username,
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
  }

  createGroup() {
    socket.createRoom()
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
          source={require('../assets/Icon_Transparent.png')}
          style={{ width: height * 0.3, height: height * 0.3 }}
        />
        <View>
          <TouchableHighlight
            onShowUnderlay={() => this.setState({ createPressed: true })}
            onHideUnderlay={() => this.setState({ createPressed: false })}
            activeOpacity={1}
            underlayColor="white"
            style={{
              backgroundColor: colors.hex,
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
            style={{
              backgroundColor: 'white',
              borderRadius: 40,
              width: width * 0.5,
              height: 45,
              justifyContent: 'center',
              alignSelf: 'center',
              borderColor: colors.hex,
              borderWidth: 2,
            }}
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
            blur
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
