import React from 'react'
import {
  ActivityIndicator,
  FlatList,
  ImageBackground,
  Modal,
  StyleSheet,
  Text,
  TouchableHighlight,
  TouchableOpacity,
  View,
  Dimensions,
} from 'react-native'
import { bindActionCreators } from 'redux'
import { BlurView } from '@react-native-community/blur'
import Clipboard from '@react-native-community/clipboard'
import { connect } from 'react-redux'
import Ionicons from 'react-native-vector-icons/Ionicons'
import Icon from 'react-native-vector-icons/FontAwesome'
import Icon5 from 'react-native-vector-icons/FontAwesome5'
import PropTypes from 'prop-types'
import Drawer from './Drawer.js'
import Alert from '../modals/Alert.js'
import colors from '../../styles/colors.js'
import global from '../../global.js'
import GroupCard from '../cards/GroupCard.js'
import ChooseFriends from '../modals/ChooseFriends.js'
import FilterSelector from './Filter.js'
import socket from '../apis/socket.js'
import screenStyles from '../../styles/screenStyles.js'
import modalStyles from '../../styles/modalStyles.js'
import normalize from '../../styles/normalize.js'
import {
  showKick,
  updateSession,
  setHost,
  setDisable,
  hideDisable,
  hideRefresh,
  showRefresh,
} from '../redux/Actions.js'

const font = 'CircularStd-Medium'
var memberList = []
var memberRenderList = []
var socketErrMsg = 'Error, please try again'

const windowWidth = Dimensions.get('window').width
const windowHeight = Dimensions.get('window').height

class Group extends React.Component {
  constructor(props) {
    super(props)
    this.filterRef = React.createRef()
    this.state = {
      // Group data
      filters: {},

      // UI state
      canStart: false,
      userSubmitted: false,
      blur: false,
      pressedStart: false,

      // Modal visibility vars
      leaveAlert: false,
      chooseFriends: false,
      socketErr: false,

      // Open
      drawerOpen: false,
    }
    this.updateMemberList()

    // listens for group updates
    socket.getSocket().on('update', (res) => {
      console.log('socket "update": ' + JSON.stringify(res))
      // check if kicked from host
      if (!res.members[global.uid]) {
        socket.getSocket().off()
        socket.kickLeave()
        this.props.showKick()
        this.props.navigation.replace('Home')
        this.props.updateSession({})
        return
      }
      if (res.host != this.props.session.host)
        this.props.setHost(res.members[res.host].username === this.props.username)
      this.props.updateSession(res)
      let count = this.countNeedFilters(res.members)
      if (!count) {
        this.setState({ canStart: true })
      }
      this.updateMemberList()
    })

    socket.getSocket().once('start', (res) => {
      socket.getSocket().off()
      this.props.updateSession(res)
      this.props.hideRefresh()
      this.props.navigation.replace('Round')
    })

    socket.getSocket().on('reselect', () => {
      // alert for host to reselect filters
      socketErrMsg = 'No restaurants were found. Please broaden your filters.'
      this.props.hideDisable()
      this.props.hideRefresh()
      this.setState({ socketErr: true })
    })

    socket.getSocket().on('exception', (msg) => {
      if (msg === 'submit') socketErrMsg = 'Unable to submit filters, please try again.'
      else if (msg === 'start') socketErrMsg = 'Unable to start round, please try again.'
      else if (msg === 'kick') socketErrMsg = 'Unable to kick member, please try again.'
      this.setState({ socketErr: true })
      this.props.hideDisable()
    })
  }

  setUserSubmit() {
    this.setState({ userSubmitted: true })
  }

  // counts number of users who haven't submitted filters
  countNeedFilters(users) {
    let count = 0
    for (const user in users) {
      if (!users[user].filters && user != this.props.session.host) {
        count++
      }
    }
    return count
  }

  // pings server to fetch restaurants, start session
  start() {
    this.props.setDisable()
    this.props.showRefresh()
    this.filterRef.current.startSession(this.props.session)
  }

  // update user cards in group
  updateMemberList() {
    memberList = []
    memberRenderList = []
    // console.log(JSON.stringify(this.props.session.members))
    for (const uid in this.props.session.members) {
      const a = {}
      a.name = this.props.session.members[uid].name
      a.username = this.props.session.members[uid].username
      a.uid = uid
      a.photo = this.props.session.members[uid].photo
      a.filters = this.props.session.members[uid].filters
      a.host = this.props.session.host
      a.isHost = this.props.isHost
      a.key = uid
      memberList.push(a)
      a.f = false
      memberRenderList.push(a)
    }
    const footer = {}
    footer.f = 'a'
    memberRenderList.push(footer)
  }

