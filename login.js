import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  Button,
  Alert,
  TouchableHighlight,
} from 'react-native';
import {facebookService} from './facebookService.js';
import Icon from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from '@react-native-community/async-storage';
import FBSDK from 'react-native-fbsdk';
import firebase from 'firebase';
import api from './api.js';
import {USERNAME, NAME, ID, UID, EMAIL, PHOTO} from 'react-native-dotenv';
const {LoginManager, AccessToken, GraphRequest, GraphRequestManager} = FBSDK;

const hex = '#F25763';

export default class Login extends React.Component {
  constructor() {
    super();
    this.state = {
      pressed: false,
    };
  }

  underlayShow() {
    this.setState({pressed: true});
  }

  underlayHide() {
    this.setState({pressed: false});
  }

  render() {
    return (
      <View>
        <Text
          style={{
            fontSize: 50,
            color: hex,
            alignSelf: 'center',
            fontFamily: 'CircularStd-Medium',
            fontWeight: 'bold',
            marginTop: '40%',
          }}>
          Welcome!
        </Text>
        <Text
          style={{
            fontFamily: 'CircularStd-Medium',
            alignSelf: 'center',
            color: hex,
            fontSize: 30,
          }}>
          Let's get goin'.
        </Text>
        <TouchableHighlight
          onShowUnderlay={this.underlayShow.bind(this)}
          onHideUnderlay={this.underlayHide.bind(this)}
          activeOpacity={1}
          underlayColor="#3b5998"
          onPress={() => this.login()}
          style={styles.button}>
          <Text style={this.state.pressed ? styles.yesPress : styles.noPress}>
            {/* <Icon name="facebook" style={{fontSize: 20}} /> */}
            Log in with Facebook
          </Text>
        </TouchableHighlight>
      </View>
    );
  }

  handleClick = async () => {
    // const result = await facebookService.loginWithFacebook();
    // console.log(result);
    // this.props.navigation.navigate(result);

    LoginManager.logInWithPermissions(['public_profile', 'email'])
      .then(login => {
        if (login.isCancelled) {
          console.log('cancelled');
          return Promise.reject(new Error('Cancelled request'));
        }
        console.log('access token');
        return AccessToken.getCurrentAccessToken();
      })
      .then(data => {
        const credential = firebase.auth.FacebookAuthProvider.credential(
          data.accessToken,
        );
        console.log('credential');
        return firebase.auth().signInWithCredential(credential);
      })
      .then(currentUser => {
        let p;
        console.log('new user');
        if (currentUser.additionalUserInfo.isNewUser) {
          AsyncStorage.setItem(UID, firebase.auth().currentUser.uid);
          AsyncStorage.setItem(
            NAME,
            currentUser.additionalUserInfo.profile.name,
          );
          AsyncStorage.setItem(ID, currentUser.additionalUserInfo.profile.id);
          AsyncStorage.setItem(
            EMAIL,
            currentUser.additionalUserInfo.profile.email,
          );
          AsyncStorage.setItem(PHOTO, currentUser.user.photoURL);

          this.props.navigation.navigate('Username');
        } else {
          console.log('returning user');
          this.props.navigation.navigate('Home');
        }
      })
      .catch(error => {
        console.log(`Facebook login fail with error: ${error.message}`);
      });
  };

  login() {
    Alert.alert(
      //title
      'Open "Facebook"?',
      //body
      'You will be directed to the Facebook app for account verification.',
      [
        {
          text: 'Open',
          onPress: () => this.handleClick(),
        },
        {
          text: 'Cancel',
          style: 'cancel',
        },
      ],
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
    alignSelf: 'center',
    marginTop: '10%',
  },
  yesPress: {
    alignSelf: 'center',
    color: '#fff',
    fontFamily: 'CircularStd-Medium',
    fontSize: 17,
    fontWeight: 'bold',
  },
  noPress: {
    alignSelf: 'center',
    color: '#3b5998',
    fontFamily: 'CircularStd-Medium',
    fontSize: 17,
    fontWeight: 'bold',
  },
});
