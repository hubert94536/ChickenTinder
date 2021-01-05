import React, { Component } from 'react'
import { Dimensions, Image, Keyboard, StyleSheet, Text, View } from 'react-native'
import { ID, NAME, PHOTO, USERNAME, DEFPHOTO, EMAIL } from 'react-native-dotenv'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { BlurView } from '@react-native-community/blur'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import Alert from '../modals/Alert.js'
import accountsApi from '../apis/accountsApi.js'
import facebookService from '../apis/facebookService.js'
import Friends from './Friends.js'
import modalStyles from '../../styles/modalStyles.js'
import normalize from '../../styles/normalize.js'
import screenStyles from '../../styles/screenStyles.js'
import TabBar from '../Nav.js'
import ImagePicker from 'react-native-image-crop-picker'
import defImages from '../assets/images/defImages.js'
import PropTypes from 'prop-types'
import EditProfile from '../modals/EditProfile.js'
import Settings from '../modals/ProfileSettings.js'

const hex = screenStyles.hex.color
const height = Dimensions.get('window').height
var email = ''
var id = ''

export default class UserProfileView extends Component {
  constructor(props) {
    super(props)
    this.state = {
      name: '',
      nameValue: '',
      username: '',
      usernameValue: '',
      image: '',
      oldImage: '',
      friends: true,
      visible: false,
      edit: false,
      changeName: false,
      changeUser: false,
      navigation: this.props.navigation,
      // button appearance
      logout: false,
      delete: false,
      // show alert
      logoutAlert: false,
      deleteAlert: false,
      errorAlert: false,
      // friends text
      numFriends: 0,
      imageData: null,
      // defImg: '',
    }

    AsyncStorage.multiGet([EMAIL, ID, NAME, PHOTO, USERNAME]).then((res) => {
      email = res[0][1]
      id = res[1][1]
      this.setState({
        // defImg: defImages[parseInt(res[0][1])],
        name: res[2][1],
        nameValue: res[2][1],
        image: res[3][1],
        oldImage: res[3][1],
        username: res[4][1],
        usernameValue: res[4][1],
      })
    })
}

