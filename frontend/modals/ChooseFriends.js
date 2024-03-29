import React from 'react'
import { connect } from 'react-redux'
import { Dimensions, FlatList, Modal, StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import { bindActionCreators } from 'redux'
import { setDisable, hideDisable } from '../redux/Actions.js'
import { SearchBar } from 'react-native-elements'
import AntDesign from 'react-native-vector-icons/AntDesign'
import Ionicons from 'react-native-vector-icons/Ionicons'
import Clipboard from '@react-native-community/clipboard'
import PropTypes from 'prop-types'
import Card from '../cards/Card.js'
import normalize from '../../styles/normalize.js'
import screenStyles from '../../styles/screenStyles.js'
import socket from '../apis/socket.js'

const height = Dimensions.get('window').height
const width = Dimensions.get('window').width

//  little pop up modal that is showed when you click choose friends in filters
class ChooseFriends extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      data: '',
      search: '',
    }
  }

  //  gets your friends
  componentDidMount() {
    let pushFriends = []
    for (var friend in this.props.friends) {
      if (this.props.friends[friend].status === 'friends') {
        if (
          this.props.members.some(
            (member) => member.username === this.props.friends[friend].username,
          )
        ) {
          this.props.friends[friend].added = 'in group'
          pushFriends.push(this.props.friends[friend])
        } else {
          this.props.friends[friend].added = 'not added'
          pushFriends.push(this.props.friends[friend])
        }
      }
    }
    this.setState({ data: pushFriends })
  }

  // copies the room code
  copyToClipboard() {
    Clipboard.setString(this.props.session.code.toString())
  }

  //  closes the choose friends modal in filters
  handlePress() {
    this.props.press()
  }

  sendInvite(uid) {
    this.props.setDisable()
    socket.sendInvite(uid)
    var newArr = this.state.data.filter((item) => {
      if (item.uid === uid) item.status = 'in group'
      return item
    })
    this.setState({ data: newArr })
    this.props.hideDisable()
  }

  //  function for searching your friends
  searchFilterFunction(text) {
    this.setState({ search: text })
    const newData = this.props.friends.filter((item) => {
      const itemData = `${item.name.toUpperCase()} ${item.username.toUpperCase()}`
      const textData = text.toUpperCase()
      return itemData.indexOf(textData) > -1
    })
    this.setState({ data: newData })
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
              <Text style={[screenStyles.textBold, styles.subHeaderText]}>
                {this.props.session.code}
              </Text>
              <TouchableOpacity onPress={() => this.copyToClipboard()}>
                <Ionicons name="copy-outline" style={styles.icon2} />
              </TouchableOpacity>
            </View>
            <SearchBar
              containerStyle={styles.searchBarContainer}
              inputContainerStyle={styles.searchBarInputContainer}
              inputStyle={[screenStyles.medium, styles.searchBarInput]}
              placeholder="Search for friends"
              onChangeText={(text) => this.searchFilterFunction(text)}
              value={this.state.search}
              lightTheme
              round
            />
            <FlatList
              style={styles.flatList}
              data={this.state.data}
              renderItem={({ item }) => (
                <Card
                  name={item.name}
                  image={item.photo}
                  uid={item.uid}
                  username={item.username}
                  total={this.state.data}
                  status={item.added}
                  key={item.uid}
                  press={() => this.sendInvite(item.uid)}
                  disabled={this.props.disable}
                />
              )}
              keyExtractor={(item) => item.username}
            />
          </View>
        </View>
      </Modal>
    )
  }
}

const mapStateToProps = (state) => {
  const { disable } = state
  return { disable, session: state.session.session, friends: state.friends.friends }
}

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      setDisable,
      hideDisable,
    },
    dispatch,
  )

export default connect(mapStateToProps, mapDispatchToProps)(ChooseFriends)

ChooseFriends.propTypes = {
  members: PropTypes.array,
  press: PropTypes.func,
  visible: PropTypes.bool,
  friends: PropTypes.array,
  session: PropTypes.object,
  setDisable: PropTypes.func,
  hideDisable: PropTypes.func,
  disable: PropTypes.bool,
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    // height: width * 1.9333,
    height: height,
    alignSelf: 'center',
    width: '90%',
  },
  main: {
    flex: 1,
    // height: width * 1.5467,
    height: height * 0.8,
    backgroundColor: 'white',
    alignSelf: 'center',
    borderRadius: 10,
    elevation: 20,
  },
  header: {
    height: width * 0.14,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  header2: {
    height: height * 0.035,
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
