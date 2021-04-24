import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import {
  Dimensions,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
} from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'
import { NAME, PHOTO, USERNAME } from 'react-native-dotenv'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { BlurView } from '@react-native-community/blur'
import {
  newNotif,
  noNotif,
  changeFriends,
  hideRefresh,
  hideHold,
  showError,
  hideError,
  updateSession,
  setHost,
  hideDisable,
} from '../redux/Actions.js'
import Swiper from 'react-native-swiper'
import PropTypes from 'prop-types'
import Alert from '../modals/Alert.js'
import notificationsApi from '../apis/notificationsApi.js'
import colors from '../../styles/colors.js'
import friendsApi from '../apis/friendsApi.js'
import screenStyles from '../../styles/screenStyles.js'
import modalStyles from '../../styles/modalStyles.js'
import NotifCard from '../cards/NotifCard.js'
import socket from '../apis/socket.js'
import TabBar from '../Nav.js'

var img = ''
var name = ''
var username = ''
var socketErrMsg = 'Socket error message uninitialized'

AsyncStorage.multiGet([NAME, PHOTO, USERNAME]).then((res) => {
  name = res[0][1]
  img = res[1][1]
  username = res[2][1]
})
const height = Dimensions.get('window').height

class Notif extends Component {
  constructor(props) {
    super(props)
    this.state = {
      name: name,
      nameValue: name,
      username: username,
      usernameValue: username,
      image: img,
      friends: true,
      notifs: [],
      activityNotifs: [],
      requestNotifs: [],
      modNotifs: [],
      activity: true,
      visible: false,
      changeName: false,
      changeUser: false,
      // button appearance
      logout: false,
      delete: false,
      // show alert
      logoutAlert: false,
      deleteAlert: false,
      deleteFriend: false,
      // disabling buttons
      disabled: false,
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
      console.log(msg)
      this.props.hideDisable()
      this.props.hideRefresh()
      if (msg === 'join') socketErrMsg = 'Unable to join the group, please try again'
      else if (msg === 'cannot join')
        socketErrMsg = 'The group does not exist or has already started a round'
      this.setState({ socketErr: true })
    })
  }

  componentDidMount() {
    this.props.hideRefresh()
    this.getNotifs()
  }

  deleteNotifications() {
    this.props.hideHold()
    var tempNotifs = []
    for (var i = 0; i < this.state.notifs.length; i++) {
      console.log(this.state.modNotifs.includes(i))
      if (!this.state.modNotifs.includes(i)) {
        tempNotifs.push(this.state.notifs[i])
      } else if (this.state.notifs[i].type === 'pending') {
        friendsApi.removeFriendship(this.state.notifs[i].sender)
      }
    }
    this.setState({ notifs: tempNotifs, modNotifs: [] })
  }

  // id: notif.id,
  //           type: notif.type,
  //           updatedAt: notif.updatedAt,
  //           sender: notif.sender_uid,
  //           senderUsername: notif.account.username,
  //           senderPhoto: notif.account.photo,
  //           senderName: notif.account.name,

  async getNotifs() {
    // Pushing notifs into this.state.notif
    var pushNotifs = []
    let notifList = [
      {
        name: 'Hanna Co',
        username: 'hco',
        uid: '3',
        photo: '150',
        type: 'invited',
      },
      {
        name: 'Francis Feng',
        username: 'francis',
        uid: '8',
        photo: '167',
        type: 'invited',
      },
      {
        name: 'Hubert Chen',
        username: 'hubesc',
        uid: '5',
        photo: '165',
        type: 'requested',
      },
    ]
    let requested = []
    let active = []

    notificationsApi
      .getNotifs()
      .then((res) => {
        notifList = res.notifs
        // console.log(notifList)
        for (var notif in notifList) {
          pushNotifs.push(notifList[notif])
        }
        console.log(pushNotifs)
        this.setState({ notifs: pushNotifs })
        this.state.notifs.sort(
          (x, y) => new Date(x.updatedAt).valueOf() < new Date(y.updatedAt).valueOf(),
        )
        if (Array.isArray(this.state.notifs) && this.state.notifs.length) {
          for (var i = 0; i < this.state.notifs.length; i++) {
            if (
              this.state.notifs[i].type == 'pending' ||
              this.state.notifs[i].type == 'friends' ||
              this.state.notifs[i].type == 'accepted'
            ) {
              requested.push(
                <NotifCard
                  total={this.state.notifs}
                  name={this.state.notifs[i].senderName}
                  username={this.state.notifs[i].senderUsername}
                  uid={this.state.notifs[i].sender}
                  image={this.state.notifs[i].senderPhoto}
                  type={this.state.notifs[i].type}
                  content={this.state.notifs[i].content}
                  key={i}
                  index={i}
                  deleteNotif={(add, ind) => this.toDelete(add, ind)}
                  press={(uid, newArr, status) => this.removeRequest(uid, newArr, status)}
                  showDelete={() => this.setState({ deleteFriend: true })}
                  removeDelete={() => this.setState({ deleteFriend: false })}
                />,
              )
              if (this.state.notifs[i].type == 'friends') {
                //someone sent you a request
                var newArr = []
                for (var j = 0; i < this.props.friends.friends.length; i++) {
                  var person = {
                    name: this.props.friends.friends[j].name,
                    username: this.props.friends.friends[j].username,
                    photo: this.props.friends.friends[j].photo,
                    uid: this.props.friends.friends[j].uid,
                    status: this.props.friends.friends[j].status,
                  }
                  newArr.push(person)
                }
                var addPerson = {
                  name: this.state.notifs[i].senderName,
                  username: this.state.notifs[i].senderUsername,
                  photo: this.state.notifs[i].senderPhoto,
                  uid: this.state.notifs[i].sender,
                  status: 'pending',
                }
                newArr.push(addPerson)
                this.props.changeFriends(newArr)
              } else {
                //you accepted someones request
                var arr = this.props.friends.friends.filter((item) => {
                  if (item.username === this.state.notifs[i].senderUsername) item.status = 'friends'
                  return item
                })
                this.props.changeFriends(arr)
              }
            } else {
              active.push(
                <NotifCard
                  total={this.state.notifs}
                  name={this.state.notifs[i].senderName}
                  username={this.state.notifs[i].senderUsername}
                  uid={this.state.notifs[i].sender}
                  image={this.state.notifs[i].senderPhoto}
                  type={this.state.notifs[i].type}
                  content={this.state.notifs[i].content}
                  key={i}
                  index={i}
                  deleteNotif={(add, ind) => this.toDelete(add, ind)}
                  press={(uid, newArr, status) => this.removeRequest(uid, newArr, status)}
                  showDelete={() => this.setState({ deleteFriend: true })}
                  removeDelete={() => this.setState({ deleteFriend: false })}
                />,
              )
            }
          }
          this.setState({ requestNotifs: requested, activityNotifs: active })
        }
      })
      .catch(() => {
        this.props.showError()
      })
  }

  toDelete(add, ind) {
    var tempNotifs = []
    if (add) {
      // we've unselected a previously selected notif
      for (var i = 0; i < this.state.modNotifs.length; i++) {
        if (ind !== this.state.modNotifs[i]) {
          tempNotifs.push(this.state.modNotifs[i])
        }
      }
    } else {
      // we're trying to delete a notif
      tempNotifs = this.state.modNotifs
      tempNotifs.push(ind)
    }
    this.setState({ modNotifs: tempNotifs })
  }

  render() {
    // var activityNotifs = []
    // var requestNotifs = []
    // var notifList = []
    // this.state.notifs.sort((x, y) => new Date(x.updatedAt).valueOf() < new Date(y.updatedAt).valueOf())
    // Create all friend/request cards
    // if (Array.isArray(this.state.notifs) && this.state.notifs.length) {
    //   for (var i = 0; i < this.state.notifs.length; i++) {
    //     if (
    //       this.state.notifs[i].type == 'pending' ||
    //       this.state.notifs[i].type == 'friends' ||
    //       this.state.notifs[i].type == 'accepted'
    //     ) {
    //       requestNotifs.push(
    //         <NotifCard
    //           total={this.state.notifs}
    //           name={this.state.notifs[i].senderName}
    //           username={this.state.notifs[i].senderUsername}
    //           uid={this.state.notifs[i].sender}
    //           image={this.state.notifs[i].senderPhoto}
    //           type={this.state.notifs[i].type}
    //           content={this.state.notifs[i].content}
    //           key={i}
    //           index={i}
    //           deleteNotif={(add, ind) => this.toDelete(add, ind)}
    //           press={(uid, newArr, status) => this.removeRequest(uid, newArr, status)}
    //           showDelete={() => this.setState({ deleteFriend: true })}
    //           removeDelete={() => this.setState({ deleteFriend: false })}
    //         />,
    //       )
    //       if (this.state.notifs[i].type == 'friends') {
    //         //someone sent you a request
    //         var newArr = []
    //         for (var j = 0; i < this.props.friends.friends.length; i++) {
    //           var person = {
    //             name: this.props.friends.friends[j].name,
    //             username: this.props.friends.friends[j].username,
    //             photo: this.props.friends.friends[j].photo,
    //             uid: this.props.friends.friends[j].uid,
    //             status: this.props.friends.friends[j].status,
    //           }
    //           newArr.push(person)
    //         }
    //         var addPerson = {
    //           name: this.state.notifs[i].senderName,
    //           username: this.state.notifs[i].senderUsername,
    //           photo: this.state.notifs[i].senderPhoto,
    //           uid: this.state.notifs[i].sender,
    //           status: 'pending',
    //         }
    //         newArr.push(addPerson)
    //         this.props.changeFriends(newArr)
    //       } else {
    //         //you accepted someones request
    //         var arr = this.props.friends.friends.filter((item) => {
    //           if (item.username === this.state.notifs[i].senderUsername) item.status = 'friends'
    //           return item
    //         })
    //         this.props.changeFriends(arr)
    //       }
    //     } else {
    //       activityNotifs.push(
    //         <NotifCard
    //           total={this.state.notifs}
    //           name={this.state.notifs[i].senderName}
    //           username={this.state.notifs[i].senderUsername}
    //           uid={this.state.notifs[i].sender}
    //           image={this.state.notifs[i].senderPhoto}
    //           type={this.state.notifs[i].type}
    //           content={this.state.notifs[i].content}
    //           key={i}
    //           index={i}
    //           deleteNotif={(add, ind) => this.toDelete(add, ind)}
    //           press={(uid, newArr, status) => this.removeRequest(uid, newArr, status)}
    //           showDelete={() => this.setState({ deleteFriend: true })}
    //           removeDelete={() => this.setState({ deleteFriend: false })}
    //         />,
    //       )
    //     }
    //   }
    // }
    return (
      <ImageBackground
        source={require('../assets/backgrounds/Search.png')}
        style={screenStyles.screenBackground}
      >
        <View>
          <Text style={[screenStyles.icons, styles.NotifTitle]}>Notifications</Text>

          <View style={{ flexDirection: 'row' }}>
            <TouchableHighlight
              underlayColor="#fff"
              style={[
                this.state.activity
                  ? { borderBottomColor: colors.hex }
                  : { borderBottomColor: 'white' },
                { marginLeft: '5%', flex: 0.5, borderBottomWidth: 2 },
              ]}
              onPress={() => this.refs.swiper.scrollBy(-1)}
            >
              <Text
                style={[
                  screenStyles.smallButtonText,
                  styles.selectedText,
                  { fontFamily: 'CircularStd-Bold' },
                ]}
              >
                Activity
              </Text>
            </TouchableHighlight>
            <TouchableHighlight
              underlayColor="#fff"
              style={[
                // screenStyles.smallButton,
                !this.state.activity
                  ? { borderBottomColor: colors.hex }
                  : { borderBottomColor: 'white' },
                { marginHorizontal: '5%', flex: 0.5, borderBottomWidth: 2 },
              ]}
              onPress={() => this.refs.swiper.scrollBy(1)}
            >
              <Text
                style={[
                  screenStyles.smallButtonText,
                  styles.selectedText,
                  { fontFamily: 'CircularStd-Bold' },
                ]}
              >
                Friend Requests
              </Text>
            </TouchableHighlight>
          </View>
        </View>
        <View style={{ height: '63%', marginTop: '5%' }}>
          <Swiper
            ref="swiper"
            loop={false}
            showsPagination={false}
            onIndexChanged={() => this.setState({ activity: !this.state.activity })}
            scrollEnabled={!this.props.hold}
          >
            <ScrollView style={{ flexDirection: 'column' }} nestedScrollEnabled={true}>
              {this.state.activityNotifs}
            </ScrollView>
            <ScrollView style={{ flexDirection: 'column' }} nestedScrollEnabled={true}>
              {this.state.requestNotifs}
            </ScrollView>
          </Swiper>
        </View>
        {!this.props.hold && (
          <Text style={[screenStyles.text, styles.deleteText]}>Hold to delete notifications</Text>
        )}

        {this.props.hold && (
          <TouchableHighlight
            onPress={() => this.deleteNotifications()}
            style={[screenStyles.medButton, styles.deleteButton, { backgroundColor: colors.hex }]}
            underlayColor="white"
          >
            <Text style={[screenStyles.text, styles.deleteButtonText, { color: 'white' }]}>
              Delete Notifications
            </Text>
          </TouchableHighlight>
        )}

        {(this.state.visible || this.props.error || this.state.deleteFriend) && (
          <BlurView
            blurType="dark"
            blurAmount={10}
            reducedTransparencyFallbackColor="white"
            style={modalStyles.blur}
          />
        )}
        {this.state.deleteFriend && (
          <Alert
            title="Are you sure?"
            body={'You are about to remove @' + this.props.username + ' as a friend'}
            buttonAff="Delete"
            height="25%"
            blur
            press={() => this.deleteFriend()}
            cancel={() => this.setState({ deleteFriend: false })}
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
        <TabBar
          goHome={() => this.props.navigation.replace('Home')}
          goSearch={() => this.props.navigation.replace('Search')}
          goNotifs={() => {}}
          goProfile={() => this.props.navigation.replace('Profile')}
          cur="Notifs"
        />
        {(this.state.socketErr || this.props.refresh) && (
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
  const { notif } = state
  const { error } = state
  const { username } = state
  const { hold } = state
  const { friends } = state
  return { notif, error, username, hold, friends }
}
//  access the state as this.props.notif
//  if that's giving you errors, use this.props.notif.notif

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      newNotif,
      noNotif,
      changeFriends,
      showError,
      hideRefresh,
      hideHold,
      hideError,
      hideDisable,
      setHost,
      updateSession,
    },
    dispatch,
  )
//  use as this.props.newNotif() or this.props.noNotif()
//  if that's giving you errors, use this.props.notif.newNotif()

export default connect(mapStateToProps, mapDispatchToProps)(Notif)

Notif.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
    replace: PropTypes.func,
  }).isRequired,
  username: PropTypes.object,
  friends: PropTypes.object,
  hold: PropTypes.bool,
  changeFriends: PropTypes.func,
  showError: PropTypes.func,
  hideRefresh: PropTypes.func,
  hideHold: PropTypes.func,
  hideError: PropTypes.func,
}

const styles = StyleSheet.create({
  NotifTitle: {
    marginTop: '7%',
    textAlign: 'center',
    color: 'white',
    marginBottom: '15%',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 63,
    borderWidth: 4,
    margin: '5%',
  },
  deleteText: {
    textAlign: 'center',
  },
  deleteButton: {
    borderColor: colors.hex,
  },
  deleteButtonText: {
    marginHorizontal: '7%',
    marginVertical: '1%',
  },
  userInfo: { flexDirection: 'row', alignItems: 'center' },
  modal: {
    height: Dimensions.get('window').height * 0.45,
    width: '75%',
    margin: '3%',
    backgroundColor: 'white',
    alignSelf: 'flex-end',
    borderRadius: 30,
    elevation: 20,
  },
  changeButtons: {
    alignSelf: 'center',
    width: '35%',
  },
  selectedText: {
    paddingLeft: '3%',
    paddingRight: '3%',
  },
  button: {
    alignSelf: 'center',
    width: '35%',
    marginRight: '5%',
    marginTop: '5%',
  },
  bar: {
    marginBottom: '2%',
    alignSelf: 'center',
    height: height * 0.07,
    borderRadius: 10,
    borderWidth: 0,
    position: 'absolute',
    bottom: 0,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
})
