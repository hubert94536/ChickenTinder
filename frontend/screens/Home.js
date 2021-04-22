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
  setDisable,
  hideDisable,
  showRefresh,
  hideRefresh,
} from '../redux/Actions.js'
import { connect } from 'react-redux'
import {
  ActivityIndicator,
  Dimensions,
  ImageBackground,
  Modal,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
} from 'react-native'
import PropTypes from 'prop-types'
import socket from '../apis/socket.js'
import Alert from '../modals/Alert.js'
import colors from '../../styles/colors.js'
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
var socketErrMsg = 'Socket error message uninitialized'

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
      socketErr: false,
    }
    socket.getSocket().on('update', (res) => {
      socket.getSocket().off()
      this.props.updateSession(res)
      this.props.setHost(res.members[res.host].username === this.props.username)
      this.props.hideDisable()
      this.props.hideRefresh()
      this.props.navigation.replace('Group')
    })

    socket.getSocket().on('exception', (msg) => {
      this.props.hideDisable()
      this.props.hideRefresh()
      if (msg === 'create') socketErrMsg = 'Unable to create a group, please try again'
      else if (msg === 'join') socketErrMsg = 'Unable to join a group, please try again'
      this.setState({ socketErr: true })
    })

    //uncomment if testing friends/requests
    // accountsApi.createFBUserTest('Hubes2', 32, 'hbc', 'hhcc@gmail.com', '50', '35434354')
    // accountsApi.createFBUserTest('Hanna2', 33, 'hannaaa', 'hannco@gmail.com', '51', '17891234')
    // accountsApi.createFBUserTest('Anna2', 34, 'annaxand', 'annaxand@yahoo.com', '52', '17891235')
    // accountsApi.createFBUserTest('Helen2', 35, 'helennn', 'helennn@gmail.com', '53', '45678903')
    // accountsApi.createFBUserTest('Kevin2', 36, 'kev', 'kevi@gmail.com', '54', '45678904')
    // // friendsApi.createFriendshipTest(requester, accepter)
    // friendsApi.createFriendshipTest(32, "qShmVlrrjpY0sj8ES2lWFUmBJCh1")
    // friendsApi.createFriendshipTest(33, "qShmVlrrjpY0sj8ES2lWFUmBJCh1")
    // friendsApi.createFriendshipTest(34, "qShmVlrrjpY0sj8ES2lWFUmBJCh1")
  }

  componentDidMount() {
    // this.props.hideRefresh()
  }

  createGroup() {
    this.props.setDisable()
    this.props.showRefresh()
    socket.createRoom()
  }

  render() {
    return (
      <ImageBackground
        source={
          this.state.join || this.props.error || this.props.kick || this.state.socketErr
            ? require(homedark)
            : require(home)
        }
        style={screenStyles.screenBackground}
      >
        <View style={styles.main}>
          <Text style={[screenStyles.text, styles.title]}>Let&apos;s Get Chews-ing</Text>
          <View>
            <TouchableHighlight
              disabled={this.props.disable}
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
              onPress={() => {
                this.createGroup()
              }}
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
          {this.state.socketErr && (
            <Alert
              title="Connection Error!"
              body={socketErrMsg}
              buttonAff="Close"
              height="20%"
              press={() => this.setState({ socketErr: false })}
              cancel={() => this.setState({ socketErr: false })}
            />
          )}
        </View>
        <Modal transparent={true} animationType={'none'} visible={this.props.refresh}>
          <ActivityIndicator
            color="white"
            size={50}
            animating={this.props.refresh}
            style={screenStyles.loading}
          />
        </Modal>
        {(this.state.join ||
          this.props.error ||
          this.props.kick ||
          this.state.socketErr ||
          this.props.refresh) && (
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
    disable: state.disable,
    refresh: state.refresh,
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
      setDisable,
      hideDisable,
      showRefresh,
      hideRefresh,
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
  hideDisable: PropTypes.func,
  setDisable: PropTypes.func,
  showRefresh: PropTypes.func,
  hideRefresh: PropTypes.func,
  disable: PropTypes.bool,
  refresh: PropTypes.bool,
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
