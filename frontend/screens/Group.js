import React from 'react'
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableHighlight,
  TouchableOpacity,
  View,
  Dimensions,
} from 'react-native'
import { BlurView } from '@react-native-community/blur'
import Clipboard from '@react-native-community/clipboard'
import Ionicons from 'react-native-vector-icons/Ionicons'
import Icon from 'react-native-vector-icons/FontAwesome'
import PropTypes from 'prop-types'
import Drawer from './Drawer.js'
import Alert from '../modals/Alert.js'
import colors from '../../styles/colors.js'
import GroupCard from '../cards/GroupCard.js'
import ChooseFriends from '../modals/ChooseFriends.js'
import FilterSelector from './Filter.js'
import socket from '../apis/socket.js'
import screenStyles from '../../styles/screenStyles.js'
import modalStyles from '../../styles/modalStyles.js'
import normalize from '../../styles/normalize.js'

const font = 'CircularStd-Medium'
let memberList = []
let memberRenderList = []

const windowWidth = Dimensions.get('window').width
const windowHeight = Dimensions.get('window').height

export default class Group extends React.Component {
  constructor(props) {
    super(props)
    const members = this.props.navigation.state.params.response.members
    this.filterRef = React.createRef()
    this.state = {
      myUsername: this.props.navigation.state.params.username,
      // Group data
      // Member Dictionary
      members: members,

      host: this.props.navigation.state.params.response.host,
      hostName: members[this.props.navigation.state.params.response.host].username,

      filters: {},
      code: this.props.navigation.state.params.response.code,

      // UI state
      canStart: false,
      userSubmitted: false,
      blur: false,

      // Modal visibility vars
      leaveAlert: false,
      endAlert: false,
      chooseFriends: false,
    }

    this.updateMemberList()

    // listens if user is to be kicked
    socket.getSocket().once('kick', () => {
      this.leaveGroup()
    })

    // listens for group updates
    socket.getSocket().on('update', (res) => {
      console.log('socket "update": ' + JSON.stringify(res))
      this.setState({
        members: res.members,
        host: res.host,
        hostName: res.members[res.host].username,
        code: res.code,
      })

      const count = this.countNeedFilters(res.members)
      if (!count) {
        this.setState({ canStart: true })
      }
      this.updateMemberList()
    })

    socket.getSocket().once('start', (restaurants) => {
      if (restaurants.length > 0) {
        socket.getSocket().off()
        this.props.navigation.replace('Round', {
          results: restaurants,
          host: this.state.host,
          isHost: this.state.hostName === this.state.myUsername,
          code: this.state.code,
        })
      } else {
        console.log('group.js: no restaurants found')
        // need to handle no restaurants returned
      }
    })

    socket.getSocket().once('leave', () => {
      this.leaveGroup()
    })
  }

  blur(isBlurred) {
    this.setState({ blur: isBlurred })
  }

  setUserSubmit() {
    this.setState({ userSubmitted: true })
  }

  // counts number of users who haven't submitted filters
  countNeedFilters(users) {
    let count = 0
    for (const user in users) {
      if (!users[user].filters && user != this.state.host) {
        count++
      }
    }
    return count
  }

  // pings server to fetch restaurants, start session
  start() {
    // this.filterRef.current.setState({ locationAlert: true })
    // console.log('start pressed')
    this.filterRef.current.startSession()
  }

  // update user cards in group
  updateMemberList() {
    memberList = []
    memberRenderList = []
    for (const user in this.state.members) {
      const a = {}
      a.name = this.state.members[user].name
      a.username = this.state.members[user].username
      a.user = user
      a.photo = this.state.members[user].photo
      a.filters = this.state.members[user].filters
      a.host = this.state.host
      a.isHost = this.state.hostName == this.state.myUsername
      a.key = user
      memberList.push(a)
      a.f = false
      memberRenderList.push(a)
    }
    const footer = {}
    footer.f = true
    memberRenderList.push(footer)
  }

  leaveGroup() {
    socket.getSocket().off()
    socket.leaveRoom(this.state.code)
    this.props.navigation.replace('Home')
  }

  // shows proper alert based on if user is host
  cancelAlert() {
    this.state.hostName === this.state.myUsername
      ? this.setState({ endAlert: false })
      : this.setState({ leaveAlert: false })
  }

  firstName(str) {
    const first_sp = str.indexOf(' ')
    return str.substr(0, first_sp)
  }

  copyToClipboard() {
    Clipboard.setString(this.state.code.toString())
  }

