import React from 'react'
import { Dimensions, FlatList, Modal, StyleSheet, Text, View } from 'react-native'
import AntDesign from 'react-native-vector-icons/AntDesign'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { SearchBar } from 'react-native-elements'
import PropTypes from 'prop-types'
import Alert from './alert.js'
import ChooseCard from '../cards/chooseCard.js'
import friendsApi from '../apis/friendsApi.js'

const hex = '#F15763'
const hexBlack = '#000000'
const font = 'CircularStd-Bold'
const fontRegular = 'CircularStd'
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
      members: this.props.members,
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
              this.state.members.some(
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
      .catch((err) => this.setState({ errorAlert: true }))
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
      <Modal animationType="none" transparent>
        <View style={styles.container}>
          <View style={styles.main}>
            <View style={styles.header}>
              <Text style={styles.headertext}>Friends</Text>
              <AntDesign name="closecircleo" style={styles.icon} onPress={() => this.handlePress()} />
            </View>
            <View style={styles.header2}>
              <Text style={styles.headertext2}>Group PIN: </Text>
              <Text style={styles.headertext3}>ABC123</Text>
              <Ionicons name="copy-outline" style={styles.icon2} /* onPress={insert function to copy room code}*//>
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
              style={{ marginLeft: '5%', marginRight: '5%', marginBottom: '10%' }}
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
          </View>
        </View>
        {this.state.errorAlert && (
          <Alert
            title="Error, please try again"
            button
            buttonText="Close"
            press={() => this.setState({ errorAlert: false })}
            cancel={() => this.setState({ errorAlert: false })}
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
    marginLeft: '1%',
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
    marginLeft: '4%',
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
  press: PropTypes.func,
}
