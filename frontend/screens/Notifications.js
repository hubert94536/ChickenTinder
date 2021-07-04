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
  setDisable,
  hideDisable,
  showError,
  hideError,
  updateSession,
  setHost,
  changeNotifs,
  removeFriend,
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

const width = Dimensions.get('window').width
let prevNotifs = []
let requestNotifs = []
let activityNotifs = []

class Notif extends Component {
  constructor(props) {
    super(props)
    this.state = {
      // the ids of notifs you want to delete
      modNotifs: [],
      activity: true,
      visible: false,
      // show alert
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
      let socketErrMsg = ''
      if (msg === 'join') socketErrMsg = 'Unable to join the group, please try again'
      else if (msg === 'cannot join')
        socketErrMsg = 'The group does not exist or has already started a round'
      this.props.hideDisable()
      this.props.hideRefresh()
      this.setState({ socketErr: socketErrMsg })
    })
  }

  // removes all the selected notifs
  deleteNotifications() {
    this.props.setDisable()
    this.props.hideHold()
    if (this.state.modNotifs.length() > 0) {
      let newNotifs = this.props.notifs.filter((notif) => {
        if (!this.state.modNotifs.includes(notif.id)) return notif
        else {
          if (notif.type === 'pending') {
            friendsApi
              .removeFriendship(notif.sender)
              .then(() => this.props.removeFriend(notif.sender))
              .catch(() => this.props.showError())
          }
        }
      })
      notificationsApi.removeManyNotifs(this.state.modNotifs).catch(() => this.props.showError())
      this.props.changeNotifs(newNotifs)
      this.setState({ modNotifs: [] })
    }
    this.props.hideDisable()
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
  //   this.setState({ notifs: tempNotifs, modNotifs: [] })
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
        this.props.changeNotifs(res.notifs)
      })
      .catch(() => {
        this.props.showError()
      })
  }

  // adds all the indices of notifications you want to delete to an array
  toDelete(add, id) {
    let tempNotifs = []
    if (add) {
      // we've unselected a previously selected notif
      tempNotifs = this.state.modNotifs.filter((notif) => {
        if (notif.id !== id) return notif
      })
    } else {
      // we're trying to delete a notif
      tempNotifs = this.state.modNotifs
      tempNotifs.push(id)
    }
    this.setState({ modNotifs: tempNotifs })
  }

  render() {
    let notifs = this.props.notifs
    if (notifs !== prevNotifs) {
      requestNotifs = []
      activityNotifs = []
      notifs.sort((x, y) => new Date(x.createdAt).valueOf() <= new Date(y.createdAt).valueOf())
      prevNotifs = notifs
      notifs.forEach((notif) => {
        let notifCard = (
          <NotifCard
            total={this.state.notifs}
            name={notif.senderName}
            username={notif.senderUsername}
            id={notif.id}
            uid={notif.sender}
            image={notif.senderPhoto}
            type={notif.type}
            content={notif.content}
            key={notif.id}
            deleteNotif={(add, id) => this.toDelete(add, id)}
          />
        )
        if (notif.type == 'pending' || notif.type == 'friends' || notif.type == 'accepted')
          requestNotifs.push(notifCard)
        else activityNotifs.push(notifCard)
      })
    }
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
              {activityNotifs}
            </ScrollView>
            <ScrollView style={{ flexDirection: 'column' }} nestedScrollEnabled={true}>
              {requestNotifs}
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
              disabled={this.props.disable}
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

        {(this.state.visible || this.props.error || this.state.socketErr) && (
          <BlurView
            blurType="dark"
            blurAmount={10}
            reducedTransparencyFallbackColor="white"
            style={modalStyles.blur}
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
  return {
    notifs: state.notifs.notifs,
    error: state.error,
    username: state.username,
    hold: state.hold,
    friends: state.friends.friends,
  }
}
//  access the state as this.props.notif
//  if that's giving you errors, use this.props.notif.notif

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      newNotif,
      noNotif,
      showError,
      setDisable,
      hideRefresh,
      hideHold,
      hideError,
      hideDisable,
      setHost,
      updateSession,
      changeNotifs,
      removeFriend,
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
  friends: PropTypes.array,
  notifs: PropTypes.array,
  hold: PropTypes.bool,
  showError: PropTypes.func,
  hideRefresh: PropTypes.func,
  hideHold: PropTypes.func,
  hideError: PropTypes.func,
  updateSession: PropTypes.func,
  setHost: PropTypes.func,
  hideDisable: PropTypes.func,
  setDisable: PropTypes.func,
  disable: PropTypes.bool,
  error: PropTypes.bool,
  refresh: PropTypes.bool,
  changeNotifs: PropTypes.func,
  removeFriend: PropTypes.func,
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
    marginTop: '5%',
  },
  deleteButton: {
    borderColor: colors.hex,
    backgroundColor: colors.hex,
    marginHorizontal: '4%',
    paddingTop: '1%',
    paddingBottom: '1%',
    width: '40%',
  },
  deleteButtonText: {
    marginHorizontal: '7%',
    marginVertical: '1%',
    textAlign: 'center',
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
