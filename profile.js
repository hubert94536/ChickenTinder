import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableHighlight,
  TextInput,
  Modal,
  Dimensions,
  Keyboard,
} from 'react-native';
import {BlurView} from '@react-native-community/blur';
import AsyncStorage from '@react-native-community/async-storage';
import {NAME, USERNAME, PHOTO} from 'react-native-dotenv';
import Icon from 'react-native-vector-icons/FontAwesome';
import Swiper from 'react-native-swiper';
import Friends from './friends.js';
import Requests from './requests.js';
import api from './api.js';
import {facebookService} from './facebookService.js';
import Alert from './alert.js';

const hex = '#F25763';
const font = 'CircularStd-Medium';
var img = '';
var name = '';
var username = '';

AsyncStorage.getItem(PHOTO).then(res => (img = res));
AsyncStorage.getItem(NAME).then(res => (name = res));
AsyncStorage.getItem(USERNAME).then(res => (username = res));
export default class UserProfileView extends Component {
  constructor(props) {
    super(props);
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
      // show button appearance
      logout: false,
      delete: false,
      // show alert
      logoutAlert: false,
      deleteAlert: false,
      // public: false,
    };
  }

  //getting current user's info

  async changeName() {
    if (this.state.nameValue !== this.state.name) {
      api
        .updateName(this.state.nameValue)
        .then(res => {
          // update name locally
          AsyncStorage.setItem(NAME, this.state.name);
          this.setState({name: this.state.nameValue});
          Keyboard.dismiss();
        })
        .catch(error => {
          this.setState({errorAlert: true});
          // Alert.alert('Error changing name. Please try again.');
          this.setState({
            nameValue: this.state.name,
          });
          Keyboard.dismiss();
        });
    }
  }

  async changeUsername() {
    if (this.state.username !== this.state.usernameValue) {
      const user = this.state.usernameValue;
      api
        .checkUsername(user)
        .then(() => {
          // update username locally
          api.updateUsername(user).then(() => {
            AsyncStorage.setItem(USERNAME, user);
            this.setState({username: this.state.usernameValue});
            Keyboard.dismiss();
          });
        })
        .catch(error => {
          if (error === 404) {
            this.setState({takenAlert: true});
            // Alert.alert('Username taken!');
          } else {
            this.setState({errorAlert: true});
            // Alert.alert('Error changing username. Please try again.');
          }
          this.setState({usernameValue: this.state.username});
          Keyboard.dismiss();
        });
    }
  }

  async handleDelete() {
    facebookService
      .deleteUser()
      .then(() => {
        // close settings and navigate to Login
        this.setState({visible: false});
        this.props.navigation.navigate('Login');
      })
      .catch(error => {
        console.log(error);
        //alert
      });
  }

  closeTaken() {
    this.setState({takenAlert: false});
  }

  closeError() {
    this.setState({errorAlert: false});
  }

  cancelDelete() {
    this.setState({deleteAlert: false});
  }

  async handleLogout() {
    facebookService
      .logoutWithFacebook()
      .then(() => {
        // close settings and navigate to Login
        this.setState({visible: false});
        this.props.navigation.navigate('Login');
      })
      .catch(error => {
        console.log(error);
        //alert
      });
  }

  cancelLogout() {
    this.setState({logoutAlert: false});
  }

  render() {
    return (
      <View style={{backgroundColor: 'white'}}>
        <View>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <Icon
              name="chevron-left"
              style={styles.topIcons}
              onPress={() => this.props.navigation.navigate('Home')}
            />
            <Icon
              name="cog"
              style={styles.topIcons}
              onPress={() => this.setState({visible: true})}
            />
          </View>
          <Text style={styles.myProfile}>My Profile</Text>
          <View style={styles.userInfo}>
            <Image
              source={{
                uri: this.state.image,
              }}
              style={styles.avatar}
            />
            <View style={{fontFamily: font}}>
              <Text style={{fontSize: 28, fontWeight: 'bold'}}>
                {this.state.name}
              </Text>
              <Text style={{fontSize: 17}}>
                {'@' + this.state.usernameValue}
              </Text>
            </View>
          </View>
          <View style={{flexDirection: 'row'}}>
            <TouchableHighlight
              underlayColor="#fff"
              style={this.state.friends ? styles.selected : styles.unselected}
              onPress={() => this.refs.swiper.scrollBy(-1)}>
              <Text
                style={
                  this.state.friends
                    ? styles.selectedText
                    : styles.unselectedText
                }>
                Friends
              </Text>
            </TouchableHighlight>
            <TouchableHighlight
              underlayColor="#fff"
              style={!this.state.friends ? styles.selected : styles.unselected}
              onPress={() => this.refs.swiper.scrollBy(1)}>
              <Text
                style={
                  !this.state.friends
                    ? styles.selectedText
                    : styles.unselectedText
                }>
                Requests
              </Text>
            </TouchableHighlight>
          </View>
        </View>
        <View style={{height: '100%', marginTop: '5%'}}>
          <Swiper
            ref="swiper"
            loop={false}
            onMomentumScrollEnd={() =>
              this.setState({friends: !this.state.friends})
            }>
            <Friends />
            <Requests />
          </Swiper>
        </View>
        {this.state.visible && (
          <BlurView
            blurType="light"
            blurAmount={20}
            reducedTransparencyFallbackColor="white"
            style={{position: 'absolute', top: 0, bottom: 0, left: 0, right: 0}}
          />
        )}
        {this.state.visible && (
          <Modal
            animationType={'fade'}
            visible={this.state.visible}
            transparent={true}>
            <View style={styles.modal}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  margin: '5%',
                }}>
                <Text
                  style={{
                    fontFamily: font,
                    fontSize: 18,
                    color: hex,
                    alignSelf: 'center',
                  }}>
                  Settings
                </Text>
                <Icon
                  name="times-circle"
                  style={{color: hex, fontFamily: font, fontSize: 30}}
                  onPress={() =>
                    this.setState({
                      visible: false,
                      usernameValue: this.state.username,
                      nameValue: this.state.name,
                    })
                  }
                />
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  margin: '5%',
                }}>
                <View>
                  <Text style={{fontFamily: font, fontSize: 18}}>Name:</Text>
                  <TextInput
                    style={{
                      fontFamily: font,
                      color: hex,
                      fontSize: 20,
                      margin: 0,
                      padding: 0,
                    }}
                    value={this.state.nameValue}
                    onChangeText={text => this.setState({nameValue: text})}
                  />
                </View>
                <TouchableHighlight
                  style={styles.changeButtons}
                  underlayColor={hex}
                  onShowUnderlay={() => this.setState({changeName: true})}
                  onHideUnderlay={() => this.setState({changeName: false})}
                  onPress={() => this.changeName()}>
                  <Text
                    style={
                      this.state.changeName
                        ? styles.changeTextSelected
                        : styles.changeText
                    }>
                    Change
                  </Text>
                </TouchableHighlight>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  margin: '5%',
                }}>
                <View>
                  <Text style={{fontFamily: font, fontSize: 18}}>
                    Username:
                  </Text>
                  <TextInput
                    style={{
                      fontFamily: font,
                      color: hex,
                      fontSize: 20,
                      margin: 0,
                      padding: 0,
                    }}
                    value={this.state.usernameValue}
                    onChangeText={text => this.setState({usernameValue: text})}
                  />
                </View>
                <TouchableHighlight
                  style={styles.changeButtons}
                  underlayColor={hex}
                  onShowUnderlay={() => this.setState({changeUser: true})}
                  onHideUnderlay={() => this.setState({changeUser: false})}
                  onPress={() => this.changeUsername()}>
                  <Text
                    style={
                      this.state.changeUser
                        ? styles.changeTextSelected
                        : styles.changeText
                    }>
                    Change
                  </Text>
                </TouchableHighlight>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                }}>
                <TouchableHighlight
                  underlayColor={hex}
                  onShowUnderlay={() => this.setState({delete: true})}
                  onHideUnderlay={() => this.setState({delete: false})}
                  onPress={() => this.setState({deleteAlert: true})}
                  style={{
                    alignSelf: 'center',
                    borderWidth: 2,
                    borderColor: hex,
                    borderRadius: 50,
                    width: '35%',
                    marginRight: '5%',
                    backgroundColor: this.state.delete ? hex : 'white',
                    marginTop: '5%',
                  }}>
                  <Text
                    style={
                      this.state.delete
                        ? styles.changeTextSelected
                        : styles.changeText
                    }>
                    Delete
                  </Text>
                </TouchableHighlight>
                <TouchableHighlight
                  underlayColor={hex}
                  onShowUnderlay={() => this.setState({logout: true})}
                  onHideUnderlay={() => this.setState({logout: false})}
                  onPress={() => this.setState({logoutAlert: true})}
                  style={{
                    alignSelf: 'center',
                    borderWidth: 2,
                    borderColor: hex,
                    borderRadius: 50,
                    width: '35%',
                    backgroundColor: this.state.logout ? hex : 'white',
                    marginTop: '5%',
                  }}>
                  <Text
                    style={
                      this.state.logout
                        ? styles.changeTextSelected
                        : styles.changeText
                    }>
                    Logout
                  </Text>
                </TouchableHighlight>
                {this.state.deleteAlert && (
                  <Alert
                    title="Delete your account?"
                    body="You will not be able to recover your information"
                    button={true}
                    buttonText="Yes"
                    press={() => this.handleDelete()}
                    cancel={() => this.cancelDelete()}
                  />
                )}
                {this.state.logoutAlert && (
                  <Alert
                    title="Log Out?"
                    body="You will have to log back in"
                    button={true}
                    buttonText="Yes"
                    press={() => this.handleLogout()}
                    cancel={() => this.cancelLogout()}
                  />
                )}
                {this.state.errorAlert && (
                  <Alert
                    title="Error, please try again"
                    button={true}
                    buttonText="Close"
                    press={() => this.closeError()}
                    cancel={() => this.closeError()}
                  />
                )}
                {this.state.takenAlert && (
                  <Alert
                    title="Username taken!"
                    button={true}
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
    );
  }
}

