import React from 'react';
import {
  Button,
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableHighlight,
  Image,
  Alert,
} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {USERNAME} from 'react-native-dotenv';
import Icon from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from '@react-native-community/async-storage';
import socket from './socket.js'

const hex = '#F25763';
const font = 'CircularStd-Medium';
var memberList = [];
export default class Group extends React.Component {
  constructor(props) {
    super(props);
    const members = this.props.navigation.state.params.members;
    console.log(this.props.navigation.state.params)
    this.state = {
      members: members,
      host:  members[Object.keys(members)[0]].name.split(' ')[0],
      needFilters: Object.keys(members).filter(user => !user.filters).length,
      isHost: false,
      start: false,
    };
  }

  underlayShow() {
    this.setState({start: true});
  }

  underlayHide() {
    this.setState({start: false});
  }

  componentDidMount() {
    AsyncStorage.getItem(USERNAME).then(res => {
      if (res == Object.keys(this.state.members)) {
        this.setState({isHost: true});
      }
    });
    console.log(this.state.members)
    memberList = [];
    for (var user in this.state.members) {
      memberList.push(
        <Card
          name={this.state.members[user].name}
          username={'@' + user}
          image={this.state.members[user].pic}
          filters={this.state.members[user].filters}
        />,
      );
    }
  }

  render() {
    memberList = [];
    for (var user in this.state.members) {
      memberList.push(
        <Card
          name={this.state.members[user].name}
          username={'@' + user}
          image={this.state.members[user].pic}
          filters={this.state.members[user].filters}
        />,
      );
    }
  }

  removeItem = username => {
    console.log('remove ' + username);
  };

  leaveGroup() {
    socket.leaveRoom()
    this.props.navigation.navigate('Home')
  }

  leaveAlert() {
    Alert.alert(
      //title
      'Are you sure you want to leave?',
      //body
      'You will will not be able to return without invitation', [
        {
          text: 'Yes',
          onPress: () => this.leaveGroup(),
        }, {
          text: 'Cancel',
          style: 'cancel',
        },
      ],
    );
  }

  render() {
    return (
      <View style={styles.main}>
        <View style={styles.top}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            {this.state.isHost && (
              <Text style={styles.groupTitle}>Your Group</Text>
            )}
            {!this.state.isHost && (
              <Text style={styles.groupTitle}>{this.state.host}'s Group</Text>
            )}
            {!this.state.isHost && (
              <TouchableHighlight
                onShowUnderlay={() => this.setState({leaveGroup: true})}
                onHideUnderlay={() => this.setState({leaveGroup: false})}
                style={styles.leave}
                onPress={() => this.leaveAlert()}
                underlayColor="white">
                <Text style={styles.leaveText}>Leave</Text>
              </TouchableHighlight>
            )}
          </View>
          <View style={{flexDirection: 'row'}}>
            <Icon name="user" style={styles.icon} />
            <Text
              style={{
                color: '#fff',
                fontWeight: 'bold',
                fontFamily: font,
              }}>
              {memberList.length}
            </Text>
            <Text style={styles.divider}>|</Text>
            <Text style={styles.waiting}>
              waiting for {this.state.needFilters} member filters
            </Text>
          </View>
          <View style={{flexDirection: 'row', margin: '4%'}}>
            <Icon
              name="chevron-left"
              style={{color: 'white', fontFamily: font, fontSize: 16}}
            />
            {!this.state.isHost && (
              <Text
                style={{color: 'white', fontFamily: font, marginLeft: '3%'}}>
                Swipe for filters
              </Text>
            )}
            {this.state.isHost && (
              <Text
                style={{color: 'white', fontFamily: font, marginLeft: '3%'}}>
                Swipe for host menu
              </Text>
            )}
          </View>
        </View>
        <ScrollView style={styles.center}>{memberList}</ScrollView>
        <View style={styles.bottom}>
          <Text style={styles.bottomText}>
            When everyone has submitted filters, the round will begin!
          </Text>
          {this.state.needFilters === 0 && this.state.isHost && (
            <TouchableHighlight
              underlayColor="#fff"
              activeOpacity={1}
              onHideUnderlay={this.underlayHide.bind(this)}
              onShowUnderlay={this.underlayShow.bind(this)}
              onPress={() => console.log('start round')}
              style={styles.bottomButton}>
              <Text
                style={
                  this.state.start ? styles.pressedText : styles.buttonText
                }>
                Start Round
              </Text>
            </TouchableHighlight>
          )}
          {this.state.needFilters !== 0 && this.state.isHost && (
            <TouchableHighlight style={styles.bottomButtonClear}>
              <Text style={styles.buttonText}>Start Round</Text>
            </TouchableHighlight>
          )}
          {this.state.needFilters === 0 && !this.state.isHost && (
            <TouchableHighlight style={styles.pressed}>
              <Text style={styles.pressedText}>Ready!</Text>
            </TouchableHighlight>
          )}
          {this.state.needFilters !== 0 && !this.state.isHost && (
            <TouchableHighlight style={styles.bottomButtonClear}>
              <Text style={styles.buttonText}>Waiting...</Text>
            </TouchableHighlight>
          )}
        </View>
      </View>
    );
  }
}

