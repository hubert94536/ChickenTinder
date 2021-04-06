import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import PropTypes from 'prop-types'
import {
  changeImage,
  changeName,
  changeUsername,
  hideError,
  showError,
  setDisable,
  hideDisable,
  hideRefresh,
} from '../redux/Actions.js'
import { connect } from 'react-redux'
import { Image, ImageBackground, Keyboard, StyleSheet, Text, View } from 'react-native'
import { NAME, PHOTO, USERNAME } from 'react-native-dotenv'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { BlurView } from '@react-native-community/blur'
import ImagePicker from 'react-native-image-crop-picker'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import Alert from '../modals/Alert.js'
import accountsApi from '../apis/accountsApi.js'
import colors from '../../styles/colors.js'
import Confirmation from '../modals/Confirmation.js'
import loginService from '../apis/loginService.js'
import EditProfile from '../modals/EditProfile.js'
import Friends from './Friends.js'
import modalStyles from '../../styles/modalStyles.js'
import normalize from '../../styles/normalize.js'
import screenStyles from '../../styles/screenStyles.js'
import Settings from '../modals/ProfileSettings.js'
import socket from '../apis/socket.js'
import TabBar from '../Nav.js'
import auth from '@react-native-firebase/auth'

class UserProfileView extends Component {
  constructor(props) {
    super(props)
    this.state = {
      nameValue: this.props.name.name,
      usernameValue: this.props.username.username,
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
      blur: false,
      confirmation: false,
      // friends text
      numFriends: 0,
      imageData: null,
      // phone auth
      verificationId: null,
    }
  }

  componentDidMount() {
    this.props.hideRefresh()
  }

  // getting current user's info
  async changeName() {
    if (this.state.nameValue !== this.props.name.name) {
      const name = this.state.nameValue
      return accountsApi
        .updateName(name)
        .then(() => {
          socket.updateUser({ name: name })
          // update name locally
          AsyncStorage.setItem(NAME, name)
          this.props.changeName(name)
          Keyboard.dismiss()
        })
        .catch(() => {
          this.props.showError()
          this.setState({
            nameValue: this.props.name.name,
          })
          Keyboard.dismiss()
        })
    }
  }

  async changeUsername() {
    if (this.props.username.username !== this.state.usernameValue) {
      const user = this.state.usernameValue
      accountsApi
        .checkUsername(user)
        .then(() => {
          // update username locally
          return accountsApi.updateUsername(user).then(() => {
            socket.updateUser({ username: user })
            AsyncStorage.setItem(USERNAME, user)
            this.props.changeUsername(user)
            Keyboard.dismiss()
          })
        })
        .catch((error) => {
          console.log(error.status === 404)
          if (error.status === 404) {
            this.setState({ takenAlert: true })
          } else {
            this.props.hideError()
          }
          this.setState({ usernameValue: this.props.username.username })
          Keyboard.dismiss()
        })
    }
  }

  ////////////////////////////////////////////////////////////////////////////////
  ///////////////////////////////////PHONE AUTH///////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////

  // TODO: Create code input modal that for 6 digit code that executes the "verifyCode" function (below) upon submitting the code
  // More TODOs in functions below

  async handleDelete() {
    if (!this.props.disable) {
      this.props.setDisable()
      // Check if phone provider - if so, validate phone num
      if (auth().currentUser.providerData[0].providerId === 'phone') {
        auth()
          .verifyPhoneNumber(auth().currentUser.phoneNumber)
          .on('state_changed', (phoneAuthSnapshot) => {
            console.log('State: ', phoneAuthSnapshot.state)
            console.log(phoneAuthSnapshot)
            switch (phoneAuthSnapshot.state) {
              // Ask for code input
              case auth.PhoneAuthState.CODE_SENT:
                // Store verification id in state
                this.setState({ verificationId: phoneAuthSnapshot.verificationId })
                this.verifyCode('111111')
                // TODO: Display verification code input modal (6 digits)
                this.setState({ confirmation: true })
                break
              // Auto verified on android - proceed to delete account
              case auth.PhoneAuthState.AUTO_VERIFIED:
                this.setState({ verificationId: phoneAuthSnapshot.verificationId })
                this.verifyCode(phoneAuthSnapshot.code)
                break
              // Display error alert
              case auth.PhoneAuthState.ERROR:
                // TODO: Code could not be sent, display an error
                this.props.showError()
                break
            }
          })
      }
      // Not phone provider - delete the account
      else {
        loginService
          .deleteUser()
          .then(() => {
            // close settings and navigate to Login
            this.setState({ visible: false })
            this.props.navigation.replace('Login')
          })
          .catch(() => {
            this.props.hideError()
          })
      }
      this.props.hideDisable()
    }
  }

