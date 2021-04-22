import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { changeFriends, hideError, hideRefresh, showError, showRefresh } from '../redux/Actions.js'
import { connect } from 'react-redux'
import { Dimensions, FlatList, ImageBackground, StyleSheet, Text } from 'react-native'
import { BlurView } from '@react-native-community/blur'
import { SearchBar } from 'react-native-elements'
import PropTypes from 'prop-types'
import accountsApi from '../apis/accountsApi.js'
import Alert from '../modals/Alert.js'
import Card from '../cards/Card.js'
import friendsApi from '../apis/friendsApi.js'
import modalStyles from '../../styles/modalStyles.js'
import screenStyles from '../../styles/screenStyles.js'
import TabBar from '../Nav.js'

// Used to make refreshing indicator appear/disappear
const sleep = (milliseconds) => {
  return new Promise((resolve) => setTimeout(resolve, milliseconds))
}

class Search extends Component {
  constructor(props) {
    super(props)
    this.state = {
      data: [],
      friends: [],
      errorAlert: false,
      deleteFriend: false,
      deleteFriendName: '',
      value: '',
      refresh: false,
    }
  }

  componentDidMount() {
    var friendsMap = new Object()
    for (var friend in this.props.friends.friends) {
      friendsMap[this.props.friends.friends[friend].uid] = this.props.friends.friends[friend].status
    }
    this.setState({ friends: friendsMap })

    for (var i = 0; i < this.props.friends.friends.length; i++) {
      if (this.props.friends.friends[i].status === 'requested')
        friendsApi.acceptFriendRequest(this.props.friends.friends[i].uid)
    }
  }

  async getFriends() {
    friendsApi
      .getFriends()
      .then((res) => {
        this.props.changeFriends(res.friendList)
        var friendsMap = new Object()
        for (var friend in res.friendList) {
          friendsMap[res.friendList[friend].uid] = res.friendList[friend].status
        }
        this.setState({ friends: friendsMap })
      })
      .catch(() => {
        this.props.showError()
      })
  }

  updateText = async (text) => {
    this.setState({
      value: text,
    })
  }

  searchFilterFunction = async () => {
    this.setState({ data: [] })
    clearTimeout(this.timeout) // clears the old timer
    if (!this.state.value) {
      var emptyArray = []
      this.setState({ data: emptyArray })
    } else {
      this.timeout = setTimeout(
        () => {
          if (this.state.value) {
            accountsApi
              .searchUsers(this.state.value)
              .then((res) => {
                var resultUsers = []
                for (var user in res.userList) {
                  var status = 'add'
                  if (res.userList[user].uid in this.state.friends) {
                    status = this.state.friends[res.userList[user].uid]
                  }
                  var person = {
                    name: res.userList[user].name,
                    username: res.userList[user].username,
                    image: res.userList[user].photo,
                    uid: res.userList[user].uid,
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
              .catch(() => {})
          }
        },
        300, //0.3 seconds, adjust as necessary
      )
    }
  }

  async removeRequest(newArr) {
    this.setState({ friends: newArr })
  }

  async acceptFriend(newArr) {
    this.setState({ friends: newArr })
  }

  async addFriend(newArr) {
    this.setState({ friends: newArr })
  }

  renderHeader = () => {
    return (
      <SearchBar
        containerStyle={styles.container}
        inputContainerStyle={styles.inputContainer}
        inputStyle={styles.input}
        placeholder="Search for friends"
        lightTheme={true}
        round={true}
        onChangeText={(text) => {
          this.updateText(text).then(() => {
            this.searchFilterFunction()
          })
        }}
        autoCorrect={false}
        value={this.state.value}
      />
    )
  }

  // Called on search-list pulldown refresh
  onRefresh() {
    this.props.showRefresh()
    sleep(2000)
      .then(this.getFriends())
      .then(this.searchFilterFunction(this.state.value))
      .then(this.props.hideRefresh())
  }

  render() {
    return (
      <ImageBackground
        source={require('../assets/backgrounds/Search.png')}
        style={[screenStyles.screenBackground]}
      >
        <Text style={[screenStyles.icons, styles.title]}>Find friends</Text>
        <FlatList
          style={styles.screen}
          data={this.state.data}
          extraData={this.state.data}
          renderItem={({ item }) => (
            <Card
              name={item.name}
              image={item.image}
              uid={item.uid}
              username={item.username}
              currentUser={this.props.username.username}
              total={this.state.data}
              status={item.status}
              key={item.uid}
              press={(newArr) => this.removeRequest(newArr)}
              unfriendAlert={(bool) => this.setState({ deleteFriend: bool })}
              accept={(newArr) => this.acceptFriend(newArr)}
              add={(newArr) => this.addFriend(newArr)}
              changeAdd={true}
            />
          )}
          keyExtractor={(item) => item.username}
          ListHeaderComponent={this.renderHeader}
          onRefresh={() => this.onRefresh()}
          refreshing={this.state.refresh}
          stickyHeaderIndices={[0]}
        />
        {(this.state.errorAlert || this.state.deleteFriend) && (
          <BlurView
            blurType="dark"
            blurAmount={10}
            reducedTransparencyFallbackColor="black"
            style={modalStyles.blur}
          />
        )}
        {this.state.errorAlert && (
          <Alert
            title="Error, please try again"
            buttonAff="Close"
            height="20%"
            blur
            press={() => this.setState({ errorAlert: false })}
            cancel={() => this.setState({ errorAlert: false })}
          />
        )}
        <TabBar
          goHome={() => this.props.navigation.replace('Home')}
          goSearch={() => {}}
          goNotifs={() => this.props.navigation.replace('Notifications')}
          goProfile={() => this.props.navigation.replace('Profile')}
          cur="Search"
        />
      </ImageBackground>
    )
  }
}

const mapStateToProps = (state) => {
  const { error } = state
  const { refresh } = state
  const { friends } = state
  const { username } = state
  return { error, refresh, friends, username }
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

export default connect(mapStateToProps, mapDispatchToProps)(Search)

Search.propTypes = {
  navigation: PropTypes.object,
  error: PropTypes.bool,
  refresh: PropTypes.bool,
  friends: PropTypes.object,
  username: PropTypes.object,
  showError: PropTypes.func,
  showRefresh: PropTypes.func,
  hideError: PropTypes.func,
  hideRefresh: PropTypes.func,
  changeFriends: PropTypes.func,
}

const styles = StyleSheet.create({
  title: {
    marginTop: '7%',
    textAlign: 'center',
    color: 'white',
  },
  screen: {
    marginBottom: '17%',
    marginTop: '13%',
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
    textAlignVertical: 'center',
    fontFamily: screenStyles.medium.fontFamily,
    fontSize: 18,
  },
})
