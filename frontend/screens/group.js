import React from 'react'
import {
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TouchableHighlight,
  TouchableOpacity,
  View,
} from 'react-native'
import { USERNAME } from 'react-native-dotenv'
import Ionicons from 'react-native-vector-icons/Ionicons'
import Icon from 'react-native-vector-icons/FontAwesome'
import Swiper from 'react-native-swiper'
import DraggableView from 'react-native-draggable-view'
import AsyncStorage from '@react-native-community/async-storage'
import PropTypes from 'prop-types'
import Alert from '../modals/alert.js'
import GroupCard from '../cards/groupCard.js'
import ChooseFriends from '../modals/chooseFriends.js'
import FilterSelector from './filter.js'
import socket from '../apis/socket.js'
import screenStyles from '../../styles/screenStyles.js'

const hex = '#F15763'
const hexBlack = '#000000'
const font = 'CircularStd-Medium'
var memberList = []
var myUsername = ''
AsyncStorage.getItem(USERNAME).then((res) => {
  myUsername = res
})

export default class Group extends React.Component {
  constructor(props) {
    super(props)
    this._isMounted = false
    const members = this.props.navigation.state.params.members
    this.state = {
      members: members,
      // host: this.props.navigation.state.params.host,
      host: 'nachenburger',
      hostName: members[Object.keys(members)[0]],
      needFilters: Object.keys(members).filter((user) => !user.filters).length,
      start: false,
      username: myUsername,
      // show/hide the alerts
      leaveAlert: false,
      endAlert: false,
      swipe: true,
      filters: {},
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
          isHost: this.state.host == this.state.username,
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
    memberList = []
    for (var user in this.state.members) {
      let a = {}
      a.name = this.state.members[user].name
      a.username = user
      a.image = this.state.members[user].pic
      a.filters = this.state.members[user].filters
      a.host = this.state.host
      a.isHost = this.state.host == this.state.username
      a.key = user
      a.f = false
      memberList.push(a)
      memberList.push(a)
      memberList.push(a)
      memberList.push(a)
      memberList.push(a)
      memberList.push(a)
      memberList.push(a)
    }
    let footer = {}
    footer.f = true
    memberList.push(footer)
    console.log('\n\n\n\n\n\n=========================')
    console.log(memberList)
    console.log('=========================\n\n\n\n\n\n')
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
    this.refs.swiper.scrollBy(-1)
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
      <Swiper ref="swiper" loop={false} showsPagination={false} scrollEnabled={this.state.swipe}>
        <View style={styles.main}>
          <View style={styles.top}>
            <View
              style={{
                alignSelf: 'center',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'space-between',
                backgroundColor: hex,
                width: '100%',
                paddingBottom: 20,
              }}
            >
              <Text style={styles.groupTitle}>
                {this.state.host === this.state.username
                  ? 'Your Group'
                  : `${this.state.groupName}'s Group`}
              </Text>
              <View style={styles.subheader}>
                <Text style={styles.headertext2}>Group PIN: </Text>
                <Text style={styles.headertext3}>BADWOLF42</Text>
                <TouchableOpacity
                  style={{ flexDirection: 'column', justifyContent: 'center', width: 15 }}
                >
                  <Ionicons name="copy-outline" style={styles.icon2} />
                </TouchableOpacity>
              </View>
            </View>
            <View
              style={{
                flexDirection: 'row',
                margin: '4%',
                justifyContent: 'center',
              }}
            >
              {this.state.swipe && (
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
                    }}
                  >
                    {this.state.username === this.state.host
                      ? 'Pull down for host menu'
                      : 'Pull down to set filters'}
                  </Text>
                </View>
              )}
            </View>
          </View>
          <FlatList
            style={[styles.center]}
            numColumns={2}
            ListHeaderComponent={
              <View style={{ flexDirection: 'row' }}>
                <Icon name="user" style={[styles.icon, { color: '#F15763' }]} />
                <Text
                  style={{
                    color: '#F15763',
                    fontWeight: 'bold',
                    fontFamily: font,
                  }}
                >
                  {memberList.length - 1}
                </Text>
                <Text style={[styles.divider, { color: '#F15763' }]}>|</Text>
                <Text style={[styles.waiting, { color: '#F15763' }]}>
                  waiting for {this.state.needFilters} member filters
                </Text>
              </View>
            }
            ListHeaderComponentStyle={{
              color: '#F15763',
              marginBottom: 10,
            }}
            data={memberList}
            initialNumToRender={8}
            contentContainerStyle={styles.memberContainer}
            renderItem={({ item }) => {
              if (item.f) {
                return (
                  <View>
                    <View
                      style={{
                        backgroundColor: '#DCDCDC',
                        borderRadius: 7,
                        alignSelf: 'center',
                        width: 170,
                        height: 35,
                        padding: 0,
                        margin: 5,
                      }}
                    >
                      <Text
                        style={{
                          fontWeight: 'bold',
                          color: '#6A6A6A',
                          textAlign: 'center',
                          width: '100%',
                          lineHeight: 36,
                        }}
                      >
                        + Add Friends
                      </Text>
                    </View>
                    <View
                      style={{
                        width: 170,
                        height: 30,
                        padding: 0,
                        margin: 5,
                        display: 'none',
                      }}
                    >
                      <Text>"""footer"""</Text>
                    </View>
                  </View>
                )
                // return <ChooseFriends members={memberList} press={this._handleChooseFriendsPress} />
              } else {
                return (
                  <View>
                    {console.log(JSON.stringify(item))}
                    <GroupCard
                      name={item.name}
                      username={item.username}
                      image={item.image}
                      filters={item.filters}
                      host={this.state.host}
                      isHost={this.state.host == item.username}
                      key={item.key}
                    />
                  </View>
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
                <Text style={styles.buttonText}>{this.state.start ? 'Ready!' : 'Waiting...'}</Text>
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
        </View>
        <FilterSelector
          host={this.state.host}
          isHost={this.state.host === this.state.username}
          press={(setFilters) => this.submitFilters(setFilters)}
          members={memberList}
        />
      </Swiper>
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
    marginTop: '10%',
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
    fontSize: 20,
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
    paddingVertical: 7,
    paddingHorizontal: 12,
    width: '50%',
    alignSelf: 'center',
    alignContent: 'center',
    marginTop: '3%',
  },
  buttonText: {
    color: '#fff',
    alignSelf: 'center',
    fontSize: 30,
    fontWeight: 'bold',
  },
  bottomText: {
    color: '#aaa',
    width: '50%',
    alignSelf: 'center',
    fontWeight: 'bold',
    marginTop: '3%',
    textAlign: 'center',
    fontFamily: font,
  },
  bigButton: {
    paddingVertical: 13,
    paddingHorizontal: 12,
    width: '60%',
    marginTop: '3%',
    backgroundColor: '#F15763',
  },
  top: {
    backgroundColor: '#fff',
    flex: 0.38,
  },
  center: {
    flex: 0.6,
    margin: 15,
    marginLeft: 25,
    marginRight: 25,
  },
  bottom: {
    flex: 0.45,
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