  // IMPORTANT: Code MUST be passed in as a string
  // NOTE: Currently only logs success. To delete, uncomment lines under log.
  async verifyCode(code) {
    console.log('Verifying code ', code)
    const credential = auth.PhoneAuthProvider.credential(this.state.verificationId, code)
    auth()
      .currentUser.reauthenticateWithCredential(credential)
      // If reauthentication succeeds, delete account using credential
      .then(() => {
        console.log('success')
        this.setState({ confirmation: false })
        // loginService
        // .deleteUserWithCredential(credential)
        // .then(() => {
        //   // close settings and navigate to Login
        //   this.setState({ visible: false })
        //   this.props.navigation.replace('Login')
        // })
        // .catch(() => {
        //   this.props.hideError()
        // })
      })
      .catch((error) => {
        console.log('Code verification failed')
        console.log(error)
        // TODO: Code could not be verified, disply an error
        this.setState({ confirmation: false })
        this.props.showError()
      })
  }

  ////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////

  // close alert for taken username
  closeTaken() {
    this.setState({ takenAlert: false })
  }

  // cancel deleting your account
  cancelDelete() {
    this.setState({ deleteAlert: false, visible: true })
  }

  async handleLogout() {
    if (!this.props.disable) {
      this.props.setDisable()
      loginService
        .logout()
        .then(() => {
          // close settings and navigate to Login
          this.setState({ visible: false })
          this.props.navigation.replace('Login')
        })
        .catch(() => {
          this.props.showError()
        })
        this.props.hideDisable()
    }
  }

  cancelLogout() {
    this.setState({ logoutAlert: false })
    this.props.hideDisable()
  }

  makeChanges() {
    if (this.props.name.name !== this.state.nameValue) {
      this.changeName()
    }
    if (this.props.username.username !== this.state.usernameValue) {
      if (this.state.usernameValue[0] === '@') {
        var userTemp = this.state.usernameValue.slice(1)
        this.setState({ usernameValue: userTemp })
      }
      this.changeUsername()
    }
    this.savePhoto()
  }

  handleFriendsCount(n) {
    this.setState({ numFriends: n })
  }

  // TODO: Change from photo picker from phone gallery to our default photos
  uploadPhoto() {
    ImagePicker.openPicker({
      width: 400,
      height: 400,
      cropping: true,
    }).then((image) => {
      this.setState({
        imageData: {
          uri: image.path,
          type: image.mime,
          name: 'avatar',
        },
        oldImage: this.props.image.image,
        image: image.path,
      })
      this.props.image.image = image.path
      AsyncStorage.setItem(PHOTO, this.props.image.image)
    })
  }

  dontSave() {
    this.setState({ edit: false })
  }

  savePhoto() {
    this.setState({ edit: false })
  }

  editProfile() {
    this.setState({
      edit: true,
      nameValue: this.props.name.name,
      usernameValue: this.props.username.username,
      changeName: false,
    })
  }

