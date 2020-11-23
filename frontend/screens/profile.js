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
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import Alert from '../modals/alert.js'
import accountsApi from '../apis/accountsApi.js'
import facebookService from '../apis/facebookService.js'
import Friends from './friends.js'
import screenStyles from '../../styles/screenStyles.js'
import modalStyles from '../../styles/modalStyles.js'
import TabBar from '../nav.js'
import AntDesign from 'react-native-vector-icons/AntDesign'

const hex = '#F15763'
const font = 'CircularStd-Medium'
const height = Dimensions.get('window').height
const width = Dimensions.get('window').width
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
      edit: false,
      changeName: false,
      changeUser: false,
      // button appearance
      logout: false,
      delete: false,
      // show alert
      logoutAlert: false,
      deleteAlert: false,
      errorAlert: false,
      // friends text
      numFriends: 0,
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
      .catch((error) => {
        this.setState({ errorAlert: true })
      })
  }

  cancelLogout() {
    this.setState({ logoutAlert: false })
  }

  makeChanges() {
    if (this.state.name !== this.state.nameValue) {
      this.changeName()
    }
    if (this.state.username !== this.state.usernameValue) {
      this.changeUsername()
    }
  }

  handleFriendsCount = (n) => {
    this.setState({numFriends: n})
  }

  render() {
    return (
      <View style={{ flex: 1, backgroundColor: 'white' }}>
        <View style={{ backgroundColor: 'white', height: '90%' }}>
          <View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <View
                style={[screenStyles.icons, { width: 27, margin: '5%', textAlign: 'right' }]}
              ></View>
              <Text style={[screenStyles.text, styles.myProfile]}>Profile</Text>
              <Icon
                name="cog-outline"
                style={[screenStyles.icons, { margin: '5%', textAlign: 'right' }]}
                onPress={() => this.setState({ visible: true })}
              />
            </View>
            <Image
              source={{
                uri: this.state.image,
              }}
              style={styles.avatar}
            />
            <View style={{ alignItems: 'center' }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <View
                  style={{ width: 20, marginTop: '4%', marginLeft: '1%' }}
                ></View>
                <Text style={{ fontFamily: font, fontSize: 20, marginTop: '4%' }}>
                  {this.state.name}
                </Text>
                <Icon
                  name="pencil-outline"
                  style={{ fontSize: 20, marginTop: '4%', marginLeft: '1%' }}
                  onPress={() => this.setState({ edit: true })}
                />
              </View>
              <Text style={{ fontFamily: font, fontSize: 13, color: hex }}>
                {'@' + this.state.usernameValue}
              </Text>
            </View>
            <Text
              style={{
                fontFamily: font,
                marginTop: '5%',
                marginLeft: '7%',
                fontSize: 20,
                fontWeight: 'bold',
              }}
            >
              Your Friends
            </Text>
            <Text style={[screenStyles.text, { marginLeft: '7%', fontSize: 17 }]}>{this.state.numFriends + ' friends'}</Text>
          </View>
          <View style={{ height: '100%', marginTop: '0%' }}>
            <Friends isFriends onFriendsChange={this.handleFriendsCount}/>
          </View>

          {(this.state.visible || this.state.edit) && (
            <BlurView
              blurType="dark"
              blurAmount={10}
              reducedTransparencyFallbackColor="white"
              style={modalStyles.blur}
            />
          )}
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
                <AntDesign
                  name="closecircleo"
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
            </View>
          </Modal>
          <Modal animationType="fade" transparent visible={this.state.edit}>
            <View
              style={[
                {
                  height: Dimensions.get('window').height * 0.5,
                  width: '75%',
                  marginTop: '15%',
                  backgroundColor: 'white',
                  elevation: 20,
                  alignSelf: 'center',
                  borderRadius: 10,
                },
              ]}
            >
              <AntDesign
                name="closecircleo"
                style={[
                  screenStyles.text,
                  {
                    fontSize: 18,
                    flexDirection: 'row',
                    alignSelf: 'flex-end',
                    marginTop: '4%',
                    marginRight: '4%',
                  },
                ]}
                onPress={() => this.setState({ edit: false })}
              />
              <View style={{ textAlign: 'center', marginLeft: '10%', marginRight: '10%' }}>
                <Text style={[screenStyles.text, { fontSize: 16 }]}>Edit Profile</Text>
                <Image
                  style={{
                    height: height * 0.13,
                    width: height * 0.13,
                    borderRadius: 60,
                    alignSelf: 'center',
                  }}
                  source={{
                    uri: this.state.image,
                  }}
                />
                <View
                  style={{ flexDirection: 'row', justifyContent: 'center', marginBottom: '4%' }}
                >
                  <Text style={[screenStyles.text, { marginRight: '5%' }]}>Upload</Text>
                  <Text style={[screenStyles.text, { color: 'black', marginLeft: '5%' }]}>
                    Remove
                  </Text>
                </View>
                <Text style={[screenStyles.text, { color: 'black', marginBottom: '2%' }]}>
                  Display name
                </Text>
                <TextInput
                  style={[
                    screenStyles.text,
                    screenStyles.input,
                    {
                      color: '#7d7d7d',
                      fontSize: 15,
                      borderBottomWidth: 1,
                      marginBottom: '7%',
                      borderColor: '#7d7d7d',
                    },
                  ]}
                  value={this.state.nameValue}
                  onChangeText={(text) => this.setState({ nameValue: text })}
                  onSubmitEditing={() => this.makeChanges()}
                />
                <Text style={[screenStyles.text, { color: 'black', marginBottom: '2%' }]}>
                  Username
                </Text>
                <TextInput
                  style={[
                    screenStyles.text,
                    screenStyles.input,
                    {
                      color: '#7d7d7d',
                      fontSize: 15,
                      borderBottomWidth: 1,
                      borderColor: '#7d7d7d',
                    },
                  ]}
                  value={this.state.usernameValue}
                  onChangeText={(text) => this.setState({ usernameValue: text })}
                  onSubmitEditing={() => this.makeChanges()}
                />
              </View>
              <TouchableHighlight
                style={[
                  screenStyles.medButton,
                  { backgroundColor: hex, borderColor: hex, margin: '7%', width: '50%' },
                ]}
                onPress={() => this.makeChanges()}
                underlayColor="white"
                onShowUnderlay={() => this.setState({ changeName: true })}
                onHideUnderlay={() => this.setState({ changeName: false })}
              >
                <Text
                  style={[
                    screenStyles.smallButtonText,
                    { padding: '10%' },
                    this.state.changeName ? { color: hex } : { color: 'white' },
                  ]}
                >
                  Save Changes
                </Text>
              </TouchableHighlight>
            </View>
          </Modal>
        </View>
        <TabBar
          goHome={() => this.props.navigation.navigate('Home')}
          goSearch={() => this.props.navigation.navigate('Search')}
          goNotifs={() => this.props.navigation.navigate('Notifications')}
          goProfile={() => this.props.navigation.navigate('Profile')}
          cur="Profile"
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  myProfile: {
    fontSize: 25,
    alignSelf: 'center',
    marginRight: '0%',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 63,
    borderWidth: 4,
    alignSelf: 'center',
  },
  modal: {
    height: height * 0.45,
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
  button: {
    alignSelf: 'center',
    width: '35%',
    marginRight: '5%',
    marginTop: '5%',
  },
})