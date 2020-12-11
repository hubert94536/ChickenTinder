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
import { NAME, PHOTO, USERNAME, DEFPHOTO, EMAIL } from 'react-native-dotenv'
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
import ImagePicker from 'react-native-image-crop-picker'
import defImages from '../assets/images/foodImages.js'
import uploadApi from '../apis/uploadApi.js'

const hex = '#F15763'
const font = 'CircularStd-Medium'
const height = Dimensions.get('window').height
var img = null
var name = ''
var username = ''
var email = ''

//  gets user info
AsyncStorage.getItem(USERNAME).then((res) => (username = res))
AsyncStorage.getItem(PHOTO).then((res) => (img = res))
AsyncStorage.getItem(NAME).then((res) => (name = res))
AsyncStorage.getItem(EMAIL).then((res) => (email = res))
//=========================Testing Code=========================================
import { ID } from 'react-native-dotenv'
import friendsApi from '../apis/friendsApi.js'

var myId = ''
AsyncStorage.getItem(ID).then((res) => {
  myId = res
})

const dummyFriends = () => {
        // uncomment if testing friends/requests
      //this.getNotifs();
      // accountsApi.createFBUser('Hubert', 2, 'hubesc', 'hubesc@gmail.com', 'hjgkjgkjg'),
      // accountsApi.createFBUser('Hanna', 3, 'hco', 'hco@gmail.com', 'sfhkslfs'),
      // accountsApi.createFBUser('Anna', 4, 'annax', 'annx@gmail.com', 'ksflsfsf'),
      // accountsApi.createFBUser('Helen', 5, 'helenthemelon', 'helenw@gmail.com', 'sjdkf'),
      // accountsApi.createFBUser('Kevin', 6, 'kevint', 'kevintang@gmail.com', 'sdfddf'),
      // accountsApi.createFBUser('David', 7, 'das', 'das@gmail.com', 'fhgdgffgad'),
      // accountsApi.createFBUser('Jeff', 8, 'jeffwinger', 'jeffw@gmail.com', 'sdfaadddf'),
      // accountsApi.createFBUser('Annie', 9, 'anniee', 'anniee@gmail.com', 'sdfgfsdddf'),
      // accountsApi.createFBUser('Britta', 10, 'theworst', 'brittap@gmail.com', 'sdfhgjddf'),
      
      // accountsApi.createFBUser('Ice Cream', 30, 'icecream', 'icecream@gmail.com', 'hjgkjgkjg')
      // accountsApi.createFBUser('Sundae', 31, 'sundae', 'sundae@gmail.com', 'sfhkslfs')
      // accountsApi.createFBUser('Float', 32, 'float', 'float@gmail.com', 'ksflsfsf')

      // console.log("My id:" + myId),
      // friendsApi.createFriendshipTest(1288355614841173, myId)
      // .then((res) => {
      //   console.log('this is the response: ' + res)
      // })
      // .catch((err)=>{
      //   console.log(err)
      // }),

      friendsApi.createFriendshipTest(myId, 31)
      
      friendsApi.createFriendshipTest(32, myId)
      

      // friendsApi.createFriendshipTest(3, myId),
      // friendsApi.createFriendshipTest(4, myId),
      // friendsApi.createFriendshipTest(5, myId),
      // friendsApi.createFriendshipTest(6, myId),
      // friendsApi.createFriendshipTest(7, myId),
      // friendsApi.createFriendshipTest(8, myId),
      // friendsApi.createFriendshipTest(9, myId),
      // friendsApi.createFriendshipTest(10, myId),
      // friendsApi.acceptFriendRequest(1288355614841173)
      // friendsApi.acceptFriendRequest(3)
      // friendsApi.acceptFriendRequest(4)
      // friendsApi.acceptFriendRequest(5)
      // friendsApi.acceptFriendRequest(6)
      // friendsApi.acceptFriendRequest(7)
      // friendsApi.acceptFriendRequest(8)
      // friendsApi.acceptFriendRequest(9)
      // friendsApi.acceptFriendRequest(10)
}
//==============================================================================

export default class UserProfileView extends Component {
  constructor(props) {
    super(props)
    this.state = {
      name: name,
      nameValue: name,
      username: username,
      usernameValue: username,
      image: img,
      oldImage: img,
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
      defImg: '',
    }
    AsyncStorage.getItem(USERNAME).then((res) => this.setState({ username: res }))
    AsyncStorage.getItem(PHOTO).then((res) => this.setState({ image: res, oldImage: res }))
    AsyncStorage.getItem(DEFPHOTO).then((res) =>
      this.setState({ defImg: defImages[parseInt(res)] }),
    )
    AsyncStorage.getItem(NAME).then((res) => this.setState({ name: res, nameValue: res }))
  }

  // getting current user's info
  async changeName() {
    if (this.state.nameValue !== this.state.name) {
      const name = this.state.nameValue
      return accountsApi
        .updateName(name)
        .then(() => {
          // update name locally
          console.log(name)
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
      console.log(this.state.oldImage)
      AsyncStorage.setItem(PHOTO, this.state.image)
    })
  }

  removePhoto() {
    this.setState({ image: null })
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
      uploadApi.uploadPhoto(this.state.imageData)
    }
  }

