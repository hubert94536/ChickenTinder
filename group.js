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

const hex = '#F25763';

var participants = [
  {
    name: 'Hanna',
    username: '@hannaco',
    image:
      'https://d1kdq4z3qhht46.cloudfront.net/uploads/2019/08/Adventures_from_Moominvalley_1990_Moomintroll_TV.jpg',
  },
  {
    name: 'Isha',
    username: '@ishagonu',
    image:
      'https://www.abramsandchronicle.co.uk/wp-content/uploads/books/9781452182674.jpg',
  },
  {
    name: 'Hubert',
    username: '@hubesc',
    image: 'https://media0.giphy.com/media/ayMW3eqvuP00o/giphy_s.gif',
  },
  {
    name: 'Ruth',
    username: '@ruthlee',
    image:
      'https://wi-images.condecdn.net/image/baeWXm8eqMl/crop/405/f/ponyo.jpg',
  },
];

export default class Group extends React.Component {
  render() {
    var members = [];
    var i = 0;
    for (i = 0; i < participants.length; i++) {
      members.push(
        <Card
          name={participants[i].name}
          username={participants[i].username}
          image={participants[i].image}
        />,
      );
    }

    return (
      <View style={styles.main}>
        <View style={styles.top}>
          <Text style={styles.groupTitle}>Hubert's Group</Text>
          <View style={{flexDirection: 'row'}}>
            <Icon name="user" style={styles.icon} />
            <Text
              style={{
                color: '#fff',
                fontWeight: 'bold',
                fontFamily: 'CircularStd-Medium',
              }}>
              {members.length}
            </Text>
            <Text style={styles.divider}>|</Text>
            <Text style={styles.waiting}>waiting for 1 member's filters</Text>
          </View>
          <TouchableHighlight style={styles.button}>
            <Text style={styles.buttonText}>Set your filters</Text>
          </TouchableHighlight>
        </View>
        <ScrollView style={styles.center}>{members}</ScrollView>
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
        <View style={styles.card}>
          <Image source={{uri: this.props.image}} style={styles.image} />
          <Icon
            name="check-circle"
            style={{
              color: hex,
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
              flex: 1,
            }}>
            <Text
              style={{
                color: hex,
                fontWeight: 'bold',
                fontFamily: 'CircularStd-Medium',
              }}>
              {this.props.name}
            </Text>
            <Text
              style={{
                color: hex,
                fontFamily: 'CircularStd-Medium',
              }}>
              {this.props.username}
            </Text>
          </View>
          <View style={{flex: 1, flexDirection: 'row'}}>
            <Text
              style={{
                color: hex,
                alignSelf: 'center',
                fontFamily: 'CircularStd-Medium',
                marginLeft: '30%',
              }}>
              Remove
            </Text>
            <Icon
              name="times-circle"
              style={{
                color: hex,
                fontSize: 35,
                alignSelf: 'center',
                marginLeft: '5%',
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
    fontFamily: 'CircularStd-Medium',
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
    fontFamily: 'CircularStd-Medium',
  },
  waiting: {
    color: '#fff',
    marginLeft: '3%',
    alignSelf: 'center',
    fontFamily: 'CircularStd-Medium',
  },
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
    fontFamily: 'CircularStd-Medium',
  },
  bottomText: {
    color: '#fff',
    width: '50%',
    alignSelf: 'center',
    fontWeight: 'bold',
    marginTop: '3%',
    textAlign: 'center',
    fontFamily: 'CircularStd-Medium',
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
  join: {
    marginTop: 0,
    marginLeft: '3%',
    color: '#fff',
    fontFamily: 'CircularStd-Medium',
  },
});
