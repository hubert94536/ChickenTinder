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

const width = Dimensions.get('window').width

class Friends extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      search: '',
      data: [], // array for friends
      friends: [], // array of Profile components
      friendsApiCalled: false, //render loading gif when fetching friends
    }
    this.props.hideRefresh()
    this.props.hideError()
  }

  //  gets the users friends
  async getFriends() {
    // Pushing accepted friends or pending requests into this.state.friends
    friendsApi
      .getFriends()
      .then((res) => {
        this.props.changeFriends(res.friendList)
        this.editFriends()
      })
      .catch(() => {
        this.props.showError()
      })
  }

  editFriends() {
    var pushFriends = []
    for (var friend in this.props.friends.friends) {
      if (this.props.friends.friends[friend].status === 'friends') {
        pushFriends.push(this.props.friends.friends[friend])
      }
    }
    //  need two so when you search it doesn't get rid of all the friends
    this.setState({
      friends: pushFriends,
      data: pushFriends,
      friendsApiCalled: true,
    })
    this.props.onFriendsChange(pushFriends.length)
  }

  componentDidMount() {
    this.editFriends()
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

  async removeRequest(newArr) {
    this.props.changeFriends(newArr)
    this.setState({ friends: newArr, data: newArr })
    this.props.onFriendsChange(newArr.length)
    console.log(newArr)
  }

  // Called on friends-list pulldown refresh
  onRefresh() {
    this.props.showRefresh()
    sleep(2000).then(this.getFriends().then(this.props.hideRefresh()))
  }

  render() {
    var friends = []
    var friendList = this.state.friends
    // Create all friend/request cards
    if (Array.isArray(friendList) && friendList.length) {
      for (var i = 0; i < friendList.length; i++) {
        var status = ''
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
            press={(newArr) => this.removeRequest(newArr)}
            unfriendAlert={this.props.unfriendAlert}
            changeAdd={false}
          />,
        )
      }
    }
    return (
      <View>
        <View>
          <SearchBar
            containerStyle={styles.container}
            inputContainerStyle={styles.inputContainer}
            inputStyle={(screenStyles.text, styles.input)}
            placeholder="Search by username"
            onChangeText={(text) => this.searchFilterFunction(text)}
            value={this.state.search}
            lightTheme
            round
          />
        </View>
        {this.state.friends.length > 0 && ( //Shows search bar + friends list if there are friends
          <View>
            <ScrollView
              style={[styles.scrollView]}
              alwaysBounceVertical="true"
              refreshControl={
                <RefreshControl
                  refreshing={this.props.refresh}
                  onRefresh={this.onRefresh.bind(this)}
                />
              }
            >
              {friends}
            </ScrollView>
            {this.props.error && (
              <Alert
                title="Uh oh!"
                body="Something went wrong. Please try again!"
                buttonAff="Close"
                height="25%"
                press={() => this.props.hideError()}
                cancel={() => this.props.hideError()}
              />
            )}
          </View>
        )}
        {this.state.data.length === 0 &&
          this.state.friendsApiCalled && ( //Show no friends view if there aren't any friends
            <ScrollView
              refreshControl={
                <RefreshControl
                  refreshing={this.props.refresh}
                  onRefresh={this.onRefresh.bind(this)}
                />
              }
            >
              <View>
                <Icon name="emoticon-sad-outline" style={[styles.sadFace]} />
                <Text style={[screenStyles.text, styles.noFriendText1]}>No friends, yet</Text>
                <Text style={[screenStyles.textBook, styles.noFriendText2]}>
                  You have no friends, yet. Add friends using the search feature below!
                </Text>
              </View>
            </ScrollView>
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
  error: PropTypes.bool,
  friends: PropTypes.object,
  refresh: PropTypes.bool,
  showError: PropTypes.func,
  hideError: PropTypes.func,
  showRefresh: PropTypes.func,
  hideRefresh: PropTypes.func,
  changeFriends: PropTypes.func,
  unfriendAlert: PropTypes.func,
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderBottomColor: 'transparent',
    borderTopColor: 'transparent',
    width: '100%',
    height: width * 0.12,
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
    height: width * 0.75,
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
})
