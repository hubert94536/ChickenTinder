import React from 'react';

import {View, ScrollView, StyleSheet} from 'react-native';
import {SearchBar} from 'react-native-elements';

import friendsApi from './friendsApi.js';
import Card from './profileCard.js';
import Alert from './alert.js';

const font = 'CircularStd-Medium';

const people = [
  {
    name: 'Hanna',
    username: 'hannaco',
  },
  {
    name: 'Isha',
    username: 'ishagonu',
  },
  {
    name: 'Hubert',
    username: 'hubesc',
  },
  {
    name: 'Janice',
    username: 'janicetsai',
  },
  {
    name: 'Ruth',
    username: 'ruthlee',
  },
];

export default class Friends extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      search: '',
      errorAlert: false,
      data: [],
      friends: [], // array of Profile components
      isFriends: this.props.isFriends, // For rendering friends (true) or requests (false)
    };
    this.getFriends();
  }

  getFriends() {
    // Pushing accepted friends or pending requests into this.state.friends
    friendsApi
      .getFriends()
      .then(res => {
        var pushFriends = [];
        var friendOrRequest = this.state.isFriends
          ? 'Accepted'
          : 'Pending Request';
        for (var friend in res.friendList) {
          if (res.friendList[friend].status === friendOrRequest) {
            pushFriends.push(res.friendList[friend]);
          }
        }
        this.setState({friends: pushFriends, data: pushFriends});
      })
      .catch(err => console.log(err));
  }

  searchFilterFunction = text => {
    this.setState({
      search: text,
    });

    const newData = this.state.data.filter(item => {
      const itemData = `${item.name.toUpperCase()} ${item.username.toUpperCase()}`;

      const textData = text.toUpperCase();

      return itemData.indexOf(textData) > -1;
    });

    this.setState({friends: newData});
  };

  removeRequest(id, newArr, status) {
    if (!status) {
      friendsApi
        .removeFriendship(id)
        .then(res => {
          this.setState({friends: newArr});
        })
        .catch(err => {
          console.log(err);
          this.setState({errorAlert: true});
        });
    } else if (status) {
      this.setState({friends: newArr});
    }
  }

  render() {
    var friends = [];
    var friendList = this.state.friends;
    // Create all friend/request cards
    if (Array.isArray(friendList) && friendList.length) {
      for (var i = 0; i < friendList.length; i++) {
        friends.push(
          <Card
            total={this.state.friends}
            name={friendList[i].name}
            username={friendList[i].username}
            image={friendList[i].image}
            friends={this.state.isFriends}
            id={friendList[i].id}
            key={i}
            index={i}
            press={(id, newArr, status) =>
              this.removeRequest(id, newArr, status)
            }
          />,
        );
      }
    }
    return (
      <View>
        <View>
          <SearchBar
            containerStyle={styles.container}
            inputContainerStyle={styles.inputContainer}
            inputStyle={styles.input}
            placeholder="Search by username"
            onChangeText={text => this.searchFilterFunction(text)}
            value={this.state.search}
            lightTheme={true}
            round={true}
          />
        </View>
        <ScrollView style={{flexDirection: 'column'}}>{friends}</ScrollView>
        {this.state.errorAlert && (
          <Alert
            title="Error!"
            body="Please try again"
            button
            buttonText="Close"
            press={() => this.setState({errorAlert: false})}
            cancel={() => this.setState({errorAlert: false})}
          />
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderBottomColor: 'transparent',
    borderTopColor: 'transparent',
    width: '100%',
    height: 45,
    alignSelf: 'center',
  },
  inputContainer: {
    height: 7,
    width: '90%',
    alignSelf: 'center',
    backgroundColor: '#ebecf0',
  },
  input: {
    fontFamily: font,
    fontSize: 15,
  },
});
