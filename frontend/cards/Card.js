import React from 'react'
import { Text, View, Image, TouchableHighlight, StyleSheet } from 'react-native'
import AntDesign from 'react-native-vector-icons/AntDesign'
import Icon from 'react-native-vector-icons/FontAwesome'
import PropTypes from 'prop-types'
import imgStyles from '../../styles/cardImage.js'
import { ID } from 'react-native-dotenv'
import AsyncStorage from '@react-native-community/async-storage'
import Alert from '../modals/Alert.js'
import friendsApi from '../apis/friendsApi.js'

const font = 'CircularStd-Medium'
const hex = '#F15763'
var id = ''

export default class Card extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      errorAlert: false,
      deleteFriend: false,
      renderOption: this.props.currentUser !== this.props.username,
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
          <Text style={styles.name}>{this.props.name}</Text>
          <Text style={styles.username}>@{this.props.username}</Text>
        </View>
        {this.props.status === 'Added' && (
          <View style={imgStyles.card}>
            <Text style={[imgStyles.text, styles.text]}>Added!</Text>
          </View>
        )}
        {this.props.status === 'Not Added' && (
          <TouchableHighlight>
            <View style={imgStyles.card}>
              <Text style={[imgStyles.text, { marginTop: '10%' }]}>Add</Text>
              <AntDesign
                style={[imgStyles.icon, { margin: '10%', marginTop: '20%', fontSize: 25 }]}
                name="pluscircleo"
                onPress={() => {
                  this.setState({ status: 'Added' })
                  this.props.press()
                }}
              />
            </View>
          </TouchableHighlight>
        )}
        {this.props.status === 'requested' && this.state.renderOption && (
          <View style={imgStyles.card}>
            <Text style={[imgStyles.text, { color: '#777777' }]}>Request Sent</Text>
            <Icon
              style={[imgStyles.icon, { fontSize: 20, margin: '8%', color: '#777777' }]}
              name="hourglass-end"
            />
          </View>
        )}
        {this.props.status === 'add' && this.state.renderOption && (
          <TouchableHighlight underlayColor="white" onPress={() => this.addFriend()}>
            <View style={imgStyles.card}>
              <Text style={[imgStyles.text, { color: 'black' }]}>Add Friend</Text>
              <AntDesign
                style={[imgStyles.icon, { fontSize: 25, margin: '8%', color: 'black' }]}
                name="pluscircleo"
              />
            </View>
          </TouchableHighlight>
        )}
        {this.props.status === 'friends' && this.state.renderOption && (
          <TouchableHighlight
            underlayColor="white"
            onPress={() => this.setState({ errorAlert: false, deleteFriend: true })}
          >
            <View style={imgStyles.card}>
              <Text style={[imgStyles.text]}>Friends</Text>
              <Icon style={[imgStyles.icon, { fontSize: 20, margin: '8%' }]} name="heart" />
            </View>
          </TouchableHighlight>
        )}
        {this.props.status === 'pending' && this.state.renderOption && (
          <View style={imgStyles.card}>
            <Text style={[imgStyles.text, { color: 'black' }]}>Pending Request</Text>
            <Icon
              style={[imgStyles.icon, { fontSize: 25, margin: '3%' }]}
              name="check-circle"
              onPress={() => this.acceptFriend}
            />
            <AntDesign
              style={[imgStyles.icon, { fontSize: 25, margin: '3%', color: 'black' }]}
              name="closecircleo"
              onPress={() => this.rejectFriend}
            />
          </View>
        )}
        {this.props.status == 'Friends' && (
          <TouchableHighlight
            onPress={() => this.setState({ errorAlert: false, deleteFriend: true })}
            underlayColor="transparent"
          >
            <View style={{ flexDirection: 'row', flex: 1, alignItems: 'center' }}>
              <Text style={(imgStyles.text, { color: hex, marginRight: '5%' })}>Friends</Text>
              <Icon
                style={(imgStyles.icon, { marginLeft: '5%', color: hex, fontSize: 18 })}
                name="heart"
              />
            </View>
          </TouchableHighlight>
        )}
        {this.state.deleteFriend && (
          <Alert
            title={'Unfriend ' + this.props.name}
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
  name: { fontFamily: font, fontWeight: 'bold', fontSize: 15 },
  username: { fontFamily: font, color: hex },
  text: { color: '#6A6A6A', marginRight: '8%' },
})
