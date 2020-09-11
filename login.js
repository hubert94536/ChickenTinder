import React from 'react'
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

  underlayHide () {
    this.setState({ pressed: false })
  }

  render () {
    return (
<<<<<<< HEAD
      <View style={{ marginTop: '50%' }}>
        <Text
          style={{
            fontSize: 50,
            color: '#DE4A4A',
            alignSelf: 'center'
          }}
        >
          Log in
=======
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
>>>>>>> d683c0d0e5e358ce448a34862fbb554019c201c4
        </Text>
        <TouchableHighlight
          onShowUnderlay={this.underlayShow.bind(this)}
          onHideUnderlay={this.underlayHide.bind(this)}
          activeOpacity={1}
          underlayColor='#3b5998'
          onPress={() => this.login()}
          style={styles.button}
        >
          <Text style={this.state.pressed ? styles.yesPress : styles.noPress}>
            {/* <Icon name="facebook" style={{fontSize: 20}} /> */}
            Log in with Facebook
          </Text>
        </TouchableHighlight>
      </View>
    )
  }

<<<<<<< HEAD
  login () {
=======
  handleClick = () => {
    facebookService.loginWithFacebook()
    .then(result => {
      this.props.navigation.navigate(result)
    })
    .catch(error => {
      console.log(error)
    })
  };

  login() {
>>>>>>> d683c0d0e5e358ce448a34862fbb554019c201c4
    Alert.alert(
      // title
      'Open "Facebook"?',
      // body
      'You will be directed to the Facebook app for account verification.',
      [
        {
          text: 'Open',
<<<<<<< HEAD
          onPress: () => (
            facebookService.loginWithFacebook(),
            console.log('open'),
            this.setState({ showButton: true })
          )
        },
        {
          text: 'Cancel',
          onPress: () => console.log('cancel'),
          style: 'cancel'
        }
      ]
    )
=======
          onPress: () => this.handleClick(),
        },
        {
          text: 'Cancel',
          style: 'cancel',
        },
      ],
    );
>>>>>>> d683c0d0e5e358ce448a34862fbb554019c201c4
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
<<<<<<< HEAD
    // marginTop: '50%',
    alignSelf: 'center'
  },
  yesPress: {
    alignSelf: 'center',
    color: '#fff'
  },
  noPress: {
    alignSelf: 'center',
    color: '#3b5998'
  }
})

export default Login
=======
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
>>>>>>> d683c0d0e5e358ce448a34862fbb554019c201c4
