import React, {Component} from 'react';
import {
  Dimensions,
  FlatList,
  StyleSheet,
  Text,
  View
} from 'react-native'
import AsyncStorage from '@react-native-community/async-storage'
import Icon from 'react-native-vector-icons/FontAwesome'
import { SearchBar } from 'react-native-elements'
import PropTypes from 'prop-types';
import accountsApi from './accountsApi.js';
import SearchCard from './searchCard.js'
import Alert from './alert.js'
import { USERNAME } from 'react-native-dotenv'

const hex = '#F25763'
const font = 'CircularStd-Medium'
var username = ''
AsyncStorage.getItem(USERNAME).then((res) => (username = res))

export default class Search extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: [],
      friends: this.props.navigation.state.params.allFriends,
      errorAlert: false
    };
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
        accountsApi
          .searchUsers(text)
          .then(res => {
            // this.setState({data: res.userList});
            var resultUsers = []
            for (var user in res.userList) {
              var status = 'Add'
              if (res.userList[user].id in this.state.friends) {
                status = this.state.friends[res.userList[user].id ]
              }
              var person = {
                name: res.userList[user].name ,
                username: res.userList[user].username ,
                image: res.userList[user].photo,
                id: res.userList[user].id,
                status: status
              }
              resultUsers.push(person);
            }
            this.setState({data: resultUsers});
          })
          .catch(() => {}),
      100,
    );
  };

  async removeRequest(id, newArr, status) {
    if (!status) {
      friendsApi
        .removeFriendship(id)
        .then(() => {
          this.setState({ friends: newArr })
        })
        .catch(() => {
          this.setState({ errorAlert: true })
        })
    } else if (status) {
      this.setState({ friends: newArr })
    }
  }

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
        <Icon
          name="chevron-left"
          style={styles.topIcons}
          onPress={() => this.props.navigation.navigate('Home')}
        />    
        <Text style={styles.title}>Find New Friends!</Text>
        <FlatList
          data={this.state.data}
          renderItem={({item}) => (
            <SearchCard
              currentUser={username}
              name={item.name}
              username={item.username}
              image={item.photo}
              id = {item.id}
              requested={item.status}
              total={this.state.data}
              press={(id, newArr, status) => this.removeRequest(id, newArr, status)}
            />
          )}
          keyExtractor={(item) => item.username}
          ItemSeparatorComponent={this.renderSeparator}
          ListHeaderComponent={this.renderHeader}
        />
        {this.state.errorAlert && (
          <Alert
            title="Error, please try again"
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

Search.propTypes = {
  allFriends: PropTypes.array
}

const styles = StyleSheet.create({
  topIcons: {
    color: hex,
    fontSize: 27,
    marginLeft: '5%',
    marginTop: '5%'
  },
  title: {
    fontFamily: font,
    fontSize: 40,
    color: hex,
    textAlign: 'center',
    marginBottom: '4%'
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
