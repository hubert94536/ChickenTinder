import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  Button,
  Alert,
  TouchableHighlight,
} from 'react-native';
import UserProfileView from './profile.js';
import {facebookService} from './facebookService.js';

class Home extends React.Component {
  constructor() {
    super();
    this.state = {
      createPressed: false,
      profilePressed: false,
    };
  }

  underlayShowCreate() {
    this.setState({createPressed: true});
  }

  underlayHideCreate() {
    this.setState({createPressed: false});
  }

  underlayShowProfile() {
    this.setState({profilePressed: true});
  }

  underlayHideProfile() {
    this.setState({profilePressed: false});
  }

  render() {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: '#F25763',
          justifyContent: 'center',
        }}>
        <TouchableHighlight
          onShowUnderlay={this.underlayShowCreate.bind(this)}
          onHideUnderlay={this.underlayHideCreate.bind(this)}
          activeOpacity={1}
          underlayColor="#fff"
          style={styles.button}
          onPress={() => this.props.navigation.navigate('Group')}>
          <Text
            style={this.state.createPressed ? styles.yesPress : styles.noPress}>
            Create Group
          </Text>
        </TouchableHighlight>
        <TouchableHighlight
          onShowUnderlay={this.underlayShowProfile.bind(this)}
          onHideUnderlay={this.underlayHideProfile.bind(this)}
          activeOpacity={1}
          underlayColor="#fff"
          style={styles.button}
          onPress={() => this.props.navigation.navigate('Profile')}>
          <Text
            style={
              this.state.profilePressed ? styles.yesPress : styles.noPress
            }>
            My Profile
          </Text>
        </TouchableHighlight>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 40,
    borderColor: '#fff',
    borderWidth: 2,
    width: '65%',
    height: 65,
    alignSelf: 'center',
    margin: '3%',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  yesPress: {
    textAlign: 'center',
    color: '#F25763',
    fontFamily: 'CircularStd-Medium',
    fontSize: 27,
    fontWeight: 'bold',
  },
  noPress: {
    textAlign: 'center',
    color: '#fff',
    fontFamily: 'CircularStd-Medium',
    fontSize: 27,
    fontWeight: 'bold',
  },
});

export default Home;
