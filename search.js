import React, {Component} from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  Dimensions,
} from 'react-native';
import {SearchBar} from 'react-native-elements';
import Card from './searchCard.js';
import api from './api.js';

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

const hex = '#F25763';
const font = 'CircularStd-Medium';

export default class Search extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: [],
    };
    api.createFBUser("boo", 1, "booo", "boo@gmail.com", "pic")
  }

  renderSeparator = () => {
    return (
      <View
        style={{
          height: 1,
          width: '86%',
          backgroundColor: '#CED0CE',
          marginLeft: '14%',
        }}
      />
    );
  };

  searchFilterFunction = text => {
    this.setState({
      value: text,
    });

    clearTimeout(this.timeout); // clears the old timer
    this.timeout = setTimeout(
      () =>
        api.searchUsers(text)
        .then(res => {
          this.setState({data: res.userList});
        })
        .catch(error => {
        }),
      100,
    );
  };

  renderHeader = () => {
    return (
      <SearchBar
        containerStyle={styles.container}
        inputContainerStyle={styles.inputContainer}
        inputStyle={styles.input}
        placeholder="Seach by username"
        lightTheme={true}
        round={true}
        onChangeText={text => this.searchFilterFunction(text)}
        autoCorrect={false}
        value={this.state.value}
      />
    );
  };

  render() {
    return (
      <View style={{flex: 1, backgroundColor: 'white'}}>
        <Text style={styles.title}>Find New Friends!</Text>
        <FlatList
          data={this.state.data}
          renderItem={({item}) => (
            <Card
              name={item.name}
              username={'@' + item.username}
              image={item.photo}
              requested={true}
            />
          )}
          keyExtractor={item => item.username}
          ItemSeparatorComponent={this.renderSeparator}
          ListHeaderComponent={this.renderHeader}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  title: {
    fontFamily: font,
    fontSize: 40,
    color: hex,
    textAlign: 'center',
    margin: '4%',
  },
  container: {
    backgroundColor: 'white',
    borderBottomColor: 'transparent',
    borderTopColor: 'transparent',
    width: '100%',
    height: Dimensions.get('window').height * 0.08,
    alignSelf: 'center',
  },
  inputContainer: {
    height: Dimensions.get('window').height * 0.05,
    width: '90%',
    alignSelf: 'center',
    backgroundColor: '#ebecf0',
  },
  input: {
    textAlignVertical: 'center',
    fontFamily: font,
    fontSize: 18,
  },
});