class Card extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View>
        <View style={styles.card}>
          <Image
            source={{uri: this.props.image}}
            style={this.props.filters ? styles.image : styles.imageFalse}
          />
          {this.props.filters ? (
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
          ) : null}
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
                fontFamily: font,
              }}>
              {this.props.name}
            </Text>
            <Text
              style={{
                color: hex,
                fontFamily: font,
              }}>
              {this.props.username}
            </Text>
          </View>
          <View style={{flex: 1, flexDirection: 'row'}}>
            <Text
              style={{
                color: hex,
                alignSelf: 'center',
                fontFamily: font,
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
              onPress={() => Group.removeItem(this.props.username)}
            />
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  main: {
    flexDirection: 'column',
    flex: 1,
    backgroundColor: hex,
    color: '#fff',
  },
  groupTitle: {
    color: '#fff',
    fontSize: 25,
    marginLeft: '5%',
    marginTop: '5%',
    fontWeight: 'bold',
    fontFamily: font,
  },
  leave: {
    marginLeft: '18%',
    marginTop: '7%',
    borderRadius: 25,
    borderWidth: 2.5,
    borderColor: '#fff',
    width: '25%',
  },
  leaveText: {
    fontFamily: font,
    color: 'white',
    textAlign: 'center',
    fontSize: 20,
    paddingTop: '2%',
    paddingBottom: '2%',
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
    fontFamily: font,
  },
  waiting: {
    color: '#fff',
    marginLeft: '3%',
    alignSelf: 'center',
    fontFamily: font,
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
    fontSize: 30,
    fontWeight: 'bold',
    fontFamily: font,
  },
  bottomText: {
    color: '#fff',
    width: '50%',
    alignSelf: 'center',
    fontWeight: 'bold',
    marginTop: '3%',
    textAlign: 'center',
    fontFamily: font,
  },
  bottomButton: {
    borderRadius: 40,
    borderWidth: 2.5,
    opacity: 0.5,
    borderColor: '#fff',
    paddingVertical: 13,
    paddingHorizontal: 12,
    width: '60%',
    alignSelf: 'center',
    marginTop: '3%',
  },
  bottomButtonClear: {
    borderRadius: 40,
    borderWidth: 2.5,
    opacity: 0.5,
    borderColor: '#fff',
    paddingVertical: 13,
    paddingHorizontal: 12,
    width: '60%',
    alignSelf: 'center',
    marginTop: '3%',
  },
  pressed: {
    borderRadius: 40,
    borderWidth: 2.5,
    opacity: 1,
    borderColor: '#fff',
    paddingVertical: 13,
    paddingHorizontal: 12,
    width: '60%',
    alignSelf: 'center',
    marginTop: '3%',
    backgroundColor: 'white',
  },
  pressedText: {
    color: hex,
    alignSelf: 'center',
    fontSize: 30,
    fontWeight: 'bold',
    fontFamily: font,
  },
  image: {
    borderRadius: 63,
    height: 60,
    width: 60,
    borderWidth: 3,
    borderColor: hex,
    alignSelf: 'flex-start',
    marginTop: '2.5%',
    marginLeft: '2.5%',
  },
  imageFalse: {
    borderRadius: 63,
    height: 60,
    width: 60,
    borderWidth: 3,
    alignSelf: 'flex-start',
    marginTop: '2.5%',
    marginLeft: '2.5%',
  },
  top: {
    flex: 0.38,
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
    fontFamily: font,
  },
});