  leave() {
    this.props.setDisable()
    socket.getSocket().off()
    socket.leave('group')
    this.props.navigation.replace('Home')
    this.props.hideDisable()
  }

  cancelAlert() {
    this.setState({ leaveAlert: false, blur: false })
  }

  firstName(str) {
    const first_sp = str.indexOf(' ')
    if (first_sp != -1) return str.substr(0, first_sp)
    else return str
  }

  copyToClipboard() {
    Clipboard.setString(this.props.session.code.toString())
  }

  render() {
    this.updateMemberList()
    return (
      <View style={styles.all}>
        <View style={styles.header}>
          {/* <View style={styles.headerFill}> */}
          <ImageBackground
            pointerEvents="box-none"
            source={require('../assets/backgrounds/Gradient.png')}
            style={styles.headerFill}
          >
            <Text style={styles.groupTitle}>
              {this.props.isHost
                ? 'Your Group'
                : `${this.firstName(
                    this.props.session.members[this.props.session.host].name,
                  )}'s Group`}
            </Text>
            <View style={styles.subheader}>
              <Text style={styles.pinText}>Group PIN: </Text>
              <Text style={styles.codeText}>{this.props.session.code + ' '}</Text>
              <TouchableOpacity
                style={styles.copyButton} 
                onPress={() => this.copyToClipboard()}
              >
                <Ionicons name="copy-outline" style={styles.copyIcon} />
              </TouchableOpacity>
            </View>
          </ImageBackground>
          {/* </View> */}
        </View>
        <Drawer
          style={styles.drawer}
          initialDrawerPos={100}
          enabled={!this.state.blur}
          onOpen={() => this.setState({ drawerOpen: true })}
          onClose={() => this.setState({ drawerOpen: false })}
          renderContainerView={
            <View style={styles.main}>
              <View style={styles.center}>
              <View style ={styles.members}>
                <Icon5 name="door-open" style={[styles.icon, { color: 'dimgray'}]} />
                <TouchableHighlight
                  disabled={this.props.disable || this.state.drawerOpen}
                  style={styles.leave}
                  activeOpacity={1}
                  onPress={() => {
                    if (!this.state.drawerOpen) {
                      this.setState({ blur: true, leaveAlert: true })
                    }
                  }}
                  underlayColor="white"
                >
                  <Text
                    style={[
                      styles.leaveText,
                      this.state.leave ? { color: colors.hex } : { color: '#6A6A6A' },
                    ]}
                  >
                    Leave
                  </Text>
                </TouchableHighlight>
              </View>
                <View style ={styles.members}>
                  <Icon name="user" style={[styles.icon, { color: colors.hex }]} />
                  <Text
                    style={styles.numMembers}
                  >
                    {memberList.length}
                  </Text>
                  <Text style={styles.divider}>|</Text>
                  <Text style={styles.waiting}>
                    {this.countNeedFilters(this.props.session.members) == 0
                      ? 'waiting for host to start'
                      : `waiting for ${this.countNeedFilters(
                          this.props.session.members,
                        )} member filters`}
                  </Text>
                </View>
              </View>
              <FlatList
                style={styles.memberContainer}
                numColumns={2}
                ListHeaderComponentStyle={{
                  color: colors.hex,
                  marginBottom: 10,
                }}
                columnWrapperStyle={{
                  justifyContent: 'center',
                }}
                data={memberRenderList}
                renderItem={({ item }) => {
                  if (item.f) {
                    return (
                      <TouchableHighlight
                        underlayColor={colors.gray}
                        onPress={() => this.setState({ chooseFriends: true, blur: true })}
                        style={styles.addButton}
                      >
                        <Text
                          style={styles.add}
                        >
                          + Add Friends
                        </Text>
                      </TouchableHighlight>
                    )
                  } else {
                    return (
                      <GroupCard
                        filters={item.filters}
                        host={this.props.session.host}
                        image={item.photo}
                        isHost={this.props.isHost}
                        key={item.key}
                        name={item.name}
                        username={item.username}
                        uid={item.uid}
                      />
                    )
                  }
                }}
                keyExtractor={(item, index) => index}
              />

              {/* =====================================BOTTOM===================================== */}
              {this.state.leaveAlert && (
                <Alert
                  title="Leave?"
                  body="You will will not be able to return without an invite"
                  buttonAff="Yes"
                  height="25%"
                  press={() => this.leave()}
                  cancel={() => this.cancelAlert()}
                />
              )}
              {this.state.socketErr && (
                <Alert
                  title="Error Encountered!"
                  body={socketErrMsg}
                  buttonAff="Close"
                  height="25%"
                  press={() =>
                    this.setState({
                      socketErr: false,
                    })
                  }
                  cancel={() =>
                    this.setState({
                      socketErr: false,
                    })
                  }
                />
              )}
              <ChooseFriends
                code={this.props.session.code}
                visible={this.state.chooseFriends}
                members={memberList}
                press={() => this.setState({ chooseFriends: false, blur: false })}
              />
            </View>
          }
          offset={windowHeight / 6}
          objectHeight={this.props.isHost ? 325 : 275}
          renderDrawerView={
            <View>
              <View>
                <View
                  style={{
                    backgroundColor: 'white',
                    width: windowWidth,
                    height: this.props.isHost ? 325 : 275,
                    zIndex: 30,
                    elevation: 30,
                  }}
                >
                  <FilterSelector
                    host={this.props.session.host}
                    isHost={this.props.isHost}
                    handleUpdate={() => this.setUserSubmit()}
                    members={memberList}
                    ref={this.filterRef}
                    setBlur={(res) => this.setState({ blur: res })}
                    code={this.props.session.code}
                    style={{ elevation: 31 }}
                    buttonDisable={(able) =>
                      able ? this.props.setDisable() : this.props.hideDisable()
                    }
                    session={this.props.session}
                  />
                </View>
              </View>
              <View
                style={styles.container}
              >
                <View style={styles.footerContainer}>
                  <Text
                    style={styles.pullDown}
                  >
                    {this.props.isHost ? 'Pull down for host menu' : 'Pull down to set filters'}
                  </Text>
                </View>
              </View>
            </View>
          }
        />
        <View style={styles.bottom}>
          <Text style={styles.bottomText}>
            When everyone has submitted filters, the round will begin!
          </Text>
          <View>
            {this.props.isHost && (
              <TouchableHighlight
                underlayColor="white"
                onShowUnderlay={() => this.setState({ pressedStart: true })}
                onHideUnderlay={() => this.setState({ pressedStart: false })}
                activeOpacity={1}
                onPress={() => {
                  if (!this.state.drawerOpen) this.start()
                }}
                disabled={this.props.disable || this.state.drawerOpen}
                style={[
                  screenStyles.bigButton,
                  styles.bigButton,
                  this.countNeedFilters(this.props.session.members) == 0
                    ? { opacity: 1 }
                    : { opacity: 0.75 },
                ]}
              >
                {/* TODO: Change text if required options have not been set */}
                <Text
                  style={[
                    styles.buttonText,
                    this.state.pressedStart ? screenStyles.hex : styles.white,
                  ]}
                >
                  Start Round
                </Text>
              </TouchableHighlight>
            )}
            {!this.props.isHost && (
              <TouchableHighlight
                disabled={this.props.disable || this.state.drawerOpen}
                underlayColor="white"
                onShowUnderlay={() => this.setState({ pressedStart: true })}
                onHideUnderlay={() => this.setState({ pressedStart: false })}
                style={[
                  screenStyles.bigButton,
                  styles.bigButton,
                  !this.state.userSubmitted || this.state.drawerOpen
                    ? { opacity: 1 }
                    : { opacity: 0.4 },
                ]}
                onPress={() => {
                  if (!this.state.userSubmitted && !this.state.drawerOpen)
                    this.filterRef.current.submitUserFilters()
                }}
              >
                <Text
                  style={[
                    styles.buttonText,
                    this.state.pressedStart ? screenStyles.hex : styles.white,
                  ]}
                >
                  {!this.state.userSubmitted ? 'Submit Filters' : 'Waiting...'}
                </Text>
              </TouchableHighlight>
            )}
          </View>
          
        </View>
        <Modal transparent={true} animationType={'none'} visible={this.props.refresh}>
          <ActivityIndicator
            color="white"
            size={50}
            animating={this.props.refresh}
            style={screenStyles.loading}
          />
        </Modal>
        {(this.state.blur || this.state.socketErr || this.props.refresh) && (
          <BlurView
            pointerEvents="none"
            blurType="dark"
            blurAmount={10}
            reducedTransparencyFallbackColor="white"
            style={modalStyles.blur}
          />
        )}
      </View>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    isHost: state.isHost.isHost,
    session: state.session.session,
    username: state.username.username,
    disable: state.disable,
    refresh: state.refresh,
  }
}

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      showKick,
      updateSession,
      setHost,
      setDisable,
      hideDisable,
      hideRefresh,
      showRefresh,
    },
    dispatch,
  )