  render() {
    this.updateMemberList()
    return (
      <View>
        <View style={styles.header}>
          <View style={styles.headerFill}>
            <Text style={styles.groupTitle}>
              {this.state.hostName === this.state.myUsername
                ? 'Your Group'
                : `${this.firstName(this.state.members[this.state.host].name)}'s Group`}
            </Text>
            <View style={styles.subheader}>
              <Text style={styles.pinText}>Group PIN: </Text>
              <Text style={styles.codeText}>{this.state.code + ' '}</Text>
              <TouchableOpacity
                style={{
                  flexDirection: 'column',
                  justifyContent: 'center',
                  width: 15,
                  height: 15,
                }}
                onPress={() => this.copyToClipboard()}
              >
                <Ionicons name="copy-outline" style={styles.copyIcon} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <Drawer
          style={styles.drawer}
          initialDrawerPos={100}
          renderContainerView={() => (
            <View style={styles.main}>
              <View style={styles.center}>
                <Icon name="user" style={[styles.icon, { color: colors.hex }]} />
                <Text
                  style={{
                    color: colors.hex,
                    fontWeight: 'bold',
                    fontFamily: font,
                  }}
                >
                  {memberList.length}
                </Text>
                <Text style={styles.divider}>|</Text>
                <Text style={styles.waiting}>
                  waiting for {this.countNeedFilters(this.state.members)} member filters
                </Text>
              </View>
              <FlatList
                style={[styles.center, { marginTop: 0, height: 0.5 * windowHeight }]}
                numColumns={2}
                ListHeaderComponentStyle={{
                  color: colors.hex,
                  marginBottom: 10,
                }}
                data={memberRenderList}
                contentContainerStyle={[styles.memberContainer]}
                renderItem={({ item }) => {
                  if (item.f) {
                    return (
                      <View>
                        <TouchableHighlight
                          style={{
                            backgroundColor: '#DCDCDC',
                            borderRadius: 7,
                            alignSelf: 'center',
                            width: 160,
                            height: 35,
                          }}
                          onPress={() => this.setState({ chooseFriends: true })}
                        >
                          <Text
                            style={{
                              color: 'black',
                              textAlign: 'center',
                              width: '100%',
                              lineHeight: normalize(36),
                            }}
                          >
                            + Add Friends
                          </Text>
                        </TouchableHighlight>
                      </View>
                    )
                  } else {
                    return (
                      <GroupCard
                        filters={item.filters}
                        host={this.state.host}
                        image={item.photo}
                        isHost={this.state.hostName == item.username}
                        key={item.key}
                        name={item.name}
                        username={item.username}
                        style={{ width: 160 }}
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
                  height="20%"
                  press={() => this.leaveGroup()}
                  cancel={() => this.cancelAlert()}
                />
              )}
              {this.state.endAlert && (
                <Alert
                  title="End the session?"
                  body="You will not be able to return"
                  buttonAff="Yes"
                  height="20%"
                  press={() => this.leaveGroup()}
                  cancel={() => this.cancelAlert()}
                />
              )}
              {this.state.chooseFriends && (
                <BlurView
                  blurType="dark"
                  blurAmount={10}
                  reducedTransparencyFallbackColor="white"
                  style={modalStyles.blur}
                />
              )}
              <ChooseFriends
                code={this.props.navigation.state.params.response.code}
                visible={this.state.chooseFriends}
                members={memberList}
                press={() => this.setState({ chooseFriends: false })}
              />
            </View>
          )}
          objectHeight={this.state.hostName == this.state.myUsername ? 400 : 350}
          offset={120}
          renderDrawerView={() => (
            <View>
              <View>
                <View
                  style={{
                    backgroundColor: 'white',
                    width: windowWidth,
                    zIndex: 30,
                    elevation: 30,
                    height: this.state.hostName == this.state.myUsername ? 400 : 350,
                  }}
                >
                  <FilterSelector
                    host={this.state.host}
                    isHost={this.state.hostName == this.state.myUsername}
                    handleUpdate={() => this.setUserSubmit()}
                    members={memberList}
                    ref={this.filterRef}
                    code={this.state.code}
                    setBlur={(res) => this.blur(res)}
                    style={{ elevation: 31 }}
                  />
                </View>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                }}
              >
                <View style={styles.footerContainer}>
                  <Text
                    style={{
                      color: colors.hex,
                      fontFamily: font,
                      fontSize: 11,
                    }}
                  >
                    {this.state.myUsername === this.state.hostName
                      ? 'Pull down for host menu'
                      : 'Pull down to set filters'}
                  </Text>
                </View>
              </View>
            </View>
          )}
        />
        <View style={styles.bottom}>
          <Text style={styles.bottomText}>
            When everyone has submitted filters, the round will begin!
          </Text>
          <View>
            {this.state.hostName === this.state.myUsername && (
              <TouchableHighlight
                underlayColor={colors.hex}
                activeOpacity={1}
                onPress={() => this.start()}
                style={[
                  screenStyles.bigButton,
                  styles.bigButton,
                  this.countNeedFilters(this.state.members) == 0
                    ? { opacity: 1 }
                    : { opacity: 0.75 },
                ]}
              >
                {/* TODO: Change text if required options have not been set */}
                <Text style={styles.buttonText}>Start Round</Text>
              </TouchableHighlight>
            )}
            {this.state.hostName !== this.state.myUsername && (
              <TouchableHighlight
                style={[
                  screenStyles.bigButton,
                  styles.bigButton,
                  !this.state.userSubmitted ? { opacity: 1 } : { opacity: 0.4 },
                ]}
                onPress={() => {
                  if (!this.state.userSubmitted) this.filterRef.current.submitUserFilters()
                }}
              >
                <Text style={styles.buttonText}>
                  {!this.state.userSubmitted ? 'Submit Filters' : 'Waiting...'}
                </Text>
              </TouchableHighlight>
            )}
          </View>
          <TouchableHighlight
            style={styles.leave}
            activeOpacity={1}
            onPress={() => {
              // console.log('left')
              this.state.hostName === this.state.myUsername
                ? this.setState({ endAlert: true })
                : this.setState({ leaveAlert: true })
            }}
            underlayColor="white"
          >
            <Text
              style={[
                styles.leaveText,
                this.state.leaveGroup ? { color: colors.hex } : { color: '#6A6A6A' },
              ]}
            >
              {this.state.hostName === this.state.myUsername ? 'Cancel Group' : 'Leave Group'}
            </Text>
          </TouchableHighlight>
        </View>
        {this.state.blur && (
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

Group.propTypes = {
  navigation: PropTypes.object,
  members: PropTypes.array,
  host: PropTypes.string,
}

const styles = StyleSheet.create({
  // Containers
  main: {
    marginTop: 35,
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
    justifyContent: 'space-between',
    backgroundColor: colors.hex,
    height: 120,
    width: '100%',
    paddingBottom: 20,
  },
  groupTitle: {
    color: '#fff',
    fontSize: 30,
    marginTop: '7%',
    fontWeight: 'bold',
    fontFamily: font,
    alignSelf: 'center',
  },
  leave: {
    alignSelf: 'center',
    marginTop: '1%',
    borderRadius: 25,
    width: '55%',
  },
  leaveText: {
    fontFamily: font,
    textAlign: 'center',
    fontSize: 16,
    paddingTop: '2%',
    paddingBottom: '2%',
  },
  icon: {
    color: '#aaa',
    marginLeft: '5%',
    marginTop: '2%',
    fontSize: 30,
  },
  divider: {
    color: colors.hex,
    alignSelf: 'center',
    marginLeft: '3%',
    fontSize: 25,
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
    color: '#fff',
    alignSelf: 'center',
    fontSize: 20,
    fontWeight: 'bold',
  },
  bottomText: {
    color: '#aaa',
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
  },
  center: {
    margin: 15,
    marginLeft: 25,
    marginRight: 25,
    flexDirection: 'row',
  },
  bottom: {
    position: 'absolute',
    bottom: '0%',
    left: 0,
    right: 0,
    flexDirection: 'column',
    color: '#aaa',
  },
  memberContainer: {
    width: '100%',
  },
  subheader: {
    color: '#FFF',
    marginTop: 5,
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  pinText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: 'normal',
    fontFamily: font,
    alignSelf: 'center',
  },
  codeText: {
    color: '#ffffff',
    fontFamily: font,
    fontWeight: 'bold',
    fontSize: 15,
  },
  copyIcon: {
    color: '#fff',
    fontSize: 15,
    marginLeft: '7%',
  },
  drawer: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
  footerContainer: {
    color: 'white',
    fontFamily: font,
    height: 30,
    backgroundColor: 'white',
    padding: 15,
    paddingTop: 25,
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
    flexDirection: 'column',
    justifyContent: 'flex-end',
    zIndex: 30,
    elevation: 30,
  },
})