  editProfile() {
    this.setState({
      edit: true,
      nameValue: this.state.name,
      username: this.state.username,
      changeName: false,
    })
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

            {this.state.image ? (
              <Image
                source={{
                  uri: this.state.image,
                }}
                style={screenStyles.avatar}
              />
            ) : (
              <Image source={this.state.defImg} style={screenStyles.avatar} />
            )}

            <View style={{ alignItems: 'center' }}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <View style={{ width: 20, marginTop: '4%', marginLeft: '1%' }}></View>
                <Text style={{ fontFamily: font, fontSize: 20, marginTop: '4%' }}>
                  {this.state.name}
                </Text>
                <Icon
                  name="pencil-outline"
                  style={{ fontSize: 20, marginTop: '4%', marginLeft: '1%' }}
                  onPress={() => this.editProfile()}
                />
              </View>
              <Text style={{ fontFamily: font, fontSize: 13, color: hex }}>
                {'@' + this.state.username}
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
            <Text
              style={[
                screenStyles.text,
                { marginLeft: '7%', fontSize: 17, fontFamily: 'CircularStd-Medium' },
              ]}
            >
              {this.state.numFriends + ' friends'}
            </Text>
          </View>
          <View style={{ height: '50%', marginTop: '0%' }}>
            <Friends isFriends onFriendsChange={() => this.handleFriendsCount} />
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
                }}
              >
                <Text
                  style={[
                    screenStyles.textBold,
                    {
                      fontSize: 20,
                      marginLeft: '10%',
                      marginTop: '10%',
                      marginBottom: '5%',
                      alignSelf: 'center',
                    },
                  ]}
                >
                  Settings
                </Text>
                {/* old log out button */}
                {/* <TouchableHighlight
                  underlayColor={hex}
                  onShowUnderlay={() => this.setState({ logout: true })}
                  onHideUnderlay={() => this.setState({ logout: false })}
                  onPress={() => this.setState({ logoutAlert: true })}
                  style={[
                    screenStyles.smallButton,
                    styles.button,
                    this.state.logout ? { backgroundColor: hex } : { backgroundColor: 'white' },
                    { width: '28%', borderWidth: 1.5 },
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
                {this.state.logoutAlert && (
                  <Alert
                    title="Log out"
                    body="Are you sure you want to log out?"
                    buttonAff="Logout"
                    buttonNeg="Go back"
                    height="25%"
                    twoButton
                    press={() => this.handleLogout()}
                    cancel={() => this.cancelLogout()}
                  />
                )} */}
                <AntDesign
                  name="closecircleo"
                  style={[screenStyles.text, { margin: '5%', fontSize: 25 }]}
                  onPress={() =>
                    this.setState({
                      visible: false,
                    })
                  }
                />
              </View>
              <View
                style={{
                  justifyContent: 'space-between',
                  marginHorizontal: '10%',
                }}
              >
                <View>
                  <Text style={[{ fontFamily: font, fontSize: 18 }]}>Email</Text>
                  <TextInput
                    style={[
                      screenStyles.text,
                      screenStyles.input,
                      {
                        color: '#B2B2B2',
                        fontSize: 17,
                        alignSelf: 'stretch',
                        backgroundColor: '#F2F2F2',
                        borderWidth: 1,
                        borderColor: '#E0E0E0',
                        borderRadius: 5,
                        paddingHorizontal: 5,
                        paddingVertical: 2,
                        marginTop: '3%',
                      },
                    ]}
                    editable={false}
                    value={email}
                    onChangeText={(text) => this.setState({ nameValue: text })}
                  />
                </View>
              </View>
              <View
                style={{
                  justifyContent: 'space-between',
                  marginVertical: '5%',
                  marginHorizontal: '10%',
                }}
              >
                <Text style={{ fontFamily: font, fontSize: 18 }}>Phone Number</Text>
                <TextInput
                  style={[
                    screenStyles.text,
                    screenStyles.input,
                    {
                      color: '#B2B2B2',
                      fontSize: 15,
                      alignSelf: 'stretch',
                      backgroundColor: '#F2F2F2',
                      borderWidth: 1,
                      borderColor: '#E0E0E0',
                      borderRadius: 5,
                      paddingHorizontal: 5,
                      paddingVertical: 2,
                      marginTop: '3%',
                    },
                  ]}
                  editable={false}
                  value={'+0 (770) 090-0461'}
                  onChangeText={(text) => this.setState({ nameValue: text })}
                />
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                }}
              >
                <Text
                  onPress={() => this.setState({ deleteAlert: true })}
                  style={[
                    screenStyles.textBold,
                    { fontSize: 18, color: 'black', marginRight: '35%' },
                  ]}
                >
                  Delete account...
                </Text>
                {this.state.deleteAlert && [
                  <BlurView
                    blurType="dark"
                    blurAmount={10}
                    reducedTransparencyFallbackColor="black"
                  />,
                  <Alert
                    title="Delete account?"
                    body="By deleting your account, you will lose all of your data"
                    buttonAff="Delete"
                    buttonNeg="Go back"
                    twoButton
                    height="27%"
                    press={() => this.handleDelete()}
                    cancel={() => this.cancelDelete()}
                  />,
                ]}
                {this.state.errorAlert && (
                  <Alert
                    title="Error, please try again"
                    button
                    buttonText="Close"
                    press={() => this.closeError()}
                    cancel={() => this.closeError()}
                  />
                )}
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                }}
              >
                <TouchableHighlight
                  style={[
                    screenStyles.medButton,
                    {
                      backgroundColor: hex,
                      borderColor: hex,
                      marginTop: '7%',
                      width: '40%',
                    },
                  ]}
                  onPress={() => {
                    return true
                  }}
                  underlayColor="white"
                  onShowUnderlay={() => this.setState({ logout: true })}
                  onHideUnderlay={() => this.setState({ logout: false })}
                  onPress={() => this.setState({ logoutAlert: true })}
                >
                  <Text
                    style={[
                      screenStyles.smallButtonText,
                      { paddingTop: '5%', paddingBottom: '5%', fontSize: 19 },
                      this.state.logout ? { color: hex } : { color: 'white' },
                    ]}
                  >
                    Logout
                  </Text>
                </TouchableHighlight>
                {this.state.logoutAlert && (
                  <Alert
                    title="Log out"
                    body="Are you sure you want to log out?"
                    buttonAff="Logout"
                    buttonNeg="Go back"
                    height="25%"
                    twoButton
                    press={() => this.handleLogout()}
                    cancel={() => this.cancelLogout()}
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
                onPress={() => this.dontSave()}
              />
              <View style={{ textAlign: 'center', marginLeft: '10%', marginRight: '10%' }}>
                <Text style={[screenStyles.text, { fontSize: 16 }]}>Edit Profile</Text>

                {this.state.image == null && (
                  <Image
                    style={{
                      height: height * 0.13,
                      width: height * 0.13,
                      borderRadius: 60,
                      alignSelf: 'center',
                    }}
                    source={this.state.defImg}
                  />
                )}

                {this.state.image != null && (
                  <Image
                    source={{
                      uri: this.state.image,
                    }}
                    style={{
                      height: height * 0.13,
                      width: height * 0.13,
                      borderRadius: 60,
                      alignSelf: 'center',
                    }}
                  />
                )}

                <View
                  style={{ flexDirection: 'row', justifyContent: 'center', marginBottom: '4%' }}
                >
                  <Text
                    style={[screenStyles.text, { marginRight: '5%' }]}
                    onPress={() => this.uploadPhoto()}
                  >
                    Upload
                  </Text>
                  <Text
                    style={[screenStyles.text, { color: 'black', marginLeft: '5%' }]}
                    onPress={() => this.removePhoto()}
                  >
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
                  underlineColorAndroid="transparent"
                  spellCheck={false}
                  autoCorrect={false}
                  keyboardType="visible-password"
                  value={this.state.nameValue}
                  onChangeText={(text) => this.setState({ nameValue: text })}
                  // onSubmitEditing={() => this.makeChanges()}
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
                  underlineColorAndroid="transparent"
                  spellCheck={false}
                  autoCorrect={false}
                  keyboardType="visible-password"
                  value={this.state.usernameValue}
                  onChangeText={(text) => this.setState({ usernameValue: text })}
                  // onSubmitEditing={() => this.makeChanges()}
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
          {/* {this.state.deleteAlert && (
            <BlurView blurType="dark" blurAmount={10} reducedTransparencyFallbackColor="black" />
          )} */}
          {/* {this.state.deleteAlert && (
            <Alert
              title="Delete account?"
              body="By deleting your account, you will lose all of your data"
              buttonAff="Delete"
              buttonNeg="Go back"
              twoButton
              height="27%"
              press={() => this.handleDelete()}
              cancel={() => this.cancelDelete()}
            />
          )} */}
          {/* {this.state.logoutAlert && (
            // <Alert
            //   title="Log out"
            //   body="Are you sure you want to log out?"
            //   buttonAff="Logout"
            //   buttonNeg="Go back"
            //   height="25%"
            //   twoButton
            //   press={() => this.handleLogout()}
            //   cancel={() => this.cancelLogout()}
            // />
          )} */}
          {this.state.errorAlert && (
            <Alert
              title="Error, please try again"
              buttonAff="Close"
              height="20%"
              press={() => this.setState({ errorAlert: false })}
              cancel={() => this.setState({ errorAlert: false })}
            />
          )}
          {this.state.takenAlert && (
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
  modal: {
    height: height * 0.45,
    width: '85%',
    marginTop: '15%',
    backgroundColor: 'white',
    alignSelf: 'center',
    borderRadius: 15,
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
