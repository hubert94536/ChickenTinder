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
import api from './api.js';
import friendsapi from './friendsapi.js';

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

  componentDidMount() {
    api.createFBUser("isha", 0, "ishaaa", "ishag@gmail.com", "dffdsds"),
    api.createFBUser("hanna", 0, "hco", "hannc@gmail.com", "kfdkfjs"),
    api.createFBUser("hubert", 0, "hubes", "hubes@gmail.com", "jskfhskl"),
    friendsapi.createFriendship("hubes", "hco")
  }

  render () {
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
    Alert.alert(
      // title
      'Open "Facebook"?',
      // body
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
