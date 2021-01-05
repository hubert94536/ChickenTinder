import React from 'react'
import { RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native'
import PropTypes from 'prop-types'
import { ID } from 'react-native-dotenv'
import { SearchBar } from 'react-native-elements'
import AsyncStorage from '@react-native-community/async-storage'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import Alert from '../modals/Alert.js'
// import Card from '../cards/ProfileCard.js'
import Card from '../cards/Card.js'
import friendsApi from '../apis/friendsApi.js'
import screenStyles from '../../styles/screenStyles.js'

const font = 'CircularStd-Medium'
var id = ''
// Used to make refreshing indicator appear/disappear
const sleep = (milliseconds) => {
  return new Promise((resolve) => setTimeout(resolve, milliseconds))
}

export default class Friends extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      search: '',
      errorAlert: false,
      data: [], // array for friends
      friends: [], // array of Profile components
      isFriends: this.props.isFriends, // For rendering friends (true) or requests (false)
      refreshing: false, // Are we currently refreshing the list?
    }
    AsyncStorage.getItem(ID).then((res) => {
      id = res
      this.getFriends(id)
    })
  }

  //  gets the users friends
  async getFriends(id) {
    // Pushing accepted friends or pending requests into this.state.friends
    friendsApi
      .getFriends(id)
      .then((res) => {
        var pushFriends = []
        var friendOrRequest = this.state.isFriends ? 'friends' : 'pending'
        for (var friend in res.friendList) {
          if (res.friendList[friend].status === friendOrRequest) {
            pushFriends.push(res.friendList[friend])
          }
        }
        //  need two so when you search it doesn't get rid of all the friends
        this.setState({ friends: pushFriends, data: pushFriends })
      })
      .catch(() => this.setState({ errorAlert: true }))
      .then(() => {
        this.props.onFriendsChange(this.state.friends.length)
      })
  }

  //  searches the users friends by username
  searchFilterFunction(text) {
    this.setState({
      search: text,
    })
    const newData = this.state.data.filter((item) => {
      const itemData = `${item.name.toUpperCase()} ${item.username.toUpperCase()}`
      const textData = text.toUpperCase()
      return itemData.indexOf(textData) > -1
    })
    this.setState({ friends: newData })
  }

  async removeRequest(friend, newArr, status) {
    // friendsApi
    //   .removeFriendship(id, friend)
    //   .then(() => {
    //     this.setState({ friends: newArr })
    //   })
    //   .catch((err) => {
    //     console.log(err)
    //     this.setState({ errorAlert: true })
    //   })
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

  // Called on friends-list pulldown refresh
  onRefresh() {
    this.setState({ refreshing: true })
    sleep(2000).then(this.getFriends().then(this.setState({ refreshing: false })))
  }

  render() {
    var friends = []
    var friendList = this.state.friends
    // Create all friend/request cards
    if (Array.isArray(friendList) && friendList.length) {
      for (var i = 0; i < friendList.length; i++) {
        var status = ''
        // if (this.props.isFriends) status = 'Friends'
        if (this.props.isFriends) status = 'friends'
        else status = 'Not Friends'
        friends.push(
          <Card
            name={friendList[i].name}
            image={friendList[i].photo}
            id={friendList[i].id}
            username={friendList[i].username}
            currentUser={id}
            total={this.state.friends}
            status={status}
            key={i}
            index={i}
            press={(id, newArr, status) => this.removeRequest(id, newArr, status)}
          />,
        )
      }
    }
    return (
      <View>
        {this.state.friends.length > 0 && ( //Shows search bar + friends list if there are friends
          <View>
            <View>
              <SearchBar
                containerStyle={styles.container}
                inputContainerStyle={styles.inputContainer}
                inputStyle={styles.input}
                placeholder="Search by username"
                onChangeText={(text) => this.searchFilterFunction(text)}
                value={this.state.search}
                lightTheme
                round
              />
            </View>
            <ScrollView
              style={{ flexDirection: 'column' }}
              alwaysBounceVertical="true"
              refreshControl={
                <RefreshControl
                  refreshing={this.state.refreshing}
                  onRefresh={this.onRefresh.bind(this)}
                />
              }
            >
              {friends}
            </ScrollView>
            {this.state.errorAlert && (
              <Alert
                title="Error, please try again"
                buttonAff="Close"
                height="20%"
                press={() => this.setState({ errorAlert: false })}
                cancel={() => this.setState({ errorAlert: false })}
              />
            )}
          </View>
        )}
        {this.state.friends.length === 0 && ( //Show no friends view if there aren't any friends
          <View>
            <Icon
              name="emoticon-sad-outline"
              style={{ fontSize: 72, marginTop: '15%', alignSelf: 'center' }}
            />
            <Text
              style={{
                fontFamily: font,
                fontSize: 20,
                marginTop: '1%',
                alignSelf: 'center',
                fontWeight: 'bold',
              }}
            >
              No friends, yet
            </Text>
            <Text
              style={[
                screenStyles.text,
                {
                  marginTop: '3%',
                  marginHorizontal: '6%',
                  alignSelf: 'center',
                  textAlign: 'center',
                  fontSize: 16,
                  fontFamily: 'CircularStd-Book',
                  color: 'grey',
                },
              ]}
            >
              You have no friends, yet. Add friends using the search feature below!
            </Text>
          </View>
        )}
      </View>
    )
  }
}

Friends.propTypes = {
  isFriends: PropTypes.bool,
  onFriendsChange: PropTypes.func,
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
})