  // getting current user's info
  async changeName() {
    if (this.state.nameValue !== this.state.name) {
      const name = this.state.nameValue
      return accountsApi
        .updateName(id, name)
        .then(() => {
          // update name locally
          AsyncStorage.setItem(NAME, name)
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
          return accountsApi.updateUsername(id, user).then(() => {
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
      .deleteUser(id)
      .then(() => {
        // close settings and navigate to Login
        this.setState({ visible: false })
        this.props.navigation.replace('Login')
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
        this.props.navigation.replace('Login')
      })
      .catch(() => {
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
        oldImage: this.state.image,
        image: image.path,
      })
      AsyncStorage.setItem(PHOTO, this.state.image)
    })
  }

  removePhoto() {
    this.setState({ image: defImages[Math.floor(Math.random() * defImages.length)].toString() })
    // TODO: delete from AWS
    AsyncStorage.setItem(PHOTO, this.state.image)
  }

  dontSave() {
    this.setState({ edit: false })
    if (this.state.oldImage != this.state.image) {
      this.setState({ image: this.state.oldImage })
      AsyncStorage.setItem(PHOTO, this.state.image)
    }
  }

  savePhoto() {
    this.setState({ edit: false })
    if (this.state.oldImage != this.state.image) {
      this.setState({ oldImage: this.state.image })
      AsyncStorage.setItem(PHOTO, this.state.image)
    }
  }

  editProfile() {
    this.setState({
      edit: true,
      nameValue: this.state.name,
      usernameValue: this.state.username,
      username: this.state.username,
      changeName: false,
    })
  }

  render() {
    const {
      image,
      defImg,
      name,
      username,
      numFriends,
      navigation,
      visible,
      edit,
      nameValue,
      usernameValue,
      errorAlert,
      takenAlert,
    } = this.state

    return (
      <View style={[screenStyles.mainContainer]}>
        <View style={styles.background}>
          <View>
            <View style={[styles.titleContainer]}>
              <View
                style={[screenStyles.icons, styles.filler]}
              ></View>
              <Text style={[screenStyles.text, styles.myProfile]}>
                Profile
              </Text>
              <Icon
                name="cog-outline"
                style={[screenStyles.icons, styles.cog]}
                onPress={() => this.setState({ visible: true })}
              />
            </View>

            {this.state.image.includes('file') || this.state.image.includes('http') ? (
              <Image
                source={{
                  uri: this.state.image,
                }}
                style={screenStyles.avatar}
              />
            ) : (
              <Image source={this.state.image} style={screenStyles.avatar} />
            )}

            <View style={[styles.infoContainer]}>
              <View
                style={[styles.nameContainer]}
              >
                <View style={[styles.nameFiller]}></View>
                <Text
                  style={screenStyles.text, styles.name}
                >
                  {name}
                </Text>
                <Icon
                  name="pencil-outline"
                  style={styles.pencil}
                  onPress={() => this.editProfile()}
                />
              </View>
              <Text style={screenStyles.text, styles.username}>{'@' + username}</Text>
            </View>
            <Text
              style={screenStyles.text, styles.friends}
            >
              Your Friends
            </Text>
            <Text
              style={[ screenStyles.text, styles.friendNum]}
            >
              {numFriends + ' friends'}
            </Text>
          </View>
          <View style={[styles.friendContainer]}>
            {/* Contains the search bar and friends display if has friends, otherwise no friends view */}
            <Friends isFriends onFriendsChange={(n) => this.handleFriendsCount(n)} />
          </View>
          {(visible || edit) && (
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
            email={email}
          />

          {edit && (
            <EditProfile
              // image = {this.state.image}
              defImage={defImg}
              image={this.state.image}
              name={nameValue}
              username={usernameValue}
              dontSave={() => this.dontSave()}
              uploadPhoto={() => this.uploadPhoto()}
              removePhoto={() => this.removePhoto()}
              makeChanges={() => this.makeChanges()}
              userChange={(text) => this.setState({ usernameValue: text })}
              nameChange={(text) => this.setState({ nameValue: text })}
            />
          )}

          {errorAlert && (
            <Alert
              title="Error, please try again"
              buttonAff="Close"
              height="20%"
              press={() => this.setState({ errorAlert: false })}
              cancel={() => this.setState({ errorAlert: false })}
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
        <TabBar
          goHome={() => navigation.popToTop()}
          goSearch={() => navigation.navigate('Search')}
          goNotifs={() => navigation.navigate('Notifications')}
          goProfile={() => navigation.navigate('Profile')}
          cur="Profile"
        />
      </View>
    )
  }
}

UserProfileView.propTypes = {
  navigation: PropTypes.object,
}

const styles = StyleSheet.create({
  background: { 
    backgroundColor: 'white', 
    height: '90%' 
  },
  titleContainer: { 
    flexDirection: 'row', 
    justifyContent: 'space-between' 
  },
  cog: { 
    margin: '5%', 
    textAlign: 'right' 
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  nameFiller: { 
    width: '4%', 
    marginTop: '4%', 
    marginLeft: '1%'
  },
  myProfile: {
    fontSize: normalize(25),
    alignSelf: 'center',
    marginRight: '0%',
    fontWeight: 'bold'
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
  name:
  { 
    fontSize: normalize(22),
    marginTop: '4%',
    fontWeight: 'bold' 
  },
  pencil:
  { fontSize: normalize(28), 
    marginTop: '4%', 
    marginLeft: '1%', 
    marginBottom: '1%' 
  },
  username:
  { fontSize: normalize(14), 
    color: hex,
    fontWeight: 'bold' 
  },
  friends:
  {
    marginTop: '5%',
    marginLeft: '7%',
    fontSize: normalize(20),
    fontWeight: 'bold',
  },
  friendNum:
  { marginLeft: '7%',
    fontSize: normalize(17), 
    fontFamily: 'CircularStd-Medium' 
  },
  friendContainer: { 
    height: '50%', 
    marginTop: '1%' 
  },
  filler: 
  { width: '7%', 
    margin: '5%', 
    textAlign: 'right' ,
  },
  infoContainer: { 
    alignItems: 'center' 
  },
})
