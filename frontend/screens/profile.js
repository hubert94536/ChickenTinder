import React, { Component } from 'react'
import {
  Dimensions,
  Image,
  Keyboard,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableHighlight,
  View,
} from 'react-native'
import { NAME, PHOTO, USERNAME } from 'react-native-dotenv'
import AsyncStorage from '@react-native-community/async-storage'
import { BlurView } from '@react-native-community/blur'
import Icon from 'react-native-vector-icons/FontAwesome'
import Swiper from 'react-native-swiper'
import Alert from '../modals/alert.js'
import accountsApi from '../apis/accountsApi.js'
import facebookService from '../apis/facebookService.js'
import Friends from './friends.js'
import screenStyles from '../../styles/screenStyles.js'
import modalStyles from '../../styles/modalStyles.js'
import PropTypes from 'prop-types'

const hex = '#F25763'
const font = 'CircularStd-Bold'
var img = ''
var name = ''
var username = ''

//  gets user info
AsyncStorage.getItem(USERNAME).then((res) => (username = res))
AsyncStorage.getItem(PHOTO).then((res) => (img = res))
AsyncStorage.getItem(NAME).then((res) => (name = res))

export default class UserProfileView extends Component {
  constructor(props) {
    super(props)
    this.state = {
      name: name,
      nameValue: name,
      username: username,
      usernameValue: username,
      image: img,
      friends: true,
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
    }
  }

  // getting current user's info
  async changeName() {
    if (this.state.nameValue !== this.state.name) {
      return accountsApi
        .updateName(this.state.nameValue)
        .then(() => {
          // update name locally
          AsyncStorage.setItem(NAME, this.state.name)
          this.setState({ name: this.state.nameValue })
          Keyboard.dismiss()
        })
        .catch(() => {
          this.setState({ errorAlert: true })
          this.setState({
            nameValue: this.state.name,
          })
          Keyboard.dismiss()
        })
    }
  }

  async changeUsername() {
    if (this.state.username !== this.state.usernameValue) {
      const user = this.state.usernameValue
      return accountsApi
        .checkUsername(user)
        .then(() => {
          // update username locally
          return accountsApi.updateUsername(user).then(() => {
            AsyncStorage.setItem(USERNAME, user)
            this.setState({ username: this.state.usernameValue })
            Keyboard.dismiss()
          })
        })
        .catch((error) => {
          if (error === 404) {
            this.setState({ takenAlert: true })
          } else {
            this.setState({ errorAlert: true })
          }
          this.setState({ usernameValue: this.state.username })
          Keyboard.dismiss()
        })
    }
  }

  async handleDelete() {
    facebookService
      .deleteUser()
      .then(() => {
        // close settings and navigate to Login
        this.setState({ visible: false })
        this.props.navigation.navigate('Login')
      })
      .catch(() => {
        this.setState({ errorAlert: true })
      })
  }

  // close alert for taken username
  closeTaken() {
    this.setState({ takenAlert: false })
  }

  // close alert for error
  closeError() {
    this.setState({ errorAlert: false })
  }

  // cancel deleting your account
  cancelDelete() {
    this.setState({ deleteAlert: false })
  }

  async handleLogout() {
    facebookService
      .logoutWithFacebook()
      .then(() => {
        // close settings and navigate to Login
        this.setState({ visible: false })
        this.props.navigation.navigate('Login')
      })
      .catch(() => {
        this.setState({ errorAlert: true })
      })
  }

  cancelLogout() {
    this.setState({ logoutAlert: false })
  }

