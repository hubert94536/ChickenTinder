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
  Alert,
} from 'react-native';
import {BlurView} from '@react-native-community/blur';
import AsyncStorage from '@react-native-community/async-storage';
import {NAME, USERNAME, PHOTO} from 'react-native-dotenv';
import Icon from 'react-native-vector-icons/FontAwesome';
import Swiper from 'react-native-swiper';
import Friends from './friends.js';
import Requests from './requests.js';
import api from './api.js';

const hex = '#F25763';
const font = 'CircularStd-Medium';

export default class UserProfileView extends Component {
  state = {
    name: '',
    username: '',
    usernameValue: '',
    image: '',
    friends: true,
    visible: false,
    changeName: false,
    changeNameText: false,
    changeUser: false,
    changeUserText: false,
    // public: false,
  };

  //getting current user's info

  componentDidMount() {
    AsyncStorage.getItem(NAME).then(res =>
      this.setState({name: res, nameValue: res}),
    );
    AsyncStorage.getItem(USERNAME).then(res =>
      this.setState({username: '@' + res, usernameValue: '@' + res}),
    );
    AsyncStorage.getItem(PHOTO).then(res => this.setState({image: res}));
  }

  changeName() {
    if (this.state.changeName) {
      api
        .updateName(this.state.nameValue)
        .then(res => {
          if (res === 201) {
            AsyncStorage.setItem(NAME, this.state.name);
            this.setState({
              name: this.state.nameValue,
            });
          } else {
            Alert.alert('Error changing name. Please try again.');
            this.setState({
              nameValue: this.state.name,
            });
          }
        })
        .catch(err => {
          Alert.alert('Error changing name. Please try again.');
          this.setState({
            nameValue: this.state.name,
          });
          console.log(err);
        });
    }
    this.setState({
      changeName: !this.state.changeName,
    });
  }

  changeUsername() {
    if (this.state.changeUser) {
      const user = this.state.usernameValue.substring(1);
      api
        .checkUsername(user)
        .then(res => {
          if (res === 200) {
            api
              .updateUsername(user)
              .then(res => {
                if (res === 201) {
                  AsyncStorage.setItem(USERNAME, user);
                  this.setState({username: this.state.usernameValue});
                } else {
                  this.setState({usernameValue: this.state.username});
                  Alert.alert('Error changing username. Please try again.');
                }
              })
              .catch(err => {
                console.log(err);
                this.setState({usernameValue: this.state.username});
                Alert.alert('Error changing username. Please try again.');
              });
          } else if (res === 404) {
            this.setState({usernameValue: this.state.username});
            Alert.alert('Username taken!');
          } else {
            this.setState({usernameValue: this.state.username});
            Alert.alert('Error!');
          }
        })
        .catch(error => {
          console.log(error);
        });
    }
    this.setState({
      changeUser: !this.state.changeUser,
    });
  }

  render() {
    return (
      <View>
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
              <Text style={{fontSize: 17}}>{this.state.username}</Text>
            </View>
          </View>
          <View style={{flexDirection: 'row'}}>
            <TouchableHighlight
              underlayColor="#fff"
              style={this.state.friends ? styles.selected : styles.unselected}>
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
              style={!this.state.friends ? styles.selected : styles.unselected}>
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
                      changeName: false,
                      changeUser: false,
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
                  {!this.state.changeName && (
                    <Text style={{fontFamily: font, color: hex, fontSize: 20}}>
                      {this.state.name}
                    </Text>
                  )}
                  {this.state.changeName && (
                    <TextInput
                      style={{fontFamily: font, color: hex, fontSize: 20}}
                      value={this.state.nameValue}
                      onChangeText={text => this.setState({nameValue: text})}
                    />
                  )}
                </View>
                <TouchableHighlight
                  style={styles.changeButtons}
                  underlayColor={hex}
                  onShowUnderlay={() => this.setState({changeNameText: true})}
                  onHideUnderlay={() => this.setState({changeNameText: false})}
                  onPress={() => this.changeName()}>
                  <Text
                    style={
                      this.state.changeNameText
                        ? styles.changeTextSelected
                        : styles.changeText
                    }>
                    {this.state.changeName ? 'Submit' : 'Change'}
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
                  {!this.state.changeUser && (
                    <Text style={{fontFamily: font, color: hex, fontSize: 20}}>
                      {this.state.username}
                    </Text>
                  )}
                  {this.state.changeUser && (
                    <TextInput
                      style={{fontFamily: font, color: hex, fontSize: 20}}
                      value={this.state.usernameValue}
                      onChangeText={text =>
                        this.setState({usernameValue: text})
                      }
                    />
                  )}
                </View>
                <TouchableHighlight
                  style={styles.changeButtons}
                  underlayColor={hex}
                  onShowUnderlay={() => this.setState({changeUserText: true})}
                  onHideUnderlay={() => this.setState({changeUserText: false})}
                  onPress={() => this.changeUsername()}>
                  <Text
                    style={
                      this.state.changeUserText
                        ? styles.changeTextSelected
                        : styles.changeText
                    }>
                    {this.state.changeUser ? 'Submit' : 'Change'}
                  </Text>
                </TouchableHighlight>
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
    height: Dimensions.get('window').height * 0.4, //height with friends view was 50%
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
