import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { changeImage, changeName, changeUsername, hideError, showError } from '../redux/Actions.js'
import { connect } from 'react-redux'
import { Image, Keyboard, StyleSheet, Text, View } from 'react-native'
import { NAME, PHOTO, USERNAME } from 'react-native-dotenv'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { BlurView } from '@react-native-community/blur'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import Alert from '../modals/Alert.js'
import accountsApi from '../apis/accountsApi.js'
import colors from '../../styles/colors.js'
import facebookService from '../apis/facebookService.js'
import Friends from './Friends.js'
import global from '../../global.js'
import modalStyles from '../../styles/modalStyles.js'
import normalize from '../../styles/normalize.js'
import screenStyles from '../../styles/screenStyles.js'
import TabBar from '../Nav.js'
import ImagePicker from 'react-native-image-crop-picker'
import PropTypes from 'prop-types'
import EditProfile from '../modals/EditProfile.js'
import Settings from '../modals/ProfileSettings.js'

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
      // friends text
      numFriends: 0,
      imageData: null,
    }
  }

  // getting current user's info
  async changeName() {
    if (this.state.nameValue !== this.props.name.name) {
      const name = this.state.nameValue
      return accountsApi
        .updateName(name)
        .then(() => {
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

  async handleDelete() {
    facebookService
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

  // close alert for taken username
  closeTaken() {
    this.setState({ takenAlert: false })
  }

  // cancel deleting your account
  cancelDelete() {
    this.setState({ deleteAlert: false, visible: true })
  }

  async handleLogout() {
    facebookService
      .logoutWithFacebook()
      .then(() => {
        // close settings and navigate to Login
        this.setState({ visible: false })
        this.props.navigation.replace('Login')
      })
      .catch(() => {
        this.props.showError()
      })
  }

  cancelLogout() {
    this.setState({ logoutAlert: false })
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
      <View style={[screenStyles.mainContainer]}>
        <View style={styles.background}>
          <View>
            <View style={[styles.titleContainer]}>
              <View style={[screenStyles.icons, styles.filler]}></View>
              <Text style={[screenStyles.text, styles.myProfile]}>Profile</Text>
              <Icon
                name="cog-outline"
                style={[screenStyles.icons, styles.cog]}
                onPress={() => this.setState({ visible: true })}
              />
            </View>
            <Image source={this.props.image.image} style={screenStyles.avatar} />
            <View style={[styles.infoContainer]}>
              <View style={[styles.nameContainer]}>
                <View style={[styles.nameFiller]}></View>
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

          {(visible || edit || logoutAlert || deleteAlert || blur) && (
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
              buttonNeg="Go back"
              height="25%"
              twoButton
              press={() => this.handleLogout()}
              cancel={() => this.setState({ logoutAlert: false, visible: true })}
            />
          )}

          {deleteAlert && (
            <Alert
              title="Delete account?"
              body="By deleting your account, you will lose all of your data"
              buttonAff="Delete"
              buttonNeg="Go back"
              twoButton
              height="25%"
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
        </View>
      </View>
    )
  }
}

const mapStateToProps = (state) => {
  const { error } = state
  const { name } = state
  const { username } = state
  const { image } = state
  return { error, name, username, image }
}

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      showError,
      hideError,
      changeName,
      changeUsername,
      changeImage,
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
  // name: PropTypes.object,
  // username: PropTypes.object,
  // image: PropTypes.object,
  // error: PropTypes.bool,
}

const styles = StyleSheet.create({
  background: {
    backgroundColor: 'white',
    height: '100%',
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cog: {
    margin: '5%',
    textAlign: 'right',
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  nameFiller: {
    width: '4%',
    marginTop: '4%',
    marginLeft: '1%',
  },
  myProfile: {
    fontSize: normalize(25),
    alignSelf: 'center',
    marginRight: '0%',
    fontWeight: 'bold',
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
  name: {
    fontSize: normalize(22),
    marginTop: '4%',
    fontWeight: 'bold',
  },
  pencil: { fontSize: normalize(28), marginTop: '4%', marginLeft: '1%', marginBottom: '1%' },
  username: { fontSize: normalize(14), color: colors.hex, fontWeight: 'bold' },
  friends: {
    marginTop: '5%',
    marginLeft: '7%',
    fontSize: normalize(20),
    fontWeight: 'bold',
  },
  friendNum: { marginLeft: '7%', fontSize: normalize(17), fontFamily: 'CircularStd-Medium' },
  friendContainer: {
    height: '50%',
    marginTop: '1%',
  },
  filler: { width: '7%', margin: '5%', textAlign: 'right' },
  infoContainer: {
    alignItems: 'center',
  },
})
