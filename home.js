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

class Home extends React.Component {
  componentDidMount() {
    facebookService.deleteUser();
  }
  render() {
    return (
      <View>
        <Text style={styles.welcome}>Welcome Back!</Text>
        <View style={{marginTop: '20%'}}>
          <TouchableHighlight style={styles.button}>
            <Text style={styles.buttonText}>Create Group</Text>
          </TouchableHighlight>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  welcome: {
    marginTop: '40%',
    fontSize: 40,
    color: '#DE4A4A',
    alignSelf: 'center',
  },
  button: {
    borderRadius: 20,
    width: '70%',
    height: 40,
    marginTop: '10%',
    backgroundColor: '#DE4A4A',
    alignSelf: 'center',
  },
  buttonText: {
    flexDirection: 'row',
    flex: 1,
    alignSelf: 'center',
    justifyContent: 'center',
    color: '#fff',
  },
});

export default Home;