  render() {
    const { numFriends, visible, edit, logoutAlert, deleteAlert, blur, takenAlert } = this.state
    return (
      <ImageBackground
        style={screenStyles.screenBackground}
        source={require('../assets/backgrounds/Profile.png')}
      >
        <View>
          <View style={[styles.container]}>
            <View style={[screenStyles.icons, styles.filler]}></View>
            <Text style={[screenStyles.text, styles.myProfile]}>Profile</Text>
            <Icon
              name="cog-outline"
              style={[screenStyles.icons, styles.cog]}
              onPress={() => this.setState({ visible: true })}
            />
          </View>
          <Image
            source={{ uri: Image.resolveAssetSource(this.props.image.image).uri }}
            style={screenStyles.avatar}
          />
          <View style={[styles.alignCenter]}>
            <View style={[styles.container, styles.alignCenter]}>
              <Text style={(screenStyles.text, styles.name)}>{this.props.name.name}</Text>
              <Icon
                name="pencil-outline"
                style={styles.pencil}
                onPress={() => this.editProfile()}
              />
            </View>
            <Text style={(screenStyles.text, styles.username)}>
              {'@' + this.props.username.username}
            </Text>
          </View>
          <Text style={(screenStyles.text, styles.friends)}>Your Friends</Text>
          <Text style={[screenStyles.text, styles.friendNum]}>{numFriends + ' friends'}</Text>
        </View>
        <View style={[styles.friendContainer]}>
          {/* Contains the search bar and friends display if has friends, otherwise no friends view */}
          <Friends
            isFriends
            onFriendsChange={(n) => this.handleFriendsCount(n)}
            unfriendAlert={(bool) => this.setState({ blur: bool })}
          />
        </View>

        <TabBar
          goHome={() => this.props.navigation.replace('Home')}
          goSearch={() => this.props.navigation.replace('Search')}
          goNotifs={() => this.props.navigation.replace('Notifications')}
          goProfile={() => {}}
          cur="Profile"
        />

        {(visible || edit || logoutAlert || deleteAlert || blur || this.state.confirmation) && (
          <BlurView
            blurType="dark"
            blurAmount={10}
            reducedTransparencyFallbackColor="white"
            style={modalStyles.blur}
          />
        )}

        <Settings
          visible={visible}
          close={() => this.setState({ visible: false })}
          delete={() => this.handleDelete()}
          logout={() => this.handleLogout()}
          logoutAlert={() => this.setState({ logoutAlert: true })}
          deleteAlert={() => this.setState({ deleteAlert: true })}
        />

        <Confirmation
          visible={this.state.confirmation}
          close={() => this.setState({ confirmation: false })}
          show={() => this.setState({ confirmation: true })}
          verify={(code) => this.verifyCode(code)}
        />

        {edit && (
          <EditProfile
            dontSave={() => this.dontSave()}
            makeChanges={() => this.makeChanges()}
            userChange={(text) => this.setState({ usernameValue: text })}
            nameChange={(text) => this.setState({ nameValue: text })}
          />
        )}

        {logoutAlert && (
          <Alert
            title="Log out"
            body="Are you sure you want to log out?"
            buttonAff="Logout"
            buttonNeg="Back"
            height="25%"
            twoButton
            disabled={this.props.disable}
            press={() => this.handleLogout()}
            cancel={() => {
              this.setState({ logoutAlert: false, visible: true })
              this.props.hideDisable()
            }}
          />
        )}

        {deleteAlert && (
          <Alert
            title="Delete account?"
            body="By deleting your account, you will lose all of your data"
            buttonAff="Delete"
            buttonNeg="Back"
            twoButton
            height="25%"
            dispatch={this.props.disable}
            press={() => this.handleDelete()}
            cancel={() => this.cancelDelete()}
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
        {takenAlert && (
          <Alert
            title="Username taken!"
            buttonAff="Close"
            height="20%"
            press={() => this.closeTaken()}
            cancel={() => this.closeTaken()}
          />
        )}
      </ImageBackground>
    )
  }
}

const mapStateToProps = (state) => {
  const { error } = state
  const { name } = state
  const { username } = state
  const { image } = state
  const { disable } = state
  return { error, name, username, image, disable }
}

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      showError,
      hideError,
      changeName,
      changeUsername,
      changeImage,
      setDisable,
      hideDisable,
      hideRefresh,
    },
    dispatch,
  )

export default connect(mapStateToProps, mapDispatchToProps)(UserProfileView)

UserProfileView.propTypes = {
  navigation: PropTypes.object,
  showError: PropTypes.func,
  hideError: PropTypes.func,
  changeName: PropTypes.func,
  changeUsername: PropTypes.func,
  changeImage: PropTypes.func,
  name: PropTypes.object,
  username: PropTypes.object,
  image: PropTypes.object,
  error: PropTypes.bool,
  hideRefresh: PropTypes.func,
  setDisable: PropTypes.func,
  hideDisable: PropTypes.func,
  disable: PropTypes.bool,
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  alignCenter: {
    alignItems: 'center',
  },
  cog: {
    margin: '5%',
    textAlign: 'right',
    color: 'white',
  },
  myProfile: {
    fontSize: normalize(25),
    alignSelf: 'center',
    marginRight: '0%',
    fontWeight: 'bold',
    color: 'white',
  },
  name: {
    fontSize: normalize(22),
    fontWeight: 'bold',
    color: 'white',
  },
  pencil: {
    fontSize: normalize(28),
    marginLeft: '1%',
    marginBottom: '1%',
    color: 'white',
  },
  username: {
    fontSize: normalize(14),
    color: colors.hex,
    fontWeight: 'bold',
  },
  friends: {
    marginTop: '10%',
    marginLeft: '7%',
    fontSize: normalize(20),
    fontWeight: 'bold',
  },
  friendNum: {
    marginLeft: '7%',
    fontSize: normalize(17),
    fontFamily: 'CircularStd-Medium',
  },
  friendContainer: {
    height: '50%',
  },
  filler: {
    width: '7%',
    margin: '5%',
    textAlign: 'right',
  },
})
