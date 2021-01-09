import React from 'react'
import { Dimensions, FlatList, Modal, StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import { ID } from 'react-native-dotenv'
import { SearchBar } from 'react-native-elements'
import AntDesign from 'react-native-vector-icons/AntDesign'
import Ionicons from 'react-native-vector-icons/Ionicons'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import AsyncStorage from '@react-native-async-storage/async-storage'
import Clipboard from '@react-native-community/clipboard'
import PropTypes from 'prop-types'
import Card from '../cards/Card.js'
import friendsApi from '../apis/friendsApi.js'
import normalize from '../../styles/normalize.js'
import screenStyles from '../../styles/screenStyles.js'
import socket from '../apis/socket.js'

const height = Dimensions.get('window').height
var id = ''
//  little pop up modal that is showed when you click choose friends in filters
export default class ChooseFriends extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      data: '',
      friends: '',
      search: '',
      errorAlert: false,
    }
    AsyncStorage.getItem(ID).then((res) => {
      id = res
      this.getFriends(id)
    })
  }

  //  gets your friends
  getFriends(id) {
    // Pushing accepted friends or pending requests into this.state.friends
    friendsApi
      .getFriends(id)
      .then((res) => {
        let pushFriends = []
        for (var friend in res.friendList) {
          if (res.friendList[friend].status === 'friends') {
            if (
              this.props.members.some(
                (member) => member.username === res.friendList[friend].username,
              )
            ) {
              res.friendList[friend].added = true
              pushFriends.push(res.friendList[friend])
            } else {
              res.friendList[friend].added = false
              pushFriends.push(res.friendList[friend])
            }
          }
        }
        this.setState({ friends: pushFriends, data: pushFriends })
      })
      .catch(() => this.setState({ errorAlert: true }))
  }

  // copies the room code
  copyToClipboard() {
    Clipboard.setString(this.props.code.toString())
  }

  //  closes the choose friends modal in filters
  handlePress() {
    this.props.press()
  }

  sendInvite() {
    socket.sendInvite(this.props.username)
  }

  //  function for searching your friends
  searchFilterFunction(text) {
    this.setState({ search: text })
    const newData = this.state.data.filter((item) => {
      const itemData = `${item.name.toUpperCase()} ${item.username.toUpperCase()}`
      const textData = text.toUpperCase()
      return itemData.indexOf(textData) > -1
    })
    this.setState({ friends: newData })
  }

  render() {
    return (
      <Modal animationType="none" transparent visible={this.props.visible}>
        <View style={styles.container}>
          <View style={styles.main}>
            <View style={styles.header}>
              <Text style={[screenStyles.textBold, styles.headertext]}>Friends</Text>
              <AntDesign
                name="closecircleo"
                style={[styles.icon, screenStyles.hex]}
                onPress={() => this.handlePress()}
              />
            </View>
            <View style={styles.header2}>
              <Text style={[screenStyles.text, styles.subHeaderText, styles.subHeaderMarginL]}>
                Group PIN:
              </Text>
              <Text style={[screenStyles.textBold, styles.subHeaderText]}>{this.props.code}</Text>
              <TouchableOpacity onPress={() => this.copyToClipboard()}>
                <Ionicons name="copy-outline" style={styles.icon2} />
              </TouchableOpacity>
            </View>
            <SearchBar
              containerStyle={styles.searchBarContainer}
              inputContainerStyle={styles.searchBarInputContainer}
              inputStyle={[screenStyles.text, styles.searchBarInput]}
              placeholder="Search for friends"
              onChangeText={(text) => this.searchFilterFunction(text)}
              value={this.state.search}
              lightTheme
              round
            />
            <FlatList
              style={styles.flatList}
              data={this.state.friends}
              renderItem={({ item }) => (
                <Card
                  name={item.name}
                  image={item.photo}
                  id={item.id}
                  username={item.username}
                  currentUser={id}
                  total={this.state.data}
                  status="not added"
                  key={item.id}
                  press={() => this.sendInvite()}
                />
              )}
              keyExtractor={(item) => item.username}
            />
            <MaterialIcons name="keyboard-arrow-down" style={[styles.icon3, screenStyles.hex]} />
          </View>
        </View>
      </Modal>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: height,
    alignSelf: 'center',
    width: '90%',
  },
  main: {
    flex: 1,
    height: height * 0.8,
    backgroundColor: 'white',
    alignSelf: 'center',
    borderRadius: 10,
    elevation: 20,
  },
  header: {
    height: '9%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  header2: {
    height: '4.5%',
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  icon: {
    fontSize: normalize(25),
    margin: '4%',
  },
  icon2: {
    fontSize: normalize(20),
    marginLeft: '7%',
  },
  icon3: {
    fontSize: normalize(35),
    marginBottom: '5%',
    alignSelf: 'center',
  },
  headertext: {
    margin: '4%',
    marginLeft: '7%',
    fontSize: normalize(25),
  },
  subHeaderText: {
    color: 'black',
    fontSize: normalize(16),
  },
  subHeaderMarginL: {
    marginLeft: '7%',
  },
  searchBarContainer: {
    backgroundColor: 'white',
    borderBottomColor: 'transparent',
    borderTopColor: 'transparent',
    width: '100%',
    height: 45,
    alignSelf: 'center',
  },
  searchBarInputContainer: {
    height: 7,
    width: '90%',
    marginLeft: '5%',
    backgroundColor: '#ebecf0',
  },
  searchBarInput: {
    fontSize: normalize(15),
  },
  flatList: {
    marginHorizontal: '5%',
    marginBottom: '2%',
  },
})

ChooseFriends.propTypes = {
  members: PropTypes.array,
  press: PropTypes.func,
  visible: PropTypes.bool,
  code: PropTypes.number,
  username: PropTypes.string,
}
