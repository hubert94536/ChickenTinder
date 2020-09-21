import React from 'react';
import {View, ScrollView, Text, Dimensions} from 'react-native';
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
    super(props);
    this.state = {
      search: '',
    };
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
          requested={people[i].friends}
        />,
      );
    }
    return (
      <View style={{flex: 1, backgroundColor: 'white'}}>
        <Text
          style={{
            fontFamily: font,
            fontSize: 40,
            color: hex,
            textAlign: 'center',
            margin: '4%',
          }}>
          Find New Friends!
        </Text>
        <View>
          <SearchBar
            containerStyle={{
              backgroundColor: 'white',
              borderBottomColor: 'transparent',
              borderTopColor: 'transparent',
              width: '100%',
              height: Dimensions.get('window').height * 0.08,
              alignSelf: 'center',
            }}
            inputContainerStyle={{
              height: Dimensions.get('window').height * 0.05,
              width: '90%',
              alignSelf: 'center',
              backgroundColor: '#ebecf0',
            }}
            inputStyle={{
              textAlignVertical: 'center',
              fontFamily: font,
              fontSize: 18,
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
