import React from 'react'
import { ScrollView, StyleSheet, Text, TouchableHighlight, View } from 'react-native'
import { USERNAME } from 'react-native-dotenv'
import Icon from 'react-native-vector-icons/FontAwesome'
import Swiper from 'react-native-swiper'
import AsyncStorage from '@react-native-community/async-storage'
import PropTypes from 'prop-types'
import Alert from '../modals/alert.js'
import GroupCard from '../cards/groupCard.js'
import FilterSelector from './filter.js'
import socket from '../apis/socket.js'
import screenStyles from '../../styles/screenStyles.js'

const hex = '#F25763'
const font = 'CircularStd-Bold'
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
      host: this.props.navigation.state.params.host,
      groupName: members[Object.keys(members)[0]].name.split(' ')[0],
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
      memberList.push(
        <GroupCard
          name={this.state.members[user].name}
          username={user}
          image={this.state.members[user].pic}
          filters={this.state.members[user].filters}
          host={this.state.host}
          isHost={this.state.host == this.state.username}
          key={user}
        />,
      )
    }
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
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <Text style={styles.groupTitle}>
                {this.state.host === this.state.username
                  ? 'Your Group'
                  : `${this.state.groupName}'s Group`}
              </Text>
              <TouchableHighlight
                onShowUnderlay={() => this.setState({ leaveGroup: true })}
                onHideUnderlay={() => this.setState({ leaveGroup: false })}
                style={styles.leave}
                onPress={() =>
                  this.state.host === this.state.username
                    ? this.setState({ endAlert: true })
                    : this.setState({ leaveAlert: true })
                }
                underlayColor="white"
              >
                <Text
                  style={[
                    styles.leaveText,
                    this.state.leaveGroup ? { color: hex } : { color: 'white' },
                  ]}
                >
                  {this.state.host === this.state.username ? 'End' : 'Leave'}
                </Text>
              </TouchableHighlight>
            </View>
            <View style={{ flexDirection: 'row' }}>
              <Icon name="user" style={styles.icon} />
              <Text
                style={{
                  color: '#fff',
                  fontWeight: 'bold',
                  fontFamily: font,
                }}
              >
                {memberList.length}
              </Text>
              <Text style={styles.divider}>|</Text>
              <Text style={styles.waiting}>
                waiting for {this.state.needFilters} member filters
              </Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                margin: '4%',
                justifyContent: 'flex-end',
              }}
            >
              {this.state.swipe && (
                <Text
                  style={{
                    color: 'white',
                    fontFamily: font,
                    marginRight: '3%',
                  }}
                >
                  {this.state.username === this.state.host
                    ? 'Swipe for host menu'
                    : 'Swipe for filters'}
                </Text>
              )}
              {this.state.swipe && (
                <Icon
                  name="chevron-right"
                  style={{
                    color: 'white',
                    fontFamily: font,
                    fontSize: 16,
                    marginTop: '0.75%',
                  }}
                  onPress={() => this.refs.swiper.scrollBy(1)}
                />
              )}
            </View>
          </View>
          <ScrollView style={styles.center}>{memberList}</ScrollView>
          <View style={styles.bottom}>
            <Text style={styles.bottomText}>
              When everyone has submitted filters, the round will begin!
            </Text>
            {this.state.host === this.state.username && (
              <TouchableHighlight
                underlayColor="#fff"
                activeOpacity={1}
                onHideUnderlay={() => this.setState({ start: false })}
                onShowUnderlay={() => this.setState({ start: true })}
                onPress={() => this.start()}
                style={[
                  screenStyles.bigButton,
                  styles.bigButton,
                  this.state.start ? { opacity: 1 } : { opacity: 0.5 },
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
                  this.state.start ? { opacity: 1 } : { opacity: 0.5 },
                ]}
              >
                <Text style={styles.buttonText}>{this.state.start ? 'Ready!' : 'Waiting...'}</Text>
              </TouchableHighlight>
            )}
          </View>
          {this.state.leaveAlert && (
            <Alert
              title="Leave?"
              body="You will will not be able to return without invite"
              button
              buttonText="Yes"
              press={() => this.leaveGroup()}
              cancel={() => this.cancelAlert()}
            />
          )}
          {this.state.endAlert && (
            <Alert
              title="End the session?"
              body="You will not be able to return"
              button
              buttonText="Yes"
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
    backgroundColor: hex,
    color: '#fff',
  },
  groupTitle: {
    color: '#fff',
    fontSize: 25,
    marginLeft: '5%',
    marginTop: '5%',
    fontWeight: 'bold',
    fontFamily: font,
  },
  leave: {
    marginRight: '2%',
    marginTop: '6%',
    borderRadius: 25,
    borderWidth: 2.5,
    borderColor: '#fff',
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
    color: '#fff',
    marginLeft: '5%',
    marginTop: '2%',
    fontSize: 30,
  },
  divider: {
    color: '#fff',
    alignSelf: 'center',
    marginLeft: '3%',
    fontSize: 25,
    fontFamily: font,
  },
  waiting: {
    color: '#fff',
    marginLeft: '3%',
    alignSelf: 'center',
    fontFamily: font,
  },
  button: {
    borderRadius: 25,
    borderWidth: 2.5,
    borderColor: '#fff',
    paddingVertical: 7,
    paddingHorizontal: 12,
    width: '50%',
    alignSelf: 'center',
    marginTop: '3%',
  },
  buttonText: {
    color: '#fff',
    alignSelf: 'center',
    fontSize: 30,
    fontWeight: 'bold',
  },
  bottomText: {
    color: '#fff',
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
  },
  top: {
    flex: 0.38,
  },
  center: {
    flex: 0.6,
    color: '#fff',
  },
  bottom: {
    flex: 0.45,
    color: '#fff',
  },
})
