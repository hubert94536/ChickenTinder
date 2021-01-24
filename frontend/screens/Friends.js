import React from 'react'
import { bindActionCreators } from 'redux'
import { changeFriends, hideError, hideRefresh, showError, showRefresh } from '../redux/Actions.js'
import { connect } from 'react-redux'
import { Dimensions, RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native'
import PropTypes from 'prop-types'
import { SearchBar } from 'react-native-elements'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import Alert from '../modals/Alert.js'
import Card from '../cards/Card.js'
import friendsApi from '../apis/friendsApi.js'
import normalize from '../../styles/normalize.js'
import screenStyles from '../../styles/screenStyles.js'

// Used to make refreshing indicator appear/disappear
const sleep = (milliseconds) => {
  return new Promise((resolve) => setTimeout(resolve, milliseconds))
}

const height = Dimensions.get('window').height

class Friends extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      search: '',
      data: [], // array for friends
      friends: [], // array of Profile components
      isFriends: this.props.isFriends, // For rendering friends (true) or requests (false)
      refreshing: true, // Are we currently refreshing the list?
      friendsApiCalled: false, //render loading gif when fetching friends
    }
    this.getFriends()
  }
  //  gets the users friends
  async getFriends() {
    // Pushing accepted friends or pending requests into this.state.friends
    friendsApi
      .getFriends()
      .then((res) => {
        var pushFriends = []
        var friendOrRequest = this.state.isFriends ? 'friends' : 'pending'
        for (var friend in res.friendList) {
          if (res.friendList[friend].status === friendOrRequest) {
            pushFriends.push(res.friendList[friend])
          }
        }
        //  need two so when you search it doesn't get rid of all the friends
        this.setState({
          friends: pushFriends,
          data: pushFriends,
          refreshing: false,
          friendsApiCalled: true,
        })
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

  async removeRequest(friend, newArr) {
    friendsApi
      .removeFriendship(friend)
      .then(() => {
        this.setState({ friends: newArr, data: newArr })
      })
      .catch(() => {
        this.props.showError()
      })
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
            uid={friendList[i].uid}
            username={friendList[i].username}
            total={this.state.friends}
            status={status}
            key={i}
            index={i}
            press={(uid, newArr) => this.removeRequest(uid, newArr)}
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
                inputStyle={(styles.text, styles.input)}
                placeholder="Search by username"
                onChangeText={(text) => this.searchFilterFunction(text)}
                value={this.state.search}
                lightTheme
                round
              />
            </View>
            <ScrollView
              style={[styles.scrollView]}
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
            {this.props.error.error && (
              <Alert
                title="Error, please try again"
                buttonAff="Close"
                height="20%"
                press={() => this.props.hideError()}
                cancel={() => this.props.hideError()}
              />
            )}
          </View>
        )}
        {this.state.friends.length === 0 &&
          this.state.friendsApiCalled && ( //Show no friends view if there aren't any friends
            <View>
              <Icon name="emoticon-sad-outline" style={[styles.sadFace]} />
              <Text style={[screenStyles.text, styles.noFriendText1]}>No friends, yet</Text>
              <Text style={[screenStyles.textBook, styles.noFriendText2]}>
                You have no friends, yet. Add friends using the search feature below!
              </Text>
            </View>
          )}
        {!this.state.friendsApiCalled && <View></View>}
      </View>
    )
  }
}

const mapStateToProps = (state) => {
  const { error } = state
  const { refresh } = state
  const { friends } = state
  return { error, refresh, friends }
}

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      showError,
      hideError,
      showRefresh,
      hideRefresh,
      changeFriends,
    },
    dispatch,
  )

export default connect(mapStateToProps, mapDispatchToProps)(Friends)

Friends.propTypes = {
  isFriends: PropTypes.bool,
  onFriendsChange: PropTypes.func,
  error: PropTypes.object,
  friends: PropTypes.object,
  refresh: PropTypes.object,
  showError: PropTypes.func,
  hideError: PropTypes.func,
  showRefresh: PropTypes.func,
  hideRefresh: PropTypes.func,
  changeFriends: PropTypes.func,
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderBottomColor: 'transparent',
    borderTopColor: 'transparent',
    width: '100%',
    height: '35%',
    alignSelf: 'center',
  },
  inputContainer: {
    height: 7,
    width: '90%',
    alignSelf: 'center',
    backgroundColor: '#ebecf0',
  },
  input: {
    fontSize: normalize(15),
  },
  scrollView: {
    flexDirection: 'column',
  },
  sadFace: {
    fontSize: normalize(72),
    marginTop: '15%',
    alignSelf: 'center',
  },
  noFriendText1: {
    fontSize: normalize(20),
    marginTop: '1%',
    alignSelf: 'center',
    fontWeight: 'bold',
  },

  noFriendText2: {
    marginTop: '3%',
    marginHorizontal: '6%',
    alignSelf: 'center',
    textAlign: 'center',
    fontSize: normalize(16),
    color: 'grey',
  },
  gif: {
    alignSelf: 'center',
    width: height * 0.3,
    height: height * 0.4,
  },
})
