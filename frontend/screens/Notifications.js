import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import {
  Dimensions,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
} from 'react-native'
import { NAME, PHOTO, USERNAME } from 'react-native-dotenv'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { BlurView } from '@react-native-community/blur'
import { newNotif, noNotif } from '../redux/Actions.js'
import Swiper from 'react-native-swiper'
import PropTypes from 'prop-types'
import Alert from '../modals/Alert.js'
import accountsApi from '../apis/accountsApi.js'
import notificationsApi from '../apis/notificationsApi.js'
import colors from '../../styles/colors.js'
import screenStyles from '../../styles/screenStyles.js'
import modalStyles from '../../styles/modalStyles.js'
import NotifCard from '../cards/NotifCard.js'
import TabBar from '../Nav.js'

var img = ''
var name = ''
var username = ''

AsyncStorage.multiGet([NAME, PHOTO, USERNAME]).then((res) => {
  name = res[0][1]
  img = res[1][1]
  username = res[2][1]
})

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
      errorAlert: false,
      deleteFriend: false,
    }
  }

  componentDidMount() {
    this.getNotifs()
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
        image: '150',
        type: 'invited',
      },
      {
        name: 'Francis Feng',
        username: 'francis',
        uid: '8',
        image: '167',
        type: 'invited',
      },
      {
        name: 'Hubert Chen',
        username: 'hubesc',
        uid: '5',
        image: '165',
        type: 'requested',
      },
    ]

    notificationsApi
      .getNotifs()
      .then((res) => {
        notifList = res.notifs
        console.log(notifList)
        for (var notif in notifList) {
          pushNotifs.push(notifList[notif])
        }
        this.setState({ notifs: pushNotifs })

      })
      .catch(() => {
        this.props.showError()
      })

  }

  render() {
    var activityNotifs = []
    var requestNotifs = []
    var notifList = this.state.notifs
    // Create all friend/request cards
    if (Array.isArray(notifList) && notifList.length) {
      for (var i = 0; i < notifList.length; i++) {
        if (notifList[i].type == 'pending' || notifList[i].type == 'friends' || notifList[i].type == 'accepted'  ) {
          requestNotifs.push(
            <NotifCard
              total={this.state.notifs}
              name={notifList[i].senderName}
              username={notifList[i].senderUsername}
              uid={notifList[i].sender}
              image={notifList[i].senderPhoto}
              type={notifList[i].type}
              key={i}
              index={i}
              press={(uid, newArr, status) => this.removeRequest(uid, newArr, status)}
              showError={() => this.setState({ errorAlert: true })}
              removeError={() => this.setState({ errorAlert: false })}
              showDelete={() => this.setState({ deleteFriend: true })}
              removeDelete={() => this.setState({ deleteFriend: false })}
            />,
          )
        } else {
          activityNotifs.push(
            <NotifCard
              total={this.state.notifs}
              name={notifList[i].senderName}
              username={notifList[i].senderUsername}
              uid={notifList[i].sender}
              image={notifList[i].senderPhoto}
              type={notifList[i].type}
              key={i}
              index={i}
              press={(uid, newArr, status) => this.removeRequest(uid, newArr, status)}
              showError={() => this.setState({ errorAlert: true })}
              removeError={() => this.setState({ errorAlert: false })}
              showDelete={() => this.setState({ deleteFriend: true })}
              removeDelete={() => this.setState({ deleteFriend: false })}
            />,
          )
        }
      }
    }
    return (
      <ImageBackground
        source={require('../assets/backgrounds/Search.png')}
        style={styles.container}
      >
        <View>
          <Text style={[screenStyles.text, styles.NotifTitle]}>Notifications</Text>

          <View style={{ flexDirection: 'row' }}>
            <TouchableHighlight
              underlayColor="#fff"
              style={[
                // screenStyles.smallButton,
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
                  // this.state.activity ? { color: 'white' } : { color: hex },
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
        <View style={{ height: '100%', marginTop: '5%' }}>
          <Swiper
            ref="swiper"
            loop={false}
            onIndexChanged={() => this.setState({ activity: !this.state.activity })}
          >
            {/* <Friends isFriends /> */}
            {/* <View /> */}
            <ScrollView style={{ flexDirection: 'column' }}>{activityNotifs}</ScrollView>
            <ScrollView style={{ flexDirection: 'column' }}>{requestNotifs}</ScrollView>
            {/* <Friends isFriends={false} /> */}
          </Swiper>
        </View>

        {(this.state.visible || this.state.errorAlert || this.state.deleteFriend) && (
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
        {this.state.errorAlert && (
          <Alert
            title="Error, please try again"
            buttonAff="Close"
            height="20%"
            press={() => this.setState({ errorAlert: false })}
            cancel={() => this.setState({ errorAlert: false })}
          />
        )}
        <TabBar
          goHome={() => this.props.navigation.navigate('Home')}
          goSearch={() => this.props.navigation.navigate('Search')}
          goNotifs={() => {}}
          goProfile={() => this.props.navigation.navigate('Profile')}
          cur="Notifs"
        />
      </ImageBackground>
    )
  }
}

const mapStateToProps = (state) => {
  const { notif } = state
  return { notif }
}
//  access the state as this.props.notif
//  if that's giving you errors, use this.props.notif.notif

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      newNotif,
      noNotif,
    },
    dispatch,
  )
//  use as this.props.newNotif() or this.props.noNotif()
//  if that's giving you errors, use this.props.notif.newNotif()

export default connect(mapStateToProps, mapDispatchToProps)(Notif)

Notif.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  NotifTitle: {
    fontSize: 30,
    paddingTop: '5%',
    paddingLeft: '5%',
    paddingBottom: '5%',
    alignSelf: 'center',
    fontFamily: 'CircularStd-Bold',
    marginBottom: '10%',
    color: 'white',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 63,
    borderWidth: 4,
    margin: '5%',
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
})
