import React from 'react'
import { Image, Text, View, TouchableHighlight } from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome'
import PropTypes from 'prop-types'
import friendsApi from '../apis/friendsApi.js'
import imgStyles from '../../styles/cardImage.js'
import AntDesign from 'react-native-vector-icons/AntDesign'

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
      renderOption: this.props.currentUser !== this.props.username,
    }
  }

  async acceptFriend() {
    friendsApi
      .acceptFriendRequest(this.props.id)
      .then(() => {
        this.setState({ requested: 'friends' })
      })
      .catch(() => this.props.showError())
  }

  async addFriend() {
    friendsApi
      .createFriendship(this.props.id)
      .then(() => {
        this.setState({ requested: 'requested' })
      })
      .catch(() => this.props.showError())
  }

  async rejectFriend() {
    friendsApi
      .removeFriendship(this.props.id)
      .then(() => {
        this.setState({ requested: 'add' })
      })
      .catch(() => this.props.showError())
  }

  async deleteFriend() {
    friendsApi
      .removeFriendship(this.props.id)
      .then(() => {
        this.props.showDelete()
        var filteredArray = this.props.total.filter((item) => {
          return item.username !== this.props.username
        })
        this.props.press(this.props.id, filteredArray, true)
      })
      .catch(() => this.props.showError())
  }

  render() {
    return (
      <View style={{ flexDirection: 'row', flex: 1, width: '85%', alignSelf: 'center' }}>
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
          <Text style={{ fontFamily: font, fontSize: 15 }}>{this.props.name}</Text>
          <Text style={{ fontFamily: font, color: hex }}>{'@' + this.props.username}</Text>
        </View>
        {this.state.requested === 'requested' && this.state.renderOption && (
          <View style={{ flexDirection: 'row', flex: 1, justifyContent: 'flex-end' }}>
            <Text style={[imgStyles.text, { color: '#777777' }]}>Request Sent</Text>
            <Icon
              style={[imgStyles.icon, { fontSize: 20, margin: '8%', color: '#777777' }]}
              name="hourglass-end"
            />
          </View>
        )}
        {this.state.requested === 'add' && this.state.renderOption && (
          <TouchableHighlight underlayColor="white" onPress={() => this.addFriend()}>
            <View style={{ flexDirection: 'row', flex: 1, justifyContent: 'flex-end' }}>
              <Text style={[imgStyles.text, { color: 'black' }]}>Add Friend</Text>
              <AntDesign
                style={[imgStyles.icon, { fontSize: 25, margin: '8%', color: 'black' }]}
                name="pluscircleo"
              />
            </View>
          </TouchableHighlight>
        )}
        {this.state.requested === 'friends' && this.state.renderOption && (
          <TouchableHighlight
            underlayColor="white"
            onPress={() => {
              this.props.showDelete()
              this.props.deleteError()
            }}
          >
            <View style={{ flexDirection: 'row', flex: 1, justifyContent: 'flex-end' }}>
              <Text style={[imgStyles.text]}>Friends</Text>
              <Icon style={[imgStyles.icon, { fontSize: 20, margin: '8%' }]} name="heart" />
            </View>
          </TouchableHighlight>
        )}
        {this.state.requested === 'pending' && this.state.renderOption && (
          <View style={{ flexDirection: 'row', flex: 1, justifyContent: 'flex-end' }}>
            <Text style={[imgStyles.text, { color: 'black' }]}>Pending Request</Text>
            <Icon
              style={[imgStyles.icon, { fontSize: 25, margin: '3%' }]}
              name="check-circle"
              onPress={() => this.acceptFriend()}
            />
            <AntDesign
              style={[imgStyles.icon, { fontSize: 25, margin: '3%', color: 'black' }]}
              name="closecircleo"
              onPress={() => this.rejectFriend()}
            />
          </View>
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
