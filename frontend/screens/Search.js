import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { changeFriends, hideError, hideRefresh, showError, showRefresh } from '../redux/Actions.js'
import { connect } from 'react-redux'
import { Dimensions, FlatList, StyleSheet, Text, View } from 'react-native'
import { BlurView } from '@react-native-community/blur'
import { SearchBar } from 'react-native-elements'
import PropTypes from 'prop-types'
import accountsApi from '../apis/accountsApi.js'
import Alert from '../modals/Alert.js'
import Card from '../cards/Card.js'
import friendsApi from '../apis/friendsApi.js'
import screenStyles from '../../styles/screenStyles.js'
import TabBar from '../Nav.js'

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
    }
  }

  componentDidMount() {
    var friendsMap = new Object()
    for (var friend in this.props.friends.friends) {
      friendsMap[this.props.friends.friends[friend].uid] = this.props.friends.friends[friend].status
    }
    this.setState({ friends: friendsMap })
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
          .catch(() => {}),
      100,
    )
  }

  async removeRequest(friend, newArr) {
    friendsApi
      .removeFriendship(friend)
      .then(() => {
        this.props.changeFriends(newArr)
        this.setState({ friends: newArr })
      })
      .catch(() => {
        this.setState({ errorAlert: true })
      })
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
        onChangeText={(text) => this.searchFilterFunction(text)}
        autoCorrect={false}
        value={this.state.value}
      />
    )
  }

  render() {
    return (
      <View style={screenStyles.mainContainer}>
        <Text style={[screenStyles.icons, styles.title]}>Find friends</Text>
        <FlatList
          data={this.state.data}
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
              press={(uid, newArr) => this.removeRequest(uid, newArr)}
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
            blur
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
            blur
            press={() => this.deleteFriend()}
            cancel={() => this.setState({ deleteFriend: false })}
          />
        )}
        <TabBar
          goHome={() => this.props.navigation.navigate('Home')}
          goSearch={() => {}}
          goNotifs={() => this.props.navigation.navigate('Notifications')}
          goProfile={() => this.props.navigation.navigate('Profile')}
          cur="Search"
        />
      </View>
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
  // error: PropTypes.bool,
  // refresh: PropTypes.bool,
  // friends: PropTypes.object,
  // username: PropTypes.object,
  showError: PropTypes.func,
  showRefresh: PropTypes.func,
  hideError: PropTypes.func,
  hideRefresh: PropTypes.func,
  changeFriends: PropTypes.func,
}

const styles = StyleSheet.create({
  title: {
    marginTop: '10%',
    textAlign: 'center',
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
