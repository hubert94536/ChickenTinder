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

const width = Dimensions.get('window').width

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
    // creates a mapping of each friend's uid to status
    let friendsMap = new Object()
    for (let friend in this.props.friends) {
      friendsMap[this.props.friends[friend].uid] = this.props.friends[friend].status
    }
    this.setState({ friends: friendsMap })
  }

  // fetches friends list from server and updates mapping of uid to status
  async getFriends() {
    friendsApi
      .getFriends()
      .then((res) => {
        this.props.changeFriends(res.friendList)
        let friendsMap = new Object()
        for (let friend in res.friendList) {
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

  // filters uses in search after a give timeout
  searchFilterFunction = async () => {
    this.setState({ data: [] })
    clearTimeout(this.timeout) // clears the old timer
    if (!this.state.value) {
      this.setState({ data: [] })
    } else {
      this.timeout = setTimeout(
        () => {
          if (this.state.value) {
            // search for users
            accountsApi
              .searchUsers(this.state.value)
              .then((res) => {
                let resultUsers = []
                // match searched users with friendlist
                for (let user in res.userList) {
                  let status = 'add'
                  if (res.userList[user].uid in this.state.friends) {
                    status = this.state.friends[res.userList[user].uid]
                  }
                  let person = {
                    name: res.userList[user].name,
                    username: res.userList[user].username,
                    image: res.userList[user].photo,
                    uid: res.userList[user].uid,
                    status: status,
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

  updateFriends(newArr) {
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
        imageStyle={{ resizeMode: 'stretch' }}
        style={screenStyles.screenBackground}
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
              currentUser={this.props.username}
              total={this.state.data}
              status={item.status}
              key={item.uid}
              press={(newArr) => this.updateFriends(newArr)}
              unfriendAlert={(bool) => this.setState({ deleteFriend: bool })}
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
            title="Uh oh!"
            body="Something went wrong. Please try again!"
            buttonAff="Close"
            height="25%"
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
  return {
    error: state.error.error,
    refresh: state.refresh.refresh,
    friends: state.friends.friends,
    username: state.username.username,
  }
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
  friends: PropTypes.array,
  username: PropTypes.string,
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
    height: width * 0.1546,
    alignSelf: 'center',
  },
  inputContainer: {
    height: width * 0.0966,
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
