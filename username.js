import React, {Component} from 'react';
import {
  StyleSheet,
  TouchableHighlight,
  View,
  Text,
  TextInput,
  Dimensions,
} from 'react-native';
import api from './api.js';
import AsyncStorage from '@react-native-community/async-storage';
import {NAME, USERNAME, ID, UID, EMAIL, PHOTO} from 'react-native-dotenv';
import Alert from './alert.js';

const hex = '#F25763';
const font = 'CircularStd-Medium';

class Username extends Component {
  state = {
    username: null,
    name: '',
    uid: '',
    id: '',
    email: '',
    photo: '',
    //showing alerts
    errorAlert: false,
    takenAlert: false,
  };

  closeTaken() {
    this.setState({takenAlert: false});
  }

  closeError() {
    this.setState({errorAlert: false});
  }

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
          this.setState({takenAlert: true});
        } else {
          this.setState({errorAlert: true});
        }
      })
      .catch(error => {
        console.log(error);
      });
  };

  render() {
    return (
      <View style={{flex: 1, justifyContent: 'center'}}>
        <TextInput
          style={{
            fontFamily: font,
            fontSize: 15,
            alignSelf: 'center',
            borderBottomColor: hex,
            borderBottomWidth: 2.5,
            margin: '3%',
            width: '70%',
          }}
          textAlign="center"
          placeholder={'Enter a username'}
          onChangeText={username => {
            this.setState({username});
          }}
          value={this.state.username}
        />
        <TouchableHighlight
          onShowUnderlay={this.underlayShow.bind(this)}
          onHideUnderlay={this.underlayHide.bind(this)}
          activeOpacity={1}
          underlayColor={hex}
          onPress={() => this.handleClick()}
          style={styles.button}>
          <Text style={this.state.pressed ? styles.yesPress : styles.noPress}>
            Enter
          </Text>
        </TouchableHighlight>
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
    );
  }
}

const styles = StyleSheet.create({
  button: {
    fontFamily: font,
    borderRadius: 25,
    borderWidth: 2.5,
    borderColor: hex,
    paddingVertical: 10,
    paddingHorizontal: 12,
    width: '70%',
    alignSelf: 'center',
  },
  yesPress: {
    fontFamily: font,
    alignSelf: 'center',
    color: '#fff',
    fontSize: 20,
  },
  noPress: {
    fontFamily: font,
    alignSelf: 'center',
    color: hex,
    fontSize: 20,
  },
});

export default Username;
