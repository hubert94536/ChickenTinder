/* eslint-disable no-unused-vars */
import React from 'react'
import { bindActionCreators } from 'redux'
import { BlurView } from '@react-native-community/blur'
import { changeFriends, hideError, showError } from '../redux/Actions.js'
import { connect } from 'react-redux'
import {
  Dimensions,
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
} from 'react-native'
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
import modalStyles from '../../styles/modalStyles.js'
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
    }

    socket.getSocket().once('update', (res) => {
      this.setState({ invite: false })
      global.host = res.members[res.host].username
      global.code = res.code
      global.isHost = res.members[res.host].username === this.props.username.username
      this.props.navigation.replace('Group', {
        response: res,
      })
    })

    // //uncomment if testing friends/requests
    // accountsApi.createFBUserTest('Hubert', 2, 'hubesc', 'hubesc@gmail.com', '10', '45678907')
    // accountsApi.createFBUserTest('Hanna', 3, 'hco', 'hco@gmail.com', '11', '45678901')
    // accountsApi.createFBUserTest('Anna', 4, 'annax', 'annx@gmail.com', '12', '45678902')
    // accountsApi.createFBUserTest('Helen', 5, 'helenthemelon', 'helenw@gmail.com', '13', '45678903')
    // accountsApi.createFBUserTest('Kevin', 6, 'kevint', 'kevintang@gmail.com', '14', '45678904')
    // friendsApi.createFriendshipTest(requester, accepter)
    // friendsApi.createFriendshipTest(6, "2OAFRR5srASbLLhkXmU62FyD1yI2")
    // friendsApi.createFriendshipTest(3, "2OAFRR5srASbLLhkXmU62FyD1yI2")
    // friendsApi.createFriendshipTest(4, "2OAFRR5srASbLLhkXmU62FyD1yI2")
  }

  createGroup() {
    socket.createRoom()
  }

  render() {
    return (
      <ImageBackground source={require('../assets/backgrounds/Home.png')} style={styles.background}>
        <View style={styles.main}>
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
                borderColor: 'white',
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
            goSearch={() => {
              socket.getSocket().off()
              this.props.navigation.replace('Search')
            }}
            goNotifs={() => {
              socket.getSocket().off()
              this.props.navigation.replace('Notifications')
            }}
            goProfile={() => {
              socket.getSocket().off()
              this.props.navigation.replace('Profile')
            }}
            cur="Home"
          />
          <Join
            visible={this.state.join}
            username={this.state.inviteInfo.username}
            name={this.state.inviteInfo.name}
            cancel={() => this.setState({ join: false })}
            onPress={() => this.setState({ join: false })}
          />

          {this.props.error && (
            <BlurView
              blurType="dark"
              blurAmount={10}
              reducedTransparencyFallbackColor="white"
              style={modalStyles.blur}
            />
          )}
          {this.props.error && (
            <Alert
              title="Error, please try again"
              buttonAff="Close"
              height="20%"
              press={() => this.props.hideError()}
              cancel={() => this.props.hideError()}
            />
          )}
        </View>
      </ImageBackground>
    )
  }
}

const mapStateToProps = (state) => {
  const { friends } = state
  const { error } = state
  const { username } = state
  return { friends, error, username }
}

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      changeFriends,
      showError,
      hideError,
    },
    dispatch,
  )

export default connect(mapStateToProps, mapDispatchToProps)(Home)

Home.propTypes = {
  navigation: PropTypes.object,
  // error: PropTypes.bool,
  // friends: PropTypes.object,
  // username: PropTypes.object,
  showError: PropTypes.func,
  hideError: PropTypes.func,
  changeFriends: PropTypes.func,
}
const styles = StyleSheet.create({
  main: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
  background: {
    flex: 1,
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
})
