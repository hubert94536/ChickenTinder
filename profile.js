import React, {Component} from 'react';
import {StyleSheet, Text, View, Image, ScrollView} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import {NAME, USERNAME, PHOTO} from 'react-native-dotenv';

const hex = '#F25763';

export default class UserProfileView extends Component {
  state = {
    name: '',
    username: '',
    photo: '',
  };

  componentDidMount() {
    AsyncStorage.getItem(NAME).then(res => this.setState({name: res}));
    AsyncStorage.getItem(USERNAME).then(res => this.setState({username: res}));
    AsyncStorage.getItem(PHOTO).then(res => this.setState({photo: res}));
  }

  render() {
    return (
      <ScrollView>
        <View>
          <Text style={styles.topBar}>My Profile</Text>
        </View>
        <View style={styles.headerContent}>
          <Image
            style={styles.avatar}
            source={{
              uri: this.state.photo,
            }}
          />
          <View style={{flexDirection: 'column', alignItems: 'flex-start'}}>
            <Text style={styles.name}>{this.state.name}</Text>
            <Text style={styles.info}>@{this.state.username}</Text>
          </View>
        </View>
        <View style={styles.toggle}>
          <Text style={styles.togglecontent}>Saved Spots</Text>
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  topBar: {
    color: hex,
    fontWeight: 'bold',
    fontSize: 20,
    paddingTop: '5%',
    paddingLeft: '3%',
  },
  headerContent: {
    padding: 30,
    alignItems: 'flex-start',
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  avatar: {
    width: 130,
    height: 130,
    borderRadius: 63,
    borderWidth: 4,
    borderColor: 'white',
    marginBottom: 10,
  },
  name: {
    fontSize: 25,
    fontWeight: 'bold',
    alignSelf: 'center',
  },
  info: {
    fontSize: 18,
    marginTop: 20,
  },
  toggle: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  togglecontent: {
    color: hex,
    fontWeight: 'bold',
    fontSize: 16,
  },
  image: {
    width: 140,
    height: 140,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'white',
    margin: '3%',
  },
  gallery: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  col: {
    flexDirection: 'column',
    flex: 2,
    alignItems: 'center',
  },
});
