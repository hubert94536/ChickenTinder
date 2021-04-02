/* eslint-disable no-unused-vars */
import React from 'react'
import { bindActionCreators } from 'redux'
import { BlurView } from '@react-native-community/blur'
import {
  changeFriends,
  hideError,
  showError,
  hideKick,
  updateSession,
  setHost,
} from '../redux/Actions.js'
import { connect } from 'react-redux'
import {
  Dimensions,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
} from 'react-native'
import PropTypes from 'prop-types'
import socket from '../apis/socket.js'
import Alert from '../modals/Alert.js'
import colors from '../../styles/colors.js'
import global from '../../global.js'
import Join from '../modals/Join.js'
import normalize from '../../styles/normalize.js'
import TabBar from '../Nav.js'
import modalStyles from '../../styles/modalStyles.js'
import screenStyles from '../../styles/screenStyles.js'
import accountsApi from '../apis/accountsApi.js'
import friendsApi from '../apis/friendsApi.js'
const width = Dimensions.get('window').width
const home = '../assets/backgrounds/Home.png'
const homedark = '../assets/backgrounds/Home_Blur.png'

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
      disabled: false,
    }
    socket.getSocket().on('update', (res) => {
      socket.getSocket().off()
      this.setState({ invite: false })
      this.props.updateSession(res)
      this.props.setHost(res.members[res.host].username === this.props.username)
      this.setState({ disabled: false })
      this.props.navigation.replace('Group')
    })

    socket.getSocket().on('exception', (msg) => {
      // handle button disables here
      if (msg === 'create') {
        // create alert here
      } else if (msg === 'join') {
        // join alert here
      }
    })

    // //uncomment if testing friends/requests
    // accountsApi.createFBUserTest('Hubes2', 32, 'hbc', 'hhcc@gmail.com', '50', '35434354')
    // accountsApi.createFBUserTest('Hanna2', 33, 'hannaaa', 'hannco@gmail.com', '51', '17891234')
    // accountsApi.createFBUserTest('Anna2', 34, 'annaxand', 'annaxand@yahoo.com', '52', '17891235')
    // accountsApi.createFBUserTest('Helen2', 35, 'helennn', 'helennn@gmail.com', '53', '45678903')
    // accountsApi.createFBUserTest('Kevin2', 36, 'kev', 'kevi@gmail.com', '54', '45678904')
    // // friendsApi.createFriendshipTest(requester, accepter)
    // friendsApi.createFriendshipTest(32, "bG0nwNsUpeSYW913nNaLdorlB8H2")
    // friendsApi.createFriendshipTest(33, "bG0nwNsUpeSYW913nNaLdorlB8H2")
    // friendsApi.createFriendshipTest(34, "bG0nwNsUpeSYW913nNaLdorlB8H2")
  }

  createGroup() {
    this.setState({ disabled: true })
    socket.createRoom()
  }

  render() {
    return (
      <ImageBackground
        source={
          this.state.join || this.props.error || this.props.kick ? require(homedark) : require(home)
        }
        style={screenStyles.screenBackground}
      >
        <View style={styles.main}>
          <Text style={[screenStyles.text, styles.title]}>Let&apos;s Get Chews-ing</Text>
          <View>
            <TouchableHighlight
              disabled={this.state.disabled}
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
              underlayColor={'white'}
              style={{
                backgroundColor: 'transparent',
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
              <Text style={[styles.buttonText, { color: 'white' }]}>Join Group</Text>
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
            <Alert
              title="Error, please try again"
              buttonAff="Close"
              height="20%"
              press={() => this.props.hideError()}
              cancel={() => this.props.hideError()}
            />
          )}
          {this.props.kick && (
            <Alert
              title="Oh no!"
              body="You were kicked from the group!"
              buttonAff="Close"
              height="20%"
              press={() => this.props.hideKick()}
              cancel={() => this.props.hideKick()}
            />
          )}
        </View>
        {(this.state.join || this.props.error || this.props.kick) && (
          <BlurView
            blurType="dark"
            blurAmount={10}
            reducedTransparencyFallbackColor="white"
            style={modalStyles.blur}
          />
        )}
      </ImageBackground>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    username: state.username.username,
    error: state.error,
    kick: state.kick,
  }
}

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      changeFriends,
      showError,
      hideError,
      updateSession,
      hideKick,
      setHost,
    },
    dispatch,
  )

export default connect(mapStateToProps, mapDispatchToProps)(Home)

Home.propTypes = {
  navigation: PropTypes.object,
  error: PropTypes.bool,
  username: PropTypes.string,
  showError: PropTypes.func,
  hideError: PropTypes.func,
  changeFriends: PropTypes.func,
  hideKick: PropTypes.func,
  kick: PropTypes.bool,
  setHost: PropTypes.func,
  updateSession: PropTypes.func,
}
const styles = StyleSheet.create({
  main: {
    flex: 1,
    justifyContent: 'space-evenly',
  },
  title: {
    fontSize: normalize(30),
    margin: '15%',
    marginTop: '35%',
    width: '50%',
    textAlign: 'left',
    fontFamily: 'CircularStd-Bold',
    lineHeight: width * 0.11,
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
    fontSize: normalize(18),
  },
})