  render() {
    return (
      <View style={{ backgroundColor: 'white' }}>
        <View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Icon
              name="chevron-left"
              style={[screenStyles.icons, { margin: '5%' }]}
              onPress={() => this.props.navigation.navigate('Home')}
            />
            <Icon
              name="cog"
              style={[screenStyles.icons, { margin: '5%' }]}
              onPress={() => this.setState({ visible: true })}
            />
          </View>
          <Text style={[screenStyles.text, styles.myProfile]}>My Profile</Text>
          <View style={styles.userInfo}>
            <Image
              source={{
                uri: this.state.image,
              }}
              style={styles.avatar}
            />
            <View>
              <Text style={{ fontFamily: font, fontSize: 28 }}>{this.state.name}</Text>
              <Text style={{ fontFamily: font, fontSize: 17 }}>
                {'@' + this.state.usernameValue}
              </Text>
            </View>
          </View>
          <View style={{ flexDirection: 'row' }}>
            <TouchableHighlight
              underlayColor="#fff"
              style={[
                screenStyles.smallButton,
                this.state.friends ? { backgroundColor: hex } : { backgroundColor: 'white' },
                { marginLeft: '5%' },
              ]}
              onPress={() => this.swiperRef.scrollBy(-1)}
            >
              <Text
                style={[
                  screenStyles.smallButtonText,
                  styles.selectedText,
                  this.state.friends ? { color: 'white' } : { color: hex },
                ]}
              >
                Friends
              </Text>
            </TouchableHighlight>
            <TouchableHighlight
              underlayColor="#fff"
              style={[
                screenStyles.smallButton,
                !this.state.friends ? { backgroundColor: hex } : { backgroundColor: 'white' },
                { marginLeft: '5%' },
              ]}
              onPress={() => this.swiperRef.scrollBy(1)}
            >
              <Text
                style={[
                  screenStyles.smallButtonText,
                  styles.selectedText,
                  !this.state.friends ? { color: 'white' } : { color: hex },
                ]}
              >
                Requests
              </Text>
            </TouchableHighlight>
          </View>
        </View>
        <View style={{ height: '100%', marginTop: '5%' }}>
          <Swiper
            ref={(ref) => (this.swiperRef = ref)}
            loop={false}
            onIndexChanged={() => this.setState({ friends: !this.state.friends })}
          >
            <Friends isFriends />
            <Friends isFriends={false} />
          </Swiper>
        </View>
        {this.state.visible && (
          <BlurView
            blurType="light"
            blurAmount={20}
            reducedTransparencyFallbackColor="white"
            style={modalStyles.blur}
          />
        )}
        {this.state.visible && (
          <Modal animationType="fade" visible={this.state.visible} transparent>
            <View style={styles.modal}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  margin: '5%',
                }}
              >
                <Text style={[screenStyles.text, { fontSize: 18, alignSelf: 'center' }]}>
                  Settings
                </Text>
                <Icon
                  name="times-circle"
                  style={[screenStyles.text, { fontSize: 30 }]}
                  onPress={() =>
                    this.setState({
                      visible: false,
                    })
                  }
                />
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  margin: '5%',
                }}
              >
                <View>
                  <Text style={{ fontFamily: font, fontSize: 18 }}>Name:</Text>
                  <TextInput
                    style={[screenStyles.text, screenStyles.input]}
                    value={this.state.nameValue}
                    onChangeText={(text) => this.setState({ nameValue: text })}
                  />
                </View>
                <TouchableHighlight
                  style={[
                    screenStyles.smallButton,
                    styles.changeButtons,
                    this.state.changeName ? { backgroundColor: hex } : { backgroundColor: 'white' },
                  ]}
                  underlayColor={hex}
                  onShowUnderlay={() => this.setState({ changeName: true })}
                  onHideUnderlay={() => this.setState({ changeName: false })}
                  onPress={() => this.changeName()}
                >
                  <Text
                    style={[
                      screenStyles.smallButtonText,
                      this.state.changeName ? { color: 'white' } : { color: hex },
                    ]}
                  >
                    Change
                  </Text>
                </TouchableHighlight>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  margin: '5%',
                }}
              >
                <View>
                  <Text style={{ fontFamily: font, fontSize: 18 }}>Username:</Text>
                  <TextInput
                    style={[screenStyles.text, screenStyles.input]}
                    value={this.state.usernameValue}
                    onChangeText={(text) => this.setState({ usernameValue: text })}
                  />
                </View>
                <TouchableHighlight
                  style={[
                    screenStyles.smallButton,
                    styles.changeButtons,
                    this.state.changeUser ? { backgroundColor: hex } : { backgroundColor: 'white' },
                  ]}
                  underlayColor={hex}
                  onShowUnderlay={() => this.setState({ changeUser: true })}
                  onHideUnderlay={() => this.setState({ changeUser: false })}
                  onPress={() => this.changeUsername()}
                >
                  <Text
                    style={[
                      screenStyles.smallButtonText,
                      this.state.changeUser ? { color: 'white' } : { color: hex },
                    ]}
                  >
                    Change
                  </Text>
                </TouchableHighlight>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                }}
              >
                <TouchableHighlight
                  underlayColor={hex}
                  onShowUnderlay={() => this.setState({ delete: true })}
                  onHideUnderlay={() => this.setState({ delete: false })}
                  onPress={() => this.setState({ deleteAlert: true })}
                  style={[
                    screenStyles.smallButton,
                    styles.button,
                    this.state.delete ? { backgroundColor: hex } : { backgroundColor: 'white' },
                  ]}
                >
                  <Text
                    style={[
                      screenStyles.smallButtonText,
                      this.state.delete ? { color: 'white' } : { color: hex },
                    ]}
                  >
                    Delete
                  </Text>
                </TouchableHighlight>
                <TouchableHighlight
                  underlayColor={hex}
                  onShowUnderlay={() => this.setState({ logout: true })}
                  onHideUnderlay={() => this.setState({ logout: false })}
                  onPress={() => this.setState({ logoutAlert: true })}
                  style={[
                    screenStyles.smallButton,
                    styles.button,
                    this.state.logout ? { backgroundColor: hex } : { backgroundColor: 'white' },
                  ]}
                >
                  <Text
                    style={[
                      screenStyles.smallButtonText,
                      this.state.logout ? { color: 'white' } : { color: hex },
                    ]}
                  >
                    Logout
                  </Text>
                </TouchableHighlight>
                {this.state.deleteAlert && (
                  <Alert
                    title="Delete your account?"
                    body="You will not be able to recover your information"
                    button
                    buttonText="Yes"
                    press={() => this.handleDelete()}
                    cancel={() => this.cancelDelete()}
                  />
                )}
                {this.state.logoutAlert && (
                  <Alert
                    title="Log Out?"
                    body="You will have to log back in"
                    button
                    buttonText="Yes"
                    press={() => this.handleLogout()}
                    cancel={() => this.cancelLogout()}
                  />
                )}
                {this.state.errorAlert && (
                  <Alert
                    title="Error, please try again"
                    button
                    buttonText="Close"
                    press={() => this.closeError()}
                    cancel={() => this.closeError()}
                  />
                )}
                {this.state.takenAlert && (
                  <Alert
                    title="Username taken!"
                    button
                    buttonText="Close"
                    press={() => this.closeTaken()}
                    cancel={() => this.closeTaken()}
                  />
                )}
              </View>
              {/* <View
                style={{
                  margin: '5%',
                }}>
                <Text style={{fontFamily: font, fontSize: 18}}>
                  Friends List Display:
                </Text>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                    margin: '5%',
                  }}>
                  <TouchableHighlight
                    underlayColor={hex}
                    onShowUnderlay={() => this.setState({public: true})}
                    style={{
                      alignSelf: 'center',
                      borderWidth: 2,
                      borderColor: hex,
                      borderRadius: 50,
                      width: '35%',
                      marginRight: '5%',
                      backgroundColor: this.state.public ? hex : 'white',
                    }}
                    onPress={() => this.setState({public: true})}>
                    <Text
                      style={
                        this.state.public
                          ? styles.changeTextSelected
                          : styles.changeText
                      }>
                      Public
                    </Text>
                  </TouchableHighlight>
                  <TouchableHighlight
                    underlayColor={hex}
                    onShowUnderlay={() => this.setState({public: false})}
                    style={{
                      alignSelf: 'center',
                      borderWidth: 2,
                      borderColor: hex,
                      borderRadius: 50,
                      width: '35%',
                      backgroundColor: this.state.public ? 'white' : hex,
                    }}
                    onPress={() => this.setState({public: false})}>
                    <Text
                      style={
                        this.state.public
                          ? styles.changeText
                          : styles.changeTextSelected
                      }>
                      Private
                    </Text>
                  </TouchableHighlight>
                </View>
              </View> */}
            </View>
          </Modal>
        )}
      </View>
    )
  }
}

UserProfileView.propTypes = {
  navigation: PropTypes.bool,
}

const styles = StyleSheet.create({
  myProfile: {
    fontSize: 17,
    paddingLeft: '5%',
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
