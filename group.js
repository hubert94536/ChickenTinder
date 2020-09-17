import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableHighlight,
  Alert,
} from 'react-native';
import Card from './groupCard.js';
import {USERNAME} from 'react-native-dotenv';
import Icon from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from '@react-native-community/async-storage';
import socket from './socket.js';

const hex = '#F25763';
const font = 'CircularStd-Medium';
var memberList = [];

export default class Group extends React.Component {
  constructor(props) {
    super(props);
    const members = this.props.navigation.state.params.members;
    this.state = {
      members: members,
      host: this.props.navigation.state.params.host,
      groupName: members[Object.keys(members)[0]].name.split(' ')[0],
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

  componentWillMount() {
    AsyncStorage.getItem(USERNAME).then(res => {
      if (res == this.state.host) {
        this.setState({isHost: true});
      }
    });

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

  render() {
    memberList = [];
    for (var user in this.state.members) {
      memberList.push(
        <Card
          name={this.state.members[user].name}
          username={'@' + user}
          image={this.state.members[user].pic}
          filters={this.state.members[user].filters}
          host={this.state.host}
        />,
      );
    }
  }

  leaveGroup() {
    socket.leaveRoom();
    this.props.navigation.navigate('Home');
    socket.getSocket().on('kick', res => {
      console.log(res);
      socket.leaveRoom(data.room);
      this.props.navigation.navigate('Home');
    });
  }

  endGroup() {
    socket.endSession();
    socket.getSocket().on('leave', res => {
      this.props.navigation.navigate('Home');
    });
  }

  leaveAlert() {
    Alert.alert(
      //title
      'Are you sure you want to leave?',
      //body
      'You will will not be able to return without invitation',
      [
        {
          text: 'Yes',
          onPress: () => this.leaveGroup(),
        },
        {
          text: 'Cancel',
          style: 'cancel',
        },
      ],
    );
  }

  endSession() {
    Alert.alert(
      //title
      'Are you sure you want to end the session?',
      //body
      'You will not be able to return',
      [
        {
          text: 'Yes',
          onPress: () => this.endGroup(),
        },
        {
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
              <Text style={styles.groupTitle}>
                {this.state.groupName}'s Group
              </Text>
            )}
            {!this.state.isHost && (
              <TouchableHighlight
                onShowUnderlay={() => this.setState({leaveGroup: true})}
                onHideUnderlay={() => this.setState({leaveGroup: false})}
                style={styles.leave}
                onPress={() => this.leaveAlert()}
                underlayColor="white">
                <Text
                  style={
                    this.state.leaveGroup
                      ? styles.leaveTextPressed
                      : styles.leaveText
                  }>
                  Leave
                </Text>
              </TouchableHighlight>
            )}
            {this.state.isHost && (
              <TouchableHighlight
                onShowUnderlay={() => this.setState({leaveGroup: true})}
                onHideUnderlay={() => this.setState({leaveGroup: false})}
                style={styles.end}
                onPress={() => this.endSession()}
                underlayColor="white">
                <Text
                  style={
                    this.state.leaveGroup
                      ? styles.leaveTextPressed
                      : styles.leaveText
                  }>
                  End
                </Text>
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
    marginTop: '6%',
    borderRadius: 25,
    borderWidth: 2.5,
    borderColor: '#fff',
    width: '25%',
  },
  end: {
    marginLeft: '30%',
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
