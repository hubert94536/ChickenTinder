import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableHighlight,
} from 'react-native';
import Card from './groupCard.js';
import { USERNAME } from 'react-native-dotenv';
import Icon from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from '@react-native-community/async-storage';
import socket from './socket.js';
import Alert from './alert.js';
import FilterSelector from './filter.js';
import Swiper from 'react-native-swiper';

const hex = '#F25763';
const font = 'CircularStd-Medium';
var memberList = [];
var myUsername = '';
AsyncStorage.getItem(USERNAME).then(res => {
  myUsername = res;
});

export default class Group extends React.Component {
  constructor(props) {
    super(props);
    const members = this.props.navigation.state.params.members;
    this.state = {
      members: members,
      host: this.props.navigation.state.params.host,
      groupName: members[Object.keys(members)[0]].name.split(' ')[0],
      needFilters: Object.keys(members).filter(user => !user.filters).length,
      start: false,
      username: myUsername,
      // show/hide the alerts
      leaveAlert: false,
      endAlert: false,
      swipe: true,
    };
    this.updateMemberList()
    socket.getSocket().on('kick', res => {
      if (res.username === this.state.username) {
        socket.leaveRoom(res.room);
        this.props.navigation.navigate('Home');
      }
    });
    socket.getSocket().on('update', res => {
      this.setState({ members: res })
    })
  }
  updateMemberList() {
    memberList = [];
    for (var user in this.state.members) {
      memberList.push(
        <Card
          name={this.state.members[user].name}
          username={user}
          image={this.state.members[user].pic}
          filters={this.state.members[user].filters}
          host={this.state.host}
        />,
      );
    }
  }
  underlayShow() {
    this.setState({ start: true });
  }

  underlayHide() {
    this.setState({ start: false });
  }

  leaveGroup() {
    socket.leaveRoom();
    this.props.navigation.navigate('Home');
  }

  endGroup() {
    socket.endSession();
    socket.getSocket().on('leave', res => {
      this.props.navigation.navigate('Home');
    });
  }

  cancelAlert() {
    this.state.host === this.state.username
      ? this.setState({ endAlert: false })
      : this.setState({ leaveAlert: false });
  }

  submitFilters() {
    this.refs.swiper.scrollBy(-1);
    this.setState({ swipe: false });
  }

  render() {
    this.updateMemberList()
    return (
      <Swiper
        ref="swiper"
        loop={false}
        showsPagination={false}
        scrollEnabled={this.state.swipe}>
        <View style={styles.main}>
          <View style={styles.top}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
              <Text style={styles.groupTitle}>
                {this.state.host === this.state.username
                  ? 'Your Group'
                  : `${this.state.groupName}'s Group`}
              </Text>
              <TouchableHighlight
                onShowUnderlay={() => this.setState({ leaveGroup: true })}
                onHideUnderlay={() => this.setState({ leaveGroup: false })}
                style={
                  this.state.host === this.state.username
                    ? styles.end
                    : styles.leave
                }
                onPress={() =>
                  this.state.host === this.state.username
                    ? this.setState({ endAlert: true })
                    : this.setState({ leaveAlert: true })
                }
                underlayColor="white">
                <Text
                  style={
                    this.state.leaveGroup
                      ? styles.leaveTextPressed
                      : styles.leaveText
                  }>
                  {this.state.host === this.state.username ? 'End' : 'Leave'}
                </Text>
              </TouchableHighlight>
            </View>
            <View style={{ flexDirection: 'row' }}>
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
            <View
              style={{
                flexDirection: 'row',
                margin: '4%',
                justifyContent: 'flex-end',
              }}>
              <Text
                style={{
                  color: 'white',
                  fontFamily: font,
                  marginRight: '3%',
                }}>
                {this.state.username === this.state.host
                  ? 'Swipe for host menu'
                  : 'Swipe for filters'}
              </Text>
              <Icon
                name="chevron-right"
                style={{
                  color: 'white',
                  fontFamily: font,
                  fontSize: 16,
                  marginTop: '0.75%',
                }}
                onPress={() => this.refs.swiper.scrollBy(1)}
              />
            </View>
          </View>
          <ScrollView style={styles.center}>{memberList}</ScrollView>
          <View style={styles.bottom}>
            <Text style={styles.bottomText}>
              When everyone has submitted filters, the round will begin!
            </Text>
            {this.state.host === this.state.username && (
              <TouchableHighlight
                underlayColor="#fff"
                activeOpacity={1}
                onHideUnderlay={this.underlayHide.bind(this)}
                onShowUnderlay={this.underlayShow.bind(this)}
                onPress={() => console.log('start round')}
                style={
                  this.state.start
                    ? styles.bottomButton
                    : styles.bottomButtonClear
                }>
                <Text style={styles.buttonText}>Start Round</Text>
              </TouchableHighlight>
            )}
            {this.state.host !== this.state.username && (
              <TouchableHighlight
                style={
                  this.state.start ? styles.pressed : styles.bottomButtonClear
                }>
                <Text
                  style={
                    this.state.start ? styles.pressedText : styles.buttonText
                  }>
                  {this.state.start ? 'Ready!' : 'Waiting...'}
                </Text>
              </TouchableHighlight>
            )}
          </View>
          {this.state.leaveAlert && (
            <Alert
              title="Leave?"
              body="You will will not be able to return without invite"
              button
              buttonText="Yes"
              press={() => this.leaveGroup()}
              cancel={() => this.cancelAlert()}
            />
          )}
          {this.state.endAlert && (
            <Alert
              title="End the session?"
              body="You will not be able to return"
              button
              buttonText="Yes"
              press={() => this.endGroup()}
              cancel={() => this.cancelAlert()}
            />
          )}
        </View>
        <FilterSelector
          host={this.state.host}
          username={this.state.username}
          isHost={this.state.host === this.state.username}
          press={() => this.submitFilters()}
        />
      </Swiper>
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
    marginRight: '2%',
    marginTop: '6%',
    borderRadius: 25,
    borderWidth: 2.5,
    borderColor: '#fff',
    width: '25%',
  },
  end: {
    marginRight: '2%',
    marginTop: '6%',
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
  leaveTextPressed: {
    fontFamily: font,
    color: hex,
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
    opacity: 1,
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
});