export default connect(mapStateToProps, mapDispatchToProps)(Group)

Group.propTypes = {
  navigation: PropTypes.object,
  showKick: PropTypes.func,
  updateSession: PropTypes.func,
  setHost: PropTypes.func,
  isHost: PropTypes.bool,
  session: PropTypes.object,
  username: PropTypes.string,
  setDisable: PropTypes.func,
  hideDisable: PropTypes.func,
  showRefresh: PropTypes.func,
  hideRefresh: PropTypes.func,
  disable: PropTypes.bool,
  refresh: PropTypes.bool,
}

const styles = StyleSheet.create({
  // Containers
  all: {
    height: '100%',
    width: '100%',
    backgroundColor: 'white'
  },
  main: {
    marginTop: windowWidth * 0.0966,
    flexDirection: 'column',
    height: '100%',
    flex: 1,
    backgroundColor: 'white',
    color: '#aaa',
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    zIndex: 20,
    elevation: 20,
  },
  headerFill: {
    alignSelf: 'center',
    flexDirection: 'column',
    alignItems: 'center',
    overflow: 'hidden',
    height: windowHeight / 6,
    width: '100%',
  },
  groupTitle: {
    color: '#fff',
    fontSize: normalize(30),
    marginTop: '7%',
    fontWeight: 'bold',
    fontFamily: font,
    alignSelf: 'center',
  },
  leave: {
    alignSelf: 'center',
    marginLeft: '3%',
  },
  leaveText: {

    marginLeft: '3%',
    alignSelf: 'center',
    fontFamily: font,
  },
  icon: {
    color: '#aaa',
    marginLeft: '5%',
    marginTop: '2%',
    fontSize: normalize(27),
  },
  divider: {
    color: colors.hex,
    alignSelf: 'center',
    marginLeft: '3%',
    fontSize: normalize(25),
    fontFamily: font,
  },
  waiting: {
    color: colors.hex,
    marginLeft: '3%',
    alignSelf: 'center',
    fontFamily: font,
  },
  button: {
    borderRadius: 25,
    borderWidth: 2.5,
    borderColor: '#aaa',
    paddingVertical: 5,
    paddingHorizontal: 8,
    width: '30%',
    alignSelf: 'center',
    alignContent: 'center',
    marginTop: '3%',
  },
  buttonText: {
    alignSelf: 'center',
    fontSize: normalize(20),
    fontWeight: 'bold',
  },
  bottomText: {
    color: colors.hex,
    width: '70%',
    alignSelf: 'center',
    fontWeight: 'bold',
    textAlign: 'center',
    fontFamily: font,
  },
  bigButton: {
    paddingVertical: 10,
    paddingHorizontal: 4,
    width: '50%',
    marginTop: '3%',
    backgroundColor: colors.hex,
    borderColor: colors.hex,
  },
  center: {
    marginTop: '3%',
    marginLeft: '5%',
    marginRight: '5%',
    marginBottom: '1%',
    flexDirection: 'row',
    justifyContent: 'space-between'

  },
  bottom: {
    position: 'absolute',
    bottom: '5%',
    left: 0,
    right: 0,
    flexDirection: 'column',
    color: '#aaa',
  },
  memberContainer: {
    marginLeft: '1%',
    marginRight: '1%',
    alignSelf: 'center',
    height: '55%',
    overflow: 'hidden',
    width: '90%',
    flexGrow: 0,
  },
  subheader: {
    color: '#FFF',
    marginTop: '1%',
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  pinText: {
    color: '#fff',
    fontSize: normalize(15),
    fontWeight: 'normal',
    fontFamily: font,
    alignSelf: 'center',
  },
  codeText: {
    color: '#ffffff',
    fontFamily: font,
    fontWeight: 'bold',
    fontSize: normalize(15),
  },
  copyIcon: {
    color: '#fff',
    fontSize: normalize(15),
    marginLeft: '7%',
  },
  copyButton: {
    flexDirection: 'column',
    justifyContent: 'center',
    width: 15,
    height: 15,
  },
  drawer: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
  footerContainer: {
    fontFamily: font,
    height: windowWidth * 0.116,
    backgroundColor: 'white',
    marginTop: '-1%',
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
    flexDirection: 'column',
    justifyContent: 'flex-end',
    zIndex: 30,
    elevation: 30,
  },
  white: {
    color: 'white',
  },
  members: {
    flexDirection: 'row'
  },
  numMembers: {
    color: colors.hex,
    fontWeight: 'bold',
    fontFamily: font,
  },
  pullDown:{
    color: colors.hex,
    fontFamily: font,
    fontSize: normalize(15),
    elevation: 32,
    padding: '4%',
  },
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  add: {
    color: 'dimgray',
    textAlign: 'center',
    width: '100%',
  },
  addButton: {
    backgroundColor: '#ECECEC',
    borderRadius: 7,
    alignItems: 'center',
    justifyContent: 'center',
    width: windowWidth * 0.4,
    height: windowWidth * 0.116,
    margin: '1.5%',
  }
})
