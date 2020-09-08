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

class Username extends Component {
  state = {
    username: null,
    showButton: false,
  };

  underlayShow() {
    this.setState({pressed: true});
  }

  underlayHide() {
    this.setState({pressed: false});
  }

  handleClick = () => {
    api.checkUsername(this.state.username)
    .then(res => {
      if (res == 200) {
        this.setState({showButton: true});
        global.username = this.state.username;
        console.log(global.username);
      } else {
        Alert.alert('Username taken!');
      }
    })
    .catch(error => {
      console.log(error);
    })
    
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
        {this.state.showButton && (
          <TouchableHighlight
            onShowUnderlay={this.underlayShow.bind(this)}
            onHideUnderlay={this.underlayHide.bind(this)}
            activeOpacity={1}
            underlayColor="#3b5998"
            onPress={() => (
              api.createFBUser(
                global.name,
                global.id,
                global.username,
                global.email,
                global.photo,
              ),
              this.props.navigation.navigate('Home')
            )}
            style={styles.button}>
            <Text style={this.state.pressed ? styles.yesPress : styles.noPress}>
              Continue
            </Text>
          </TouchableHighlight>
        )}
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
