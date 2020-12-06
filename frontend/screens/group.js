import React from 'react'
import {
  FlatList,
  ScrollView,
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

import DraggableView from './filterContainer.js'
import Alert from '../modals/alert.js'
import GroupCard from '../cards/groupCard.js'
import ChooseFriends from '../modals/chooseFriends.js'
import FilterSelector from './filter.js'
import socket from '../apis/socket.js'
import screenStyles from '../../styles/screenStyles.js'
import modalStyles from '../../styles/modalStyles.js'

const hex = '#F15763'

const hex = '#F15763'
const font = 'CircularStd-Medium'
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
    this.state = {
      members: members,
      host: this.props.navigation.state.params.host,
      hostName: members[this.props.navigation.state.params.host].username,
      needFilters: Object.keys(members).filter((user) => !user.filters).length,
      start: false,
      username: myUsername,
      // show/hide the alerts
      leaveAlert: false,
      endAlert: false,
      swipe: true,
      filters: {},
      chooseFriends: false,
    }
    this.updateMemberList()

    // listens if user is to be kicked
    socket.getSocket().on('kick', () => {
      this.leaveGroup
    })

    // listens for group updates
    socket.getSocket().on('update', (res) => {
      if (this._isMounted) {
        this.setState({ members: res.members })
        console.log(res)
        const count = this.countNeedFilters(res.members)
        this.setState({ needFilters: count })
        if (!count) {
          this.setState({ start: true })
        }
      }
    })

    socket.getSocket().on('start', (restaurants) => {
      if (restaurants.length > 0) {
        this.props.navigation.navigate('Round', {
          results: restaurants,
          host: this.state.host,
          isHost: this.state.host === this.state.username,
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
    socket.startSession()
  }

  // update user cards in group
  updateMemberList() {
    memberRenderList = []
    for (const user in this.state.members) {
      const a = {}
      a.name = this.state.members[user].name
      a.username = user
      a.image = this.state.members[user].pic
      a.filters = this.state.members[user].filters
      a.host = this.state.host
      a.isHost = this.state.host == this.state.username
      a.key = user
      a.f = false
      memberRenderList.push(a)
    }
    const footer = {}
    footer.f = true
    memberRenderList.push(footer)
    // console.log('\n\n\n\n\n\n=========================')
    // console.log(memberRenderList)
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
    this.state.host === this.state.username
      ? this.setState({ endAlert: false })
      : this.setState({ leaveAlert: false })
  }

  // sets the filters, goes back to groups and stops user from going back to filters
  submitFilters(setFilters) {
    this.setState({ swipe: false })
    this.setState({ filters: setFilters })
  }

  _handleChooseFriendsPress() {
    console.log('added')
    // add code to close choose friend modal
  }

  componentDidMount() {
    this._isMounted = true
  }

  componentWillUnmount() {
    this._isMounted = false
  }

  render() {
    this.updateMemberList()
    return (
      <View style={{ backgroundColor: '#FFF' }}>
        <DraggableView
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
                  {memberRenderList.length - 1}
                </Text>
                <Text style={[styles.divider, { color: '#F15763' }]}>|</Text>
                <Text style={[styles.waiting, { color: '#F15763' }]}>
                  waiting for {this.state.needFilters} member filters
                </Text>
              </View>
              <FlatList
                style={[styles.center, { marginTop: 0, height: windowHeight * 0.5 }]}
                numColumns={2}
                // ListHeaderComponent={

                // }
                ListHeaderComponentStyle={{
                  color: '#F15763',
                  marginBottom: 10,
                }}
                data={memberRenderList}
                contentContainerStyle={styles.memberContainer}
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
                          onPress={() => this.setState({ chooseFriends: true })}
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
                        image={item.image}
                        filters={item.filters}
                        host={this.state.host}
                        isHost={this.state.host == item.username}
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
                {this.state.host === this.state.username && (
                  <TouchableHighlight
                    underlayColor="#F15763"
                    activeOpacity={1}
                    onHideUnderlay={() => this.setState({ start: false })}
                    onShowUnderlay={() => this.setState({ start: true })}
                    onPress={() => this.start()}
                    style={[
                      screenStyles.bigButton,
                      styles.bigButton,
                      this.state.start ? { opacity: 0.75 } : { opacity: 1 },
                    ]}
                  >
                    <Text style={styles.buttonText}>Start Round</Text>
                  </TouchableHighlight>
                )}
                {this.state.host !== this.state.username && (
                  <TouchableHighlight
                    style={[
                      screenStyles.bigButton,
                      styles.bigButton,
                      this.state.start ? { opacity: 0.75 } : { opacity: 1 },
                    ]}
                  >
                    <Text style={styles.buttonText}>
                      {this.state.start ? 'Ready!' : 'Waiting...'}
                    </Text>
                  </TouchableHighlight>
                )}
                <TouchableHighlight
                  onShowUnderlay={() => this.setState({ leaveGroup: true })}
                  onHideUnderlay={() => this.setState({ leaveGroup: false })}
                  style={styles.leave}
                  onPress={() => {
                    console.log(this.state.members)
                    this.state.host === this.state.username
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
                    {this.state.host === this.state.username ? 'Cancel Group' : 'Leave Group'}
                  </Text>
                </TouchableHighlight>
              </View>
              {this.state.leaveAlert && (
                <Alert
                  title="Leave?"
                  body="You will will not be able to return without invite"
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
                  press={() => this.endGroup()}
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
                members={memberRenderList}
                press={() => this.setState({ chooseFriends: false })}
              />
            </View>
          )}
          renderDrawerView={() => (
            <View>
              <View>
                <View
                  style={{ width: windowWidth, height: windowHeight, backgroundColor: 'green' }}
                >
                  <FilterSelector
                    host={this.state.host}
                    isHost={this.state.host === this.state.username}
                    handleUpdate={(setFilters) => this.submitFilters(setFilters)}
                    members={memberRenderList}
                  />
                </View>
              </View>
              <View style={styles.top}>
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
                    {this.state.host === this.state.username
                      ? 'Your Group'
                      : `${this.state.host}'s Group`}
                  </Text>
                  <View style={styles.subheader}>
                    <Text style={styles.headertext2}>Group PIN: </Text>
                    <Text style={styles.headertext3}>BADWOLF42</Text>
                    <TouchableOpacity
                      style={{
                        flexDirection: 'column',
                        justifyContent: 'center',
                        width: 15,
                        height: 15,
                      }}
                    >
                      <Ionicons name="copy-outline" style={styles.icon2} />
                    </TouchableOpacity>
                  </View>
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
                    height: 60,
                    backgroundColor: hex,
                    padding: 15,
                    marginTop: -45,
                    borderRadius: 15,
                    flexDirection: 'column',
                    justifyContent: 'flex-end',
                    zIndex: -1,
                  }}
                >
                  <Text
                    style={{
                      color: 'white',
                      fontFamily: font,
                      fontSize: 11,
                    }}
                  >
                    {this.state.username === this.state.host
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
  main: {
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
  headertext2: {
    color: '#fff',
    fontSize: 15,
    fontWeight: 'normal',
    fontFamily: font,
    alignSelf: 'center',
  },
  headertext3: {
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
})
