import React, {Component, useState} from 'react';
import {
  StyleSheet,
  SafeAreaView,
  TouchableHighlight,
  View,
  Text,
  TextInput,
  Button,
  Alert,
} from 'react-native';
import api from './api.js';
import AsyncStorage from '@react-native-community/async-storage';
import {NAME, USERNAME, ID, UID, EMAIL, PHOTO} from 'react-native-dotenv';

class Username extends Component {
  state = {
    username: null,
    name: '',
    uid: '',
    id: '',
    email: '',
    photo: '',
  };

  async componentDidMount() {
    this.setState({
      name: await AsyncStorage.getItem(NAME),
      uid: await AsyncStorage.getItem(UID),
      id: await AsyncStorage.getItem(ID),
      email: await AsyncStorage.getItem(EMAIL),
      photo: await AsyncStorage.getItem(PHOTO),
    });
  }

  underlayShow() {
    this.setState({pressed: true});
  }

  underlayHide() {
    this.setState({pressed: false});
  }

  handleClick = () => {
    api
      .checkUsername(this.state.username)
      .then(res => {
        if (res === 200) {
          AsyncStorage.setItem(USERNAME, this.state.username);
          api.createFBUser(
            this.state.name,
            this.state.id,
            this.state.username,
            this.state.email,
            this.state.photo,
          ),
            this.props.navigation.navigate('Home');
        } else if (res === 404) {
          Alert.alert('Username taken!');
        } else {
          Alert.alert('Error!');
        }
      })
      .catch(error => {
        console.log(error);
      });
  };

  render() {
    return (
      <View>
        <TextInput
          placeholder={'Enter a username'}
          onChangeText={username => {
            this.setState({username});
          }}
          value={this.state.username}
        />
        {/* <Button title={'Enter'} onPress={this.handleClick} /> */}
        <TouchableHighlight
          onShowUnderlay={this.underlayShow.bind(this)}
          onHideUnderlay={this.underlayHide.bind(this)}
          activeOpacity={1}
          underlayColor="#3b5998"
          onPress={() => this.handleClick()}
          style={styles.button}>
          <Text style={this.state.pressed ? styles.yesPress : styles.noPress}>
            Enter
          </Text>
        </TouchableHighlight>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 25,
    borderWidth: 2.5,
    borderColor: '#3b5998',
    paddingVertical: 10,
    paddingHorizontal: 12,
    width: '70%',
    // marginTop: '50%',
    alignSelf: 'center',
  },
  yesPress: {
    alignSelf: 'center',
    color: '#fff',
  },
  noPress: {
    alignSelf: 'center',
    color: '#3b5998',
  },
});

export default Username;
