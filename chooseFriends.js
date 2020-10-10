import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
  Modal,
  FlatList,
  Dimensions,
} from 'react-native';
import friendsApi from './friendsApi.js';
import {BlurView} from '@react-native-community/blur';
import Icon from 'react-native-vector-icons/FontAwesome';
import Card from './chooseCard.js';
import {SearchBar} from 'react-native-elements';

const hex = '#F25763';
const font = 'CircularStd-Bold';
const height = Dimensions.get('window').height;
const people = [
  {
    name: 'Hanna Co',
    username: '@hannaco',
    image:
      'https://i.pinimg.com/236x/ec/d3/8c/ecd38c516c19d5cf6624ce3eeae1c4b2.jpg',
  },
  {
    name: 'Hubert Chen',
    username: '@hubesc',
    image:
      'https://i.pinimg.com/236x/ec/d3/8c/ecd38c516c19d5cf6624ce3eeae1c4b2.jpg',
  },
  {
    name: 'Isha Gonu',
    username: '@ishagonu',
    image:
      'https://i.pinimg.com/236x/ec/d3/8c/ecd38c516c19d5cf6624ce3eeae1c4b2.jpg',
  },
  {
    name: 'Ruth Lee',
    username: '@ruthlee',
    image:
      'https://i.pinimg.com/236x/ec/d3/8c/ecd38c516c19d5cf6624ce3eeae1c4b2.jpg',
  },
  {
    name: 'Michelle Chan',
    username: '@mishigan',
    image:
      'https://i.pinimg.com/236x/ec/d3/8c/ecd38c516c19d5cf6624ce3eeae1c4b2.jpg',
  },
  {
    name: 'Janice Tsai',
    username: '@jopanice',
    image:
      'https://i.pinimg.com/236x/ec/d3/8c/ecd38c516c19d5cf6624ce3eeae1c4b2.jpg',
  },
  {
    name: 'Tiffany Chao',
    username: '@tiffanychao',
    image:
      'https://i.pinimg.com/236x/ec/d3/8c/ecd38c516c19d5cf6624ce3eeae1c4b2.jpg',
  },
  {
    name: 'Kyle Blake',
    username: '@theekyleblake',
    image:
      'https://i.pinimg.com/236x/ec/d3/8c/ecd38c516c19d5cf6624ce3eeae1c4b2.jpg',
  },
];
export default class ChooseFriends extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: people,
      friends: people,
      search: '',
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
          if (res.friendList[friend].status === 'Accepted') {
            pushFriends.push(res.friendList[friend]);
          }
        }
        this.setState({friends: pushFriends, data: pushFriends});
      })
      .catch(err => console.log(err));
  }

  handlePress() {
    this.props.press();
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

  render() {
    return (
      <Modal animationType="none" transparent={true}>
        <View style={styles.container}>
          <View style={styles.main}>
            <View style={styles.header}>
              <Text style={styles.headertext}>Friends</Text>
              <Icon
                name="times-circle"
                style={styles.icon}
                onPress={() => this.handlePress()}
              />
            </View>
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
              onChangeText={text => this.searchFilterFunction(text)}
              value={this.state.search}
              lightTheme={true}
              round={true}
            />
            <FlatList
              style={{marginLeft: '5%', marginRight: '5%', marginBottom: '10%'}}
              data={this.state.friends}
              renderItem={({item}) => (
                <Card
                  name={item.name}
                  username={item.username}
                  image={item.image}
                  added={true}
                />
              )}
              keyExtractor={item => item.username}
            />
          </View>
        </View>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: height,
    alignSelf: 'center',
    width: '90%',
  },
  main: {
    flex: 1,
    height: height * 0.9,
    backgroundColor: 'white',
    alignSelf: 'center',
    borderRadius: 30,
    elevation: 20,
  },
  header: {
    height: '10%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  icon: {
    color: hex,
    fontSize: 25,
    alignSelf: 'center',
    margin: '4%',
  },
  headertext: {
    fontFamily: font,
    color: hex,
    margin: '4%',
    fontSize: 20,
  },
});