const styles = StyleSheet.create({
  topIcons: {
    color: hex,
    fontSize: 27,
    margin: '5%',
  },
  myProfile: {
    color: hex,
    fontWeight: 'bold',
    fontSize: 17,
    paddingLeft: '5%',
    fontFamily: font,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 63,
    borderWidth: 4,
    margin: '5%',
  },
  userInfo: {flexDirection: 'row', alignItems: 'center'},
  selected: {
    borderRadius: 40,
    borderColor: hex,
    borderWidth: 2,
    marginLeft: '5%',
    backgroundColor: hex,
  },
  unselected: {
    borderRadius: 40,
    borderColor: hex,
    borderWidth: 2,
    marginLeft: '5%',
    backgroundColor: '#fff',
  },
  selectedText: {
    fontFamily: font,
    color: '#fff',
    fontSize: 17,
    paddingLeft: '3%',
    paddingRight: '3%',
    paddingTop: '0.5%',
    paddingBottom: '0.5%',
  },
  unselectedText: {
    fontFamily: font,
    color: hex,
    fontSize: 17,
    paddingLeft: '3%',
    paddingRight: '3%',
    paddingTop: '0.5%',
    paddingBottom: '0.5%',
  },
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
    borderWidth: 2,
    borderColor: hex,
    borderRadius: 50,
    width: '35%',
  },
  changeText: {
    fontFamily: font,
    color: hex,
    textAlign: 'center',
    fontSize: 17,
    paddingTop: '2.5%',
    paddingBottom: '2.5%',
  },
  changeTextSelected: {
    fontFamily: font,
    color: 'white',
    textAlign: 'center',
    fontSize: 17,
    paddingTop: '2.5%',
    paddingBottom: '2.5%',
  },
});
