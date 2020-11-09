import React from 'react'
import { Image, Text, View, TouchableHighlight } from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome'
import PropTypes from 'prop-types'
import Alert from '../modals/alert.js'
import friendsApi from '../apis/friendsApi.js'
import imgStyles from '../../styles/cardImage.js'

// commented out during linting but hex is used in commented-out code below
const hex = '#F25763'
const font = 'CircularStd-Medium'

// cards for the search for friends screen
export default class SearchCard extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      // for button display
      requested: this.props.requested,
      pressed: false,
      errorAlert: false,
      deleteFriend: false,
      renderOption: this.props.currentUser !== this.props.username,
    }
  }

  async acceptFriend() {
    friendsApi
      .acceptFriendRequest(this.props.id)
      .then(() => {
        this.setState({ requested: 'Accepted' })
      })
      .catch(() => this.setState({ errorAlert: true }))
  }

  async addFriend() {
    friendsApi
      .createFriendship(this.props.id)
      .then(() => {
        this.setState({ requested: 'Requested' })
      })
      .catch(() => this.setState({ errorAlert: true }))
  }

  async rejectFriend() {
    friendsApi
      .removeFriendship(this.props.id)
      .then(() => {
        this.setState({ requested: 'Add' })
      })
      .catch(() => this.setState({ errorAlert: true }))
  }

  async deleteFriend() {
    friendsApi
      .removeFriendship(this.state.id)
      .then(() => {
        this.setState({ deleteFriend: false })
        var filteredArray = this.props.total.filter((item) => {
          return item.username !== this.props.username
        })
        this.props.press(this.props.id, filteredArray, true)
      })
      .catch(() => this.setState({ errorAlert: true }))
  }

  render() {
    return (
      <View style={{ flexDirection: 'row', flex: 1 }}>
        <Image
          source={{
            uri: this.props.image,
          }}
          style={imgStyles.button}
        />
        <View
          style={{
            alignSelf: 'center',
            marginLeft: '1%',
            flex: 1,
          }}
        >
          <Text style={{ fontFamily: font, fontWeight: 'bold', fontSize: 15 }}>
            {this.props.name}
          </Text>
          <Text style={{ fontFamily: font, color: hex }}>{'@' + this.props.username}</Text>
        </View>
        {this.state.requested === 'Requested' && this.state.renderOption && (
          <View style={{ flexDirection: 'row', flex: 1, justifyContent: 'flex-end' }}>
            <Text style={[imgStyles.text, { color: '#777777' }]}>Request Sent</Text>
            <Icon
              style={[imgStyles.icon, { fontSize: 20, margin: '8%', color: '#777777' }]}
              name="hourglass-end"
            />
          </View>
        )}
        {this.state.requested === 'Add' && this.state.renderOption && (
          <View style={{ flexDirection: 'row', flex: 1, justifyContent: 'flex-end' }}>
            <Text style={[imgStyles.text, { color: 'black' }]}>Add Friend</Text>
            <Icon
              style={[imgStyles.icon, { fontSize: 25, margin: '8%', color: 'black' }]}
              onPress={() => this.addFriend()}
              name="plus-circle"
            />
          </View>
        )}
        {this.state.requested === 'Accepted' && this.state.renderOption && (
          <TouchableHighlight onPress={() => this.setState({ deleteFriend: true })}>
            <View style={{ flexDirection: 'row', flex: 1, justifyContent: 'flex-end' }}>
              <Text style={[imgStyles.text]}>Friends</Text>
              <Icon style={[imgStyles.icon, { fontSize: 20, margin: '8%' }]} name="heart" />
            </View>
          </TouchableHighlight>
        )}
        {this.state.requested === 'Pending Request' && this.state.renderOption && (
          <View style={{ flexDirection: 'row', flex: 1, justifyContent: 'flex-end' }}>
            <Text style={[imgStyles.text, { color: 'black' }]}>Pending Request</Text>
            <Icon
              style={[imgStyles.icon, { fontSize: 25, margin: '3%' }]}
              name="check-circle"
              onPress={() => this.acceptFriend()}
            />
            <Icon
              style={[imgStyles.icon, { fontSize: 25, margin: '3%', color: 'black' }]}
              name="times-circle"
              onPress={() => this.rejectFriend()}
            />
          </View>
        )}
        {this.state.errorAlert && (
          <Alert
            title="Error, please try again"
            button
            buttonText="Close"
            press={() => this.setState({ errorAlert: false })}
            cancel={() => this.setState({ errorAlert: false })}
          />
        )}
        {this.state.deleteFriend && (
          <Alert
            title="Are you sure?"
            body={'You are about to remove @' + this.props.username + ' as a friend'}
            button
            buttonText="Delete"
            press={() => this.deleteFriend()}
            cancel={() => this.setState({ deleteFriend: false })}
          />
        )}
        {this.state.deleteFriend && (
          <Alert
            title="Are you sure?"
            body={'You are about to remove @' + this.props.username + ' as a friend'}
            button
            buttonText="Delete"
            press={() => this.deleteFriend()}
            cancel={() => this.setState({ deleteFriend: false })}
          />
        )}
      </View>
    )
  }
}

SearchCard.propTypes = {
  requested: PropTypes.string,
  currentUser: PropTypes.string,
  username: PropTypes.string,
  id: PropTypes.string,
  name: PropTypes.string,
  image: PropTypes.string,
  total: PropTypes.array,
  press: PropTypes.func,
}
