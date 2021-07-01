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
import { BlurView } from '@react-native-community/blur'
import {
  newNotif,
  noNotif,
  hideRefresh,
  hideHold,
  showError,
  hideError,
  updateSession,
  setHost,
  removeFriend,
  acceptFriend
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

//TODO: USE REDUX
const width = Dimensions.get('window').width

class Notif extends Component {
  constructor(props) {
    super(props)
    this.state = {
      notifs: [],
      activityNotifs: [],
      requestNotifs: [],
      // the indexes of notifs you want to delete
      modNotifs: [],
      activity: true,
      visible: false,
      // show alert
      deleteFriend: false,
      socketErr: null,
    }
    this.props.hideRefresh()
    this.getNotifs()
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
      let socketErrMsg = ''
      if (msg === 'join') socketErrMsg = 'Unable to join the group, please try again'
      else if (msg === 'cannot join')
        socketErrMsg = 'The group does not exist or has already started a round'
      this.setState({ socketErr: socketErrMsg })
    })
  }

  // function to add NotifCards to this.state.requestNotifs and activityNotifs
  addNotifs() {
    console.log(this.state.notifs.length)
    let requested = []
    let active = []
    this.state.notifs.sort(
      (x, y) => new Date(x.createdAt).valueOf() <= new Date(y.createdAt).valueOf(),
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
              id={this.state.notifs[i].id}
              uid={this.state.notifs[i].sender}
              image={this.state.notifs[i].senderPhoto}
              type={this.state.notifs[i].type}
              content={this.state.notifs[i].content}
              key={i}
              index={i}
              deleteNotif={(add, ind) => this.toDelete(add, ind)}
              press={(uid, newArr, id) => this.removeRequest(uid, newArr, id)}
              showDelete={() => this.setState({ deleteFriend: true })}
              modifyList={(uid, id) => this.modifyList(uid, id)}
            />,
          )
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
              press={(newArr, _) => this.removeRequest(newArr, this.state.notifs[i].id)}
              showDelete={() => this.setState({ deleteFriend: true })}
              modifyList={(uid, id) => this.modifyList(uid, id)}
            />,
          )
        }
      }
      this.setState({ requestNotifs: requested, activityNotifs: active })
    }
  }

  // when you accept a friend request it changes the notification type
  modifyList(uid, id) {
    this.props.setDisable()
    friendsApi
      .acceptFriendRequest(uid)
      .then(() => {
        let arr = this.state.notifs
        arr.forEach(function (item) {
          if (item.id === id) item.type = 'friends'
        })
        this.props.acceptFriend(uid)
        this.setState({ notifs: arr }, this.addNotifs)
        this.props.hideDisable()
      })
      .catch(() => {
        this.props.showError()
        this.props.hideDisable()
      })
  }

  // delete a friend request
  removeRequest(uid, newArr, id) {
    this.props.setDisable()
    friendsApi
      .removeFriendship(uid)
      .then(() => {
        this.setState({ deleteFriend: false, notifs: newArr })
        notificationsApi.removeNotif(id).catch(() => {
          this.props.showError()
          this.props.hideDisable()
        })
        this.props.removeFriend(uid)
        this.addNotifs()
        this.props.hideDisable()
      })
      .catch(() => {
        this.props.showError()
        this.props.hideDisable()
      })
  }

  // removes all the selected notifs
  deleteNotifications() {
    this.props.hideHold()
    let tempNotifs = []
    for (var i = 0; i < this.state.notifs.length; i++) {
      if (!this.state.modNotifs.includes(i)) {
        tempNotifs.push(this.state.notifs[i])
      }
      else {
        if (this.state.notifs[i].type === 'pending') {
          friendsApi.removeFriendship(this.state.notifs[i].sender)
        }
        notificationsApi.removeNotif(this.state.notifs[i].id).catch(() => this.props.showError())
      }
    }
    this.setState({ notifs: tempNotifs, modNotifs: [] }, this.addNotifs)
  }
  //TODO: uncomment after updating backend
  // // removes all the selected notifs
  // deleteNotifications() {
  //   this.props.hideHold()
  //   let tempNotifs = []
  //   let deleteNotifs = []
  //   for (var i = 0; i < this.state.notifs.length; i++) {
  //     if (!this.state.modNotifs.includes(i)) {
  //       tempNotifs.push(this.state.notifs[i])
  //     }
  //     else {
  //       if (this.state.notifs[i].type === 'pending') {
  //         friendsApi.removeFriendship(this.state.notifs[i].sender)
  //       }
  //       deleteNotifs.push(this.state.notifs[i].id)
  //     }
  //   }
  //   notificationsApi.removeNotif(deleteNotifs).catch(() => this.props.showError())
  //   this.setState({ notifs: tempNotifs, modNotifs: [] }, this.addNotifs)
  // }

  cancelDeleteNotifications() {
    this.props.hideHold()
    this.setState({ modNotifs: [] })
  }

  // id: notif.id,
  //           type: notif.type,
  //           createdAt: notif.createdAt,
  //           sender: notif.sender_uid,
  //           senderUsername: notif.account.username,
  //           senderPhoto: notif.account.photo,
  //           senderName: notif.account.name,

  async getNotifs() {
    // Pushing notifs into this.state.notif
    notificationsApi
      .getNotifs()
      .then((res) => {
        this.setState({ notifs: res.notifs }, this.addNotifs)
      })
      .catch(() => {
        this.props.showError()
      })
  }

  // adds all the indices of notifications you want to delete to an array
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
        <View style={{ height: '60%', marginTop: '5%' }}>
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
          <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: '5%' }}>
            <TouchableHighlight
              onPress={() => this.deleteNotifications()}
              style={[screenStyles.medButton, styles.deleteButton]}
              underlayColor="white"
            >
              <Text style={[screenStyles.text, styles.deleteButtonText, { color: 'white' }]}>
                Delete
              </Text>
            </TouchableHighlight>
            <TouchableHighlight
              onPress={() => this.cancelDeleteNotifications()}
              style={[screenStyles.medButton, styles.deleteButton]}
              underlayColor="white"
            >
              <Text style={[screenStyles.text, styles.deleteButtonText, { color: 'white' }]}>
                Cancel
              </Text>
            </TouchableHighlight>
          </View>
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
            title="Uh oh!"
            body="Something went wrong. Please try again!"
            buttonAff="Close"
            height="25%"
            press={() => this.props.hideError()}
            cancel={() => this.props.hideError()}
          />
        )}
        {this.state.socketErr && (
          <Alert
            title="Connection Error!"
            body={this.state.socketErr}
            buttonAff="Close"
            height="25%"
            press={() => this.setState({ socketErr: null })}
            cancel={() => this.setState({ socketErr: null })}
          />
        )}
        <TabBar
          goHome={() => this.props.navigation.replace('Home')}
          goSearch={() => this.props.navigation.replace('Search')}
          goNotifs={() => { }}
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
      showError,
      hideRefresh,
      hideHold,
      hideError,
      setHost,
      updateSession,
      removeFriend,
      acceptFriend
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
  showError: PropTypes.func,
  hideRefresh: PropTypes.func,
  hideHold: PropTypes.func,
  hideError: PropTypes.func,
  updateSession: PropTypes.func,
  setHost: PropTypes.func,
  hideDisable: PropTypes.func,
  error: PropTypes.bool,
  refresh: PropTypes.bool,
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
    marginTop: '5%'
  },
  deleteButton: {
    borderColor: colors.hex,
    backgroundColor: colors.hex,
    marginHorizontal: '4%',
    paddingTop: '1%',
    paddingBottom: '1%',
    width: '40%'
  },
  deleteButtonText: {
    marginHorizontal: '7%',
    marginVertical: '1%',
    textAlign: 'center'
  },
  userInfo: { flexDirection: 'row', alignItems: 'center' },
  modal: {
    height: width * 0.87,
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
    height: width * 0.1353,
    borderRadius: 10,
    borderWidth: 0,
    position: 'absolute',
    bottom: 0,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
})
