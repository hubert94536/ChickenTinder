import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  Button,
  Alert,
  TouchableHighlight,
} from 'react-native';

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
      <View style={{marginTop: '50%'}}>
        <Text
          style={{
            fontSize: 50,
            color: '#DE4A4A',
            alignSelf: 'center',
          }}>
          Log in
        </Text>
        <TouchableHighlight
          onShowUnderlay={this.underlayShow.bind(this)}
          onHideUnderlay={this.underlayHide.bind(this)}
          activeOpacity={1}
          underlayColor="#3b5998"
          onPress={this.login}
          style={styles.button}>
          <Text style={this.state.pressed ? styles.yesPress : styles.noPress}>
            Log in with Facebook
          </Text>
        </TouchableHighlight>
      </View>
    );
  }

  login() {
    Alert.alert(
      //title
      'Open "Facebook""',
      //body
      'You will be directed to the Facebook app for account verification.',
      [
        {text: 'Open', onPress: () => console.log('Yes Pressed')},
        {
          text: 'Cancel',
          onPress: () => console.log('No Pressed'),
          style: 'cancel',
        },
      ],
    );
  }
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 20,
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
