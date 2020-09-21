import React from 'react';
import {View, ScrollView} from 'react-native';
import {SearchBar} from 'react-native-elements';
import Card from './searchCard.js';

const hex = '#F25763';
const font = 'CircularStd-Medium';

const people = [
  {
    name: 'Hanna Co',
    username: '@hannaco',
    image:
      'https://i.pinimg.com/236x/ec/d3/8c/ecd38c516c19d5cf6624ce3eeae1c4b2.jpg',
    friends: true,
  },
  {
    name: 'Hubert Chen',
    username: '@hubesc',
    image:
      'https://i.pinimg.com/236x/ec/d3/8c/ecd38c516c19d5cf6624ce3eeae1c4b2.jpg',
    friends: false,
  },
  {
    name: 'Isha Gonu',
    username: '@ishagonu',
    image:
      'https://i.pinimg.com/236x/ec/d3/8c/ecd38c516c19d5cf6624ce3eeae1c4b2.jpg',
    friends: true,
  },
  {
    name: 'Ruth Lee',
    username: '@ruthlee',
    image:
      'https://i.pinimg.com/236x/ec/d3/8c/ecd38c516c19d5cf6624ce3eeae1c4b2.jpg',
    friends: false,
  },
  {
    name: 'Michelle Chan',
    username: '@mishigan',
    image:
      'https://i.pinimg.com/236x/ec/d3/8c/ecd38c516c19d5cf6624ce3eeae1c4b2.jpg',
    friends: true,
  },
  {
    name: 'Janice Tsai',
    username: '@jopanice',
    image:
      'https://i.pinimg.com/236x/ec/d3/8c/ecd38c516c19d5cf6624ce3eeae1c4b2.jpg',
    friends: false,
  },
  {
    name: 'Kyle Blake',
    username: '@theekyleblake',
    image:
      'https://i.pinimg.com/236x/ec/d3/8c/ecd38c516c19d5cf6624ce3eeae1c4b2.jpg',
    friends: true,
  },
  {
    name: 'Brenna Waterman',
    username: '@brennajune',
    image:
      'https://i.pinimg.com/236x/ec/d3/8c/ecd38c516c19d5cf6624ce3eeae1c4b2.jpg',
    friends: false,
  },
];

export default class Search extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      search: '',
    }
  }

  updateSearch = search => {
    this.setState({search});
  };

  render() {
    const search = this.state.search;
    const results = [];
    for (var i = 0; i < people.length; i++) {
      results.push(
        <Card
          key={i}
          name={people[i].name}
          username={people[i].username}
          image={people[i].image}
          friends={people[i].friends}
        />,
      );
    }
    return (
      <View style={{flex: 1}}>
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
        <ScrollView>{results}</ScrollView>
      </View>
    );
  }
}
