import React from 'react';
import {
  Button,
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableHighlight,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import UserProfileView from './profile.js';

export default class Group extends React.Component {
  render() {
    return (
      <View style={styles.main}>
        <View style={styles.top}>
          <Text style={styles.groupTitle}>Hubert's Group</Text>
          <View style={{flexDirection: 'row'}}>
            <Icon name="user" style={styles.icon} />
            <Text style={{color: '#fff', fontWeight: 'bold'}}>4</Text>
            <Text style={styles.divider}>|</Text>
            <Text style={styles.waiting}>waiting for 1 member's filters</Text>
          </View>
          <TouchableHighlight style={styles.button}>
            <Text style={styles.buttonText}>Set your filters</Text>
          </TouchableHighlight>
        </View>
        <ScrollView style={styles.center}>
          <Card />
          <Card />
          <Card />
          <Card />
          <Card />
          <Card />
          <Card />
        </ScrollView>
        <View style={styles.bottom}>
          <Text style={styles.bottomText}>
            When everyone has submitted filters, the round will begin!
          </Text>
          <TouchableHighlight style={styles.bottomButton}>
            <Text style={styles.buttonText}>Waiting...</Text>
          </TouchableHighlight>
        </View>
      </View>
    );
  }
}

class Card extends React.Component {
  render() {
    return (
      <View>
        {/* <Text style={styles.card}>this is the card</Text> */}
        <View style={styles.card}>
          <Image
            source={{uri: 'https://www.dintaifungusa.com/image/1509'}}
            style={styles.image}
          />
          <Icon
            name="check-circle"
            style={{
              color: '#FF465E',
              fontSize: 20,
              position: 'absolute',
              marginLeft: '14%',
              marginTop: '1%',
            }}
          />
          <View
            style={{
              alignSelf: 'center',
              marginLeft: '3%',
            }}>
            <Text
              style={{
                color: '#FF465E',
                fontWeight: 'bold',
              }}>
              Hubert Chen
            </Text>
            <Text
              style={{
                color: '#FF465E',
              }}>
              @hubesc
            </Text>
          </View>
          <View style={{flexDirection: 'row', marginLeft: '30%'}}>
            <Text
              style={{
                color: '#FF465E',
                alignSelf: 'center',
              }}>
              Remove
            </Text>
            <Icon
              name="times-circle"
              style={{
                color: '#FF465E',
                fontSize: 35,
                alignSelf: 'center',
                marginLeft: '10%',
              }}
            />
          </View>
        </View>
        <Text style={styles.join}>Joined 3 hours ago</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  main: {
    flexDirection: 'column',
    flex: 1,
    backgroundColor: '#FF465E',
    color: '#fff',
  },
  groupTitle: {
    color: '#fff',
    fontSize: 25,
    marginLeft: '5%',
    marginTop: '5%',
    fontWeight: 'bold',
  },
  icon: {
    color: '#fff',
    marginLeft: '5%',
    marginTop: '2%',
    fontSize: 30,
  },
  divider: {
    color: '#fff',
    alignSelf: 'center',
    marginLeft: '3%',
    fontSize: 25,
  },
  waiting: {color: '#fff', marginLeft: '3%', alignSelf: 'center'},
  button: {
    borderRadius: 25,
    borderWidth: 2.5,
    borderColor: '#fff',
    paddingVertical: 7,
    paddingHorizontal: 12,
    width: '50%',
    alignSelf: 'center',
    marginTop: '3%',
  },
  buttonText: {
    color: '#fff',
    alignSelf: 'center',
    fontSize: 20,
    fontWeight: 'bold',
  },
  bottomText: {
    color: '#fff',
    width: '50%',
    alignSelf: 'center',
    fontWeight: 'bold',
    marginTop: '3%',
    textAlign: 'center',
  },
  bottomButton: {
    borderRadius: 30,
    borderWidth: 2.5,
    borderColor: '#fff',
    paddingVertical: 13,
    paddingHorizontal: 12,
    width: '50%',
    alignSelf: 'center',
    marginTop: '3%',
  },
  image: {
    borderRadius: 63,
    height: 60,
    width: 60,
    borderWidth: 3,
    borderColor: '#FF465E',
    alignSelf: 'flex-start',
    marginTop: '2.5%',
    marginLeft: '2.5%',
  },
  top: {
    flex: 0.5,
  },
  center: {
    flex: 0.6,
    color: '#fff',
    // backgroundColor: '#add8e6',
  },
  bottom: {
    flex: 0.45,
    color: '#fff',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 20,
    borderWidth: 0,
    borderColor: '#000',
    alignSelf: 'center',
    width: '96%',
    height: 80,
    marginTop: '3%',
    flexDirection: 'row',
  },
  join: {marginTop: 0, marginLeft: '3%', color: '#fff'},
});
