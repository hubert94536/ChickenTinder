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
import { USERNAME } from 'react-native-dotenv'
import Ionicons from 'react-native-vector-icons/Ionicons'
import Icon from 'react-native-vector-icons/FontAwesome'
import AsyncStorage from '@react-native-community/async-storage'
import PropTypes from 'prop-types'

import Drawer from './Drawer.js'
import Alert from '../modals/alert.js'
import GroupCard from '../cards/groupCard.js'
import ChooseFriends from '../modals/chooseFriends.js'
import FilterSelector from './filter.js'
import socket from '../apis/socket.js'
import screenStyles from '../../styles/screenStyles.js'
import modalStyles from '../../styles/modalStyles.js'

const hex = '#F15763'

const font = 'CircularStd-Medium'
let memberList = []
let memberRenderList = []
let myUsername = ''
AsyncStorage.getItem(USERNAME).then((res) => {
  myUsername = res
})

const windowWidth = Dimensions.get('window').width
const windowHeight = Dimensions.get('window').height

export default class Group extends React.Component {
  constructor(props) {
    super(props)
    this._isMounted = false
    const members = this.props.navigation.state.params.members
    this.filterRef = React.createRef()
    this.state = {
      myUsername: myUsername,

      // Group data
      // Member Dictionary
      members: members,

      host: this.props.navigation.state.params.host,
      hostName: members[this.props.navigation.state.params.host].username,
      // hostName: "NOT YOU",
      needFilters: Object.keys(members).filter((user) => !user.filters).length,

      filters: {},
      code: this.props.navigation.state.params.code,

      // UI state
      canStart: false,
      userSubmitted: false,

      // Modal visibility vars
      leaveAlert: false,
      endAlert: false,
      chooseFriends: false,
    }
    this.updateMemberList()

    // listens if user is to be kicked
    socket.getSocket().on('kick', () => {
      this.leaveGroup
    })

    // listens for group updates
    socket.getSocket().on('update', (res) => {
      console.log('group.js: Update')
      if (this._isMounted) {
        console.log('socket "update": ' + JSON.stringify(res))
        this.setState({ members: res.members, host: res.host, code: res.code })
        const count = this.countNeedFilters(res.members)
        this.setState({ needFilters: count })
        if (!count) {
          this.setState({ canStart: true })
        }
      }
    })

    socket.getSocket().on('start', (restaurants) => {
      // console.log('group.js: ' + JSON.stringify(restaurants))
      if (restaurants.length > 0) {
        this.props.navigation.navigate('Round', {
          results: restaurants,
          host: this.state.host,
          isHost: this.state.hostName === this.state.myUsername,
          code: this.state.code,
        })
      } else {
        console.log('no restaurants found')
        // need to handle no restaurants returned
      }
    })

    socket.getSocket().on('leave', () => {
      if (this._isMounted) {
        this.leaveGroup()
      }
    })

    socket.getSocket().on('leave', () => {
      if (this._isMounted) {
        this.leaveGroup()
      }
    })

    socket.getSocket().on('exception', (error) => {
      if (this._isMounted) {
        console.log(error)
      }
    })
  }

  setUserSubmit() {
    this.setState({ userSubmitted: true })
  }

  // counts number of users who haven't submitted filters
  countNeedFilters(users) {
    let count = 0
    for (const user in users) {
      if (!users[user].filters) {
        count++
      }
    }
    return count
  }

