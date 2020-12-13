import React, { Component } from 'react'
import { Dimensions, FlatList, StyleSheet, Text, View } from 'react-native'
import { ID, USERNAME } from 'react-native-dotenv'
import { BlurView } from '@react-native-community/blur'
import { SearchBar } from 'react-native-elements'
import AsyncStorage from '@react-native-community/async-storage'
import PropTypes from 'prop-types'
import accountsApi from '../apis/accountsApi.js'
import SearchCard from '../cards/searchCard.js'
import Alert from '../modals/alert.js'
import screenStyles from '../../styles/screenStyles.js'
import friendsApi from '../apis/friendsApi.js'
import TabBar from '../nav.js'

const font = 'CircularStd-Medium'
var username = ''
var id = ''
AsyncStorage.getItem(USERNAME).then((res) => (username = res))

export default class Search extends Component {
  constructor(props) {
    super(props)
    this.state = {
      data: [],
      friends: [],
      errorAlert: false,
      deleteFriend: false,
      deleteFriendName: '',
      value: '',
    }
    AsyncStorage.multiGet([ID, USERNAME]).then((res) => {
      id = res[0][1]
      username = res[1][1]
      friendsApi
      .getFriends(id)
      .then((res) => {
        var friendsMap = new Object()
        for (var friend in res.friendList) {
          friendsMap[res.friendList[friend].id] = res.friendList[friend].status
        }
        this.setState({ friends: friendsMap })
      })
      .catch(() => {
        this.setState({ errorAlert: true })
      })
    })
  }

  searchFilterFunction = (text) => {
    this.setState({
      value: text,
    })

    clearTimeout(this.timeout) // clears the old timer
    this.timeout = setTimeout(
      () =>
        accountsApi
          .searchUsers(text)
          .then((res) => {
            var resultUsers = []
            for (var user in res.userList) {
              var status = 'add'
              if (res.userList[user].id in this.state.friends) {
                status = this.state.friends[res.userList[user].id]
              }
              var person = {
                name: res.userList[user].name,
                username: res.userList[user].username,
                image: res.userList[user].photo,
                id: res.userList[user].id,
                status: status,
              }
              if (person === undefined) {
                this.setState({ errorAlert: true })
                return
              }
              resultUsers.push(person)
            }
            this.setState({ data: resultUsers })
          })
          .catch(() => {}),
      100,
    )
  }

  async removeRequest(friend, newArr, status) {
    if (!status) {
      friendsApi
        .removeFriendship(id, friend)
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
        inputStyle={[styles.input, { textAlignVertical: 'center' }]}
        placeholder="Search for friends"
        lightTheme={true}
        round={true}
        onChangeText={(text) => this.searchFilterFunction(text)}
        autoCorrect={false}
        value={this.state.value}
      />
    )
  }

  render() {
    return (
      <View style={{ flex: 1, backgroundColor: 'white' }}>
        <Text style={[screenStyles.icons, { marginTop: '10%', textAlign: 'center' }]}>
          Find friends
        </Text>
        <FlatList
          data={this.state.data}
          renderItem={({ item }) => (
            <SearchCard
              currentUser={username}
              name={item.name}
              username={item.username}
              image={item.image}
              id={item.id}
              requested={item.status}
              total={this.state.data}
              press={(id, newArr, status) => this.removeRequest(id, newArr, status)}
              showError={() => this.setState({ errorAlert: true })}
              deleteError={() => this.setState({ errorAlert: false })}
              showDelete={() =>
                this.setState({ deleteFriend: true, deleteFriendName: item.username })
              }
              deleteDelete={() => this.setState({ deleteFriend: false })}
            />
          )}
          keyExtractor={(item) => item.username}
          ListHeaderComponent={this.renderHeader}
        />
        {(this.state.errorAlert || this.state.deleteFriend) && (
          <BlurView blurType="dark" blurAmount={10} reducedTransparencyFallbackColor="black" />
        )}
        {this.state.errorAlert && (
          <Alert
            title="Error, please try again"
            buttonAff="Close"
            height="20%"
            press={() => this.setState({ errorAlert: false })}
            cancel={() => this.setState({ errorAlert: false })}
          />
        )}
        {this.state.deleteFriend && (
          <Alert
            title="Are you sure?"
            body={'You are about to remove @' + this.state.deleteFriendName + ' as a friend'}
            buttonAff="Delete"
            height="25%"
            press={() => this.deleteFriend()}
            cancel={() => this.setState({ deleteFriend: false })}
          />
        )}
        <TabBar
          goHome={() => this.props.navigation.navigate('Home')}
          goSearch={() => this.props.navigation.navigate('Search')}
          goNotifs={() => this.props.navigation.navigate('Notifications')}
          goProfile={() => this.props.navigation.navigate('Profile')}
          cur="Search"
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  topIcons: {
    marginLeft: '5%',
    marginTop: '5%',
  },
  container: {
    backgroundColor: 'white',
    borderBottomColor: 'transparent',
    borderTopColor: 'transparent',
    width: '95%',
    height: Dimensions.get('window').height * 0.08,
    alignSelf: 'center',
  },
  inputContainer: {
    height: Dimensions.get('window').height * 0.05,
    width: '90%',
    alignSelf: 'center',
    backgroundColor: '#e7e7e7',
  },
  input: {
    textAlignVertical: 'bottom',
    fontFamily: font,
    fontSize: 18,
  },
})
