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
import api from './accountsApi.js';
import friendsApi from './friendsApi.js';


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
      friends: this.props.navigation.getParam('allFriends', null),
    };
    api.createFBUser('boo', 1, 'booo', 'boo@gmail.com', 'pic');
    
    // this.getFriends()
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
        api
          .searchUsers(text)
          .then(res => {
            this.setState({data: res.userList});

            var resultUsers = []
            for (var user in res.userList) {

              var status = 'Add'

              if (res.userList[user].id in friends) {
                status = friends[user]
              }

              var person = {
                name: res.userList[user].name ,
                username: res.userList[user].username ,
                image: res.userList[user].photo,
                status: status
              }

              resultUsers.push(person);
            }


          })
          .catch(err => console.log(err)),
      100,
    );
  };



  // getFriends() {
  //   // Pushing accepted friends or pending requests into this.state.friends
  //   friendsApi
  //     .getFriends()
  //     .then(res => {
  //       var pushFriends = [];
  //       for (var friend in res.friendList) {
  //         pushFriends.push(res.friendList[friend]);
  //       }
  //       this.setState({ friends: pushFriends, data: pushFriends });
  //     })
  //     .catch(err => console.log(err));
  // }

  // getAccounts() {
  //   // Get all accounts 
  //   api
  //     .getAllUsers()
  //     .then(res => {
  //       var accounts = []
  //       for (var account in res.userList) {

  //         var status = "Add";
          

  //         for(var i = 0; i < friends.length ; i++)
  //         {
  //           if(account.username == friends[i].username)
  //           {
  //             status = friends[i].status
  //             break
  //           }
  //         }


  //         var currAccount = {
  //           name: account.name,
  //           username: account.username,
  //           image: account.photo,
  //           friendStatus: status

  //         }
  //         accounts.push(currAccount);
  //       }
  //       this.setState({ friends: pushFriends, data: pushFriends });
  //     })
  //     .catch(err => console.log(err));
  // }



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