  // pings server to fetch restaurants, start session
  start() {
    // this.filterRef.current.setState({ locationAlert: true })
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
      a.f = false
      memberList.push(a)
      memberRenderList.push(a)
    }
    const footer = {}
    footer.f = true
    memberRenderList.push(footer)
    // console.log('\n\n\n\n\n\n=========================')
    // console.log(memberList)
    // console.log('=========================\n\n\n\n\n\n')
  }

  leaveGroup() {
    socket.leaveRoom(this.state.host)
    this.props.navigation.navigate('Home')
  }

  endGroup() {
    socket.endSession()
  }

  // shows proper alert based on if user is host
  cancelAlert() {
    this.state.hostName === this.state.myUsername
      ? this.setState({ endAlert: false })
      : this.setState({ leaveAlert: false })
  }

  // _handleChooseFriendsPress() {
  //   console.log('added')
  //   // add code to close choose friend modal
  // }

  componentDidMount() {
    console.log('Group - DidMount')
    console.log('Group.js: nav params ' + JSON.stringify(this.props.navigation.state.params))
    this.setState({ _isMounted: true })
  }

  componentWillUnmount() {
    console.log('Group - WillUnmount')
    this.setState({ _isMounted: false })
    // Todo - potentially add leave group?
  }

  firstName(str) {
    const first_sp = str.indexOf(' ')
    return str.substr(0, first_sp)
  }

  render() {
    this.updateMemberList()
    return (
      <View style={{ backgroundColor: '#FFF' }}>
        <View style={[styles.top, styles.floating]}>
          <View
            style={{
              alignSelf: 'center',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'space-between',
              backgroundColor: hex,
              height: 120,
              width: '100%',
              paddingBottom: 20,
            }}
          >
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
                // TODO: add copy to clipboard/share functionality
              >
                <Ionicons name="copy-outline" style={styles.icon2} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <Drawer
          style={styles.drawer}
          initialDrawerPos={100}
          renderContainerView={() => (
            <View style={styles.main}>
              <View style={[styles.center, { flexDirection: 'row' }]}>
                <Icon name="user" style={[styles.icon, { color: '#F15763' }]} />
                <Text
                  style={{
                    color: '#F15763',
                    fontWeight: 'bold',
                    fontFamily: font,
                  }}
                >
                  {memberList.length}
                </Text>
                <Text style={[styles.divider, { color: '#F15763' }]}>|</Text>
                <Text style={[styles.waiting, { color: '#F15763' }]}>
                  waiting for {this.state.needFilters} member filters
                </Text>
              </View>
              <FlatList
                style={[styles.center, { marginTop: 0, height: windowHeight * 0.5 }]}
                numColumns={2}
                ListHeaderComponentStyle={{
                  color: '#F15763',
                  marginBottom: 10,
                }}
                data={memberRenderList}
                contentContainerStyle={styles.iner}
                renderItem={({ item }) => {
                  if (item.f) {
                    return (
                      <View>
                        <TouchableHighlight
                          style={{
                            backgroundColor: '#DCDCDC',
                            borderRadius: 7,
                            alignSelf: 'center',
                            width: 170,
                            height: 35,
                            padding: 0,
                            margin: 5,
                          }}
                          onPress={() =>
                            this.setState({ chooseFriends: true }, () =>
                              console.log('group.js: chooseFriends = ' + this.state.chooseFriends),
                            )
                          }
                        >
                          <Text
                            style={{
                              color: 'black',
                              textAlign: 'center',
                              width: '100%',
                              lineHeight: 36,
                            }}
                          >
                            + Add Friends
                          </Text>
                        </TouchableHighlight>
                        <View
                          style={{
                            width: 170,
                            height: 30,
                            padding: 0,
                            margin: 5,
                            display: 'none',
                          }}
                        >
                          <Text>footer</Text>
                        </View>
                      </View>
                    )
                  } else {
                    return (
                      <GroupCard
                        name={item.name}
                        username={item.username}
                        image={item.photo}
                        filters={item.filters}
                        host={this.state.host}
                        isHost={this.state.hostName == item.username}
                        key={item.key}
                        style={{ width: 170 }}
                      />
                    )
                  }
                }}
                keyExtractor={(item, index) => index}
              />
              <View style={styles.bottom}>
                <Text style={styles.bottomText}>
                  When everyone has submitted filters, the round will begin!
                </Text>
                {this.state.hostName === this.state.myUsername && (
                  <TouchableHighlight
                    underlayColor="#F15763"
                    activeOpacity={1}
                    onPress={() => this.start()}
                    style={[
                      screenStyles.bigButton,
                      styles.bigButton,
                      this.state.canStart ? { opacity: 0.75 } : { opacity: 1 },
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
                      !this.state.userSubmitted ? { opacity: 0.75 } : { opacity: 1 },
                    ]}
                    onPress={() => {
                      this.filterRef.current.submitUserFilters()
                    }}
                  >
                    <Text style={styles.buttonText}>
                      {!this.state.userSubmitted ? 'Submit Filters' : 'Waiting...'}
                    </Text>
                  </TouchableHighlight>
                )}
                <TouchableHighlight
                  onShowUnderlay={() => this.setState({ leaveGroup: true })}
                  onHideUnderlay={() => this.setState({ leaveGroup: false })}
                  style={styles.leave}
                  onPress={() => {
                    console.log(this.state.members)
                    this.state.hostName === this.state.myUsername
                      ? this.setState({ endAlert: true })
                      : this.setState({ leaveAlert: true })
                  }}
                  underlayColor="white"
                >
                  <Text
                    style={[
                      styles.leaveText,
                      this.state.leaveGroup ? { color: hex } : { color: '#6A6A6A' },
                    ]}
                  >
                    {this.state.hostName === this.state.myUsername ? 'Cancel Group' : 'Leave Group'}
                  </Text>
                </TouchableHighlight>
              </View>
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
                visible={this.state.chooseFriends}
                members={memberList}
                press={() => this.setState({ chooseFriends: false })}
              />
            </View>
          )}
          objectHeight={this.state.hostName == this.state.myUsername ? 400 : 400}
          offset={120}
          renderDrawerView={() => (
            <View>
              <View>
                <View
                  style={{
                    width: windowWidth,
                    height: 400,
                    zIndex: 3,
                    borderColor: '#F15763',
                    borderWidth: 1,
                    overflow: 'hidden',
                  }}
                >
                  <FilterSelector
                    host={this.state.host}
                    isHost={this.state.hostName == this.state.myUsername}
                    handleUpdate={() => this.setUserSubmit()}
                    members={memberList}
                    ref={this.filterRef}
                    code={this.state.code}
                  />
                </View>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  margin: '4%',
                  justifyContent: 'center',
                }}
              >
                <View
                  style={{
                    color: 'white',
                    fontFamily: font,
                    marginRight: '3%',
                    height: 70,
                    backgroundColor: 'white',
                    padding: 15,
                    marginTop: -45,
                    borderRadius: 15,
                    borderColor: '#F15763',
                    borderWidth: 1,
                    flexDirection: 'column',
                    justifyContent: 'flex-end',
                    zIndex: 2,
                  }}
                >
                  <Text
                    style={{
                      color: '#F15763',
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
      </View>
    )
  }
}

Group.propTypes = {
  members: PropTypes.array,
  host: PropTypes.string,
}

const styles = StyleSheet.create({
  // Containerse
  main: {
    marginTop: 35,
    flexDirection: 'column',
    flex: 1,
    backgroundColor: 'white',
    color: '#aaa',
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
    marginTop: '3%',
    borderRadius: 25,
    width: '25%',
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
    color: '#aaa',
    alignSelf: 'center',
    marginLeft: '3%',
    fontSize: 25,
    fontFamily: font,
  },
  waiting: {
    color: '#aaa',
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
    width: '50%',
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
    backgroundColor: '#F15763',
  },
  top: {
    backgroundColor: '#fff',
    top: 0,
  },
  center: {
    flex: 0.6,
    margin: 15,
    marginLeft: 25,
    marginRight: 25,
  },
  bottom: {
    flex: 0.5,
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
  icon2: {
    color: '#fff',
    fontSize: 15,
    marginLeft: '7%',
  },
  drawer: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
  floating: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    zIndex: 20,
    elevation: 20,
  },
})
