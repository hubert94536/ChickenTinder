import React, {Component} from 'react';
import {
  Dimensions,
  FlatList,
  StyleSheet,
  Text,
  View
} from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome'

import { SearchBar } from 'react-native-elements'
import api from './accountsApi.js';
import Card from './searchCard.js'

const hex = '#F25763'
const font = 'CircularStd-Medium'

export default class Search extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: [],
      friends: this.props.navigation.state.params.allFriends,
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
        api
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
            <Card
              name={item.name}
              username={'@' + item.username}
              image={item.photo}
              requested={item.status}
            />
          )}
          keyExtractor={(item) => item.username}
          ItemSeparatorComponent={this.renderSeparator}
          ListHeaderComponent={this.renderHeader}
        />
      </View>
    );
  }
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
