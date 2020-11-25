import React from 'react'
import { Dimensions, FlatList, Modal, StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import Clipboard from '@react-native-community/clipboard'
import AntDesign from 'react-native-vector-icons/AntDesign'
import Ionicons from 'react-native-vector-icons/Ionicons'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import { SearchBar } from 'react-native-elements'
import PropTypes from 'prop-types'
import Alert from './alert.js'
import ChooseCard from '../cards/chooseCard.js'
import friendsApi from '../apis/friendsApi.js'

const hex = '#F15763'
const hexBlack = '#000000'
const font = 'CircularStd-Bold'
const fontRegular = 'CircularStd-Medium'
const height = Dimensions.get('window').height

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
    this.getFriends()
  }

  //  gets your friends
  async getFriends() {
    // Pushing accepted friends or pending requests into this.state.friends
    friendsApi
      .getFriends()
      .then((res) => {
        var pushFriends = []
        for (var friend in res.friendList) {
          if (res.friendList[friend].status === 'Accepted') {
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

  // copies the room code (dummy text for now)
  copyToClipboard() {
    Clipboard.setString('BADWOLF42')
  }

  //  closes the choose friends modal in filters
  handlePress() {
    this.props.press()
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
              <Text style={styles.headertext}>Friends</Text>
              <AntDesign
                name="closecircleo"
                style={styles.icon}
                onPress={() => this.handlePress()}
              />
            </View>
            <View style={styles.header2}>
              <Text style={styles.headertext2}>Group PIN: </Text>
              <Text style={styles.headertext3}>BADWOLF42</Text>
              <TouchableOpacity onPress={this.copyToClipboard}>
                <Ionicons name="copy-outline" style={styles.icon2} />
              </TouchableOpacity>
            </View>
            <SearchBar
              containerStyle={{
                backgroundColor: 'white',
                borderBottomColor: 'transparent',
                borderTopColor: 'transparent',
                width: '100%',
                height: 45,
                alignSelf: 'center',
              }}
              inputContainerStyle={{
                height: 7,
                width: '90%',
                marginLeft: '5%',
                backgroundColor: '#ebecf0',
              }}
              inputStyle={{
                fontFamily: fontRegular,
                fontSize: 15,
              }}
              placeholder="Search for friends"
              onChangeText={(text) => this.searchFilterFunction(text)}
              value={this.state.search}
              lightTheme
              round
            />
            <FlatList
              style={{ marginLeft: '5%', marginRight: '5%', marginBottom: '2%' }}
              data={this.state.friends}
              renderItem={({ item }) => (
                <ChooseCard
                  name={item.name}
                  username={item.username}
                  image={item.image}
                  added={false}
                />
              )}
              keyExtractor={(item) => item.username}
            />
            <MaterialIcons name="keyboard-arrow-down" style={styles.icon3} />
          </View>
        </View>
        {this.state.deleteFriend && (
            <Alert
              title="Are you sure?"
              body={'You are about to remove @' + this.props.username + ' as a friend'}
              buttonAff="Delete"
              height='25%'
              press={() => this.deleteFriend()}
              cancel={() => this.setState({ deleteFriend: false })}
            />
          )}
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
    color: hex,
    fontSize: 25,
    alignSelf: 'center',
    margin: '4%',
  },
  icon2: {
    color: hexBlack,
    fontSize: 20,
    marginLeft: '7%',
  },
  icon3: {
    color: hex,
    fontSize: 35,
    marginBottom: '5%',
    alignSelf: 'center',
  },
  headertext: {
    fontFamily: font,
    color: hex,
    margin: '4%',
    marginLeft: '7%',
    fontSize: 25,
  },
  headertext2: {
    fontFamily: fontRegular,
    color: hexBlack,
    marginLeft: '7%',
    fontSize: 15,
  },
  headertext3: {
    fontFamily: font,
    color: hexBlack,
    fontSize: 15,
  },
})

ChooseFriends.propTypes = {
  members: PropTypes.array,
  press: PropTypes.func,
}
