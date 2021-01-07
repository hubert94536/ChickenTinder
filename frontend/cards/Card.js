import React from 'react'
import { Image, StyleSheet, Text, TouchableHighlight, View } from 'react-native'
import AntDesign from 'react-native-vector-icons/AntDesign'
import AsyncStorage from '@react-native-async-storage/async-storage'
import Icon from 'react-native-vector-icons/FontAwesome'
import PropTypes from 'prop-types'
import Alert from '../modals/Alert.js'
import friendsApi from '../apis/friendsApi.js'
import { ID } from 'react-native-dotenv'
import imgStyles from '../../styles/cardImage.js'
import normalize from '../../styles/normalize.js'

var id = ''
export default class Card extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      errorAlert: false,
      deleteFriend: false,
      status: this.props.status,
      pressed: false,
    }
    AsyncStorage.getItem(ID).then((res) => {
      id = res
    })
  }

  async deleteFriend() {
    friendsApi
      .removeFriendship(id, this.props.id)
      .then(() => {
        this.setState({ deleteFriend: false })
        var filteredArray = this.props.total.filter((item) => {
          return item.username !== this.props.username
        })
        this.props.press(this.props.id, filteredArray, true)
      })
      .catch(() => this.setState({ errorAlert: true, deleteFriend: false }))
  }

  async acceptFriend() {
    friendsApi
      .acceptFriendRequest(id, this.props.id)
      .then(() => {
        this.setState({ requested: 'friends' })
      })
      .catch(() => this.setState({ errorAlert: true }))
  }

  async addFriend() {
    friendsApi
      .createFriendship(id, this.props.id)
      .then(() => {
        this.setState({ requested: 'requested' })
      })
      .catch(() => this.setState({ errorAlert: true }))
  }

  async rejectFriend() {
    friendsApi
      .removeFriendship(id, this.props.id)
      .then(() => {
        this.setState({ requested: 'add' })
      })
      .catch(() => this.setState({ errorAlert: true }))
  }

  render() {
    const renderOption = this.props.currentUser !== this.props.username
    return (
      <View style={styles.container}>
        {this.props.image.includes('file') || this.props.image.includes('http') ? (
          <Image
            source={{
              uri: this.props.image,
            }}
            style={imgStyles.button}
          />
        ) : (
          <Image source={this.props.image} style={imgStyles.button} />
        )}
        <View style={styles.info}>
          <Text style={[imgStyles.font, styles.name]}>{this.props.name}</Text>
          <Text style={[imgStyles.font, imgStyles.hex]}>@{this.props.username}</Text>
        </View>
        {/* if user is in a group */}
        {this.props.status === 'in group' && (
          <View style={imgStyles.card}>
            <Text style={[imgStyles.text, styles.text]}>Added!</Text>
          </View>
        )}
        {/* if user is not in a group */}
        {this.props.status === 'not added' && (
          <TouchableHighlight>
            <View style={imgStyles.card}>
              <Text style={[imgStyles.text, styles.topMargin]}>Add</Text>
              <AntDesign
                style={[imgStyles.icon, styles.addIcon]}
                name="pluscircleo"
                onPress={() => {
                  this.setState({ status: 'in group' })
                  this.props.press()
                }}
              />
            </View>
          </TouchableHighlight>
        )}
        {/* if user has requested to add them as a friend */}
        {this.props.status === 'requested' && renderOption && (
          <View style={imgStyles.card}>
            <Text style={[imgStyles.text, styles.grey]}>Request Sent</Text>
            <Icon style={[imgStyles.icon, styles.icon, styles.grey]} name="hourglass-end" />
          </View>
        )}
        {/* if they are not friends */}
        {this.props.status === 'add' && renderOption && (
          <TouchableHighlight underlayColor="white" onPress={() => this.addFriend()}>
            <View style={imgStyles.card}>
              <Text style={[imgStyles.text, styles.black]}>Add Friend</Text>
              <AntDesign style={[imgStyles.icon, styles.icon, styles.black]} name="pluscircleo" />
            </View>
          </TouchableHighlight>
        )}
        {/* if they are friends */}
        {this.props.status === 'friends' && renderOption && (
          <TouchableHighlight
            underlayColor="transparent"
            onPress={() => this.setState({ errorAlert: false, deleteFriend: true })}
          >
            <View style={imgStyles.card}>
              <Text style={[imgStyles.text]}>Friends</Text>
              <Icon style={[imgStyles.icon, styles.icon]} name="heart" />
            </View>
          </TouchableHighlight>
        )}
        {/* if they've requested you as a friend*/}
        {this.props.status === 'pending' && renderOption && (
          <View style={imgStyles.card}>
            <Text style={[imgStyles.text, styles.black]}>Pending Request</Text>
            <Icon
              style={[imgStyles.icon, styles.pend]}
              name="check-circle"
              onPress={() => this.acceptFriend}
            />
            <AntDesign
              style={[imgStyles.icon, styles.pend, styles.black]}
              name="closecircleo"
              onPress={() => this.rejectFriend}
            />
          </View>
        )}
        {this.state.deleteFriend && (
          <Alert
            title={'Unfriend ' + name}
            body="If you change your mind, you'll have to send a friends request again."
            buttonAff="Unfriend"
            buttonNeg="Cancel"
            height="28%"
            twoButton
            press={() => {
              this.deleteFriend()
            }}
            cancel={() => this.setState({ deleteFriend: false })}
          />
        )}
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
    )
  }
}

Card.propTypes = {
  currentUser: PropTypes.string,
  username: PropTypes.string,
  status: PropTypes.string,
  id: PropTypes.string,
  total: PropTypes.array,
  image: PropTypes.string,
  press: PropTypes.func,
  name: PropTypes.string,
}

const styles = StyleSheet.create({
  container: { flexDirection: 'row', flex: 1, width: '85%', alignSelf: 'center' },
  info: {
    alignSelf: 'center',
    marginLeft: '1%',
    flex: 1,
  },
  name: { fontWeight: 'bold', fontSize: normalize(15) },
  text: { color: '#6A6A6A', marginRight: '8%' },
  icon: { fontSize: normalize(20), margin: '8%' },
  pend: { fontSize: normalize(25), margin: '3%' },
  grey: { color: '#777777' },
  black: { color: 'black' },
  topMargin: { marginTop: '10%' },
  addIcon: { margin: '10%', marginTop: '20%', fontSize: normalize(25) },
})
