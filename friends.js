import React from 'react';

import { View, ScrollView } from 'react-native';
import { SearchBar } from 'react-native-elements';

import friendsApi from './friendsApi.js';
import Card from './profileCard.js';

const font = 'CircularStd-Medium';

export default class Friends extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      search: '',
      friends: [], // array of Profile components
      isFriends: this.props.isFriends // For rendering friends (true) or requests (false)
    }
    // Pushing accepted friends or pending requests into this.state.friends
    friendsApi.getFriends()
      .then(res => {
        var pushFriends = [];
        var friendOrRequest = this.state.isFriends ? "Accepted" : "Pending Request"
        for (var friend in res.friendList) {
          if (res.friendList[friend].status === friendOrRequest) {
            pushFriends.push(res.friendList[friend])
          }
        }
        this.setState({ friends: pushFriends })
      })
      .catch(err => console.log(err))
  }

  updateSearch = search => {
    this.setState({ search });
  };

  render() {
    const search = this.state.search
    var friends = []
    var friendList = this.state.friends

    // Create all friend/request cards
    if (Array.isArray(friendList) && friendList.length) {
      for (var friend in friendList) {
        friends.push(
          <Card
            name={friendList[friend].name}
            username={friendList[friend].username}
            image={friendList[friend].image}
            friends={this.state.isFriends}
            id = {friendList[friend].id}
          />,
        );
      }
    }
    return (
      <View>
        <View>
          <SearchBar
            containerStyle={{
              backgroundColor: 'white',
              borderBottomColor: 'transparent',
              borderTopColor: 'transparent',
              width: '100%',
              height: 45,
              alignSelf: 'center',
            }}
            inputContainerStyle={{
              height: 7,
              width: '90%',
              alignSelf: 'center',
              backgroundColor: '#ebecf0',
            }}
            inputStyle={{
              fontFamily: font,
              fontSize: 15,
            }}
            placeholder="Search by username"
            onChangeText={this.updateSearch}
            value={search}
            lightTheme={true}
            round={true}
          />
        </View>
        <ScrollView style={{ flexDirection: 'column' }}>{friends}</ScrollView>
      </View>
    );
  }
}
