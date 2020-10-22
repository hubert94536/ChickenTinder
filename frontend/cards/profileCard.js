import React from 'react'
import { Image, Text, TouchableHighlight, View } from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome'
import PropTypes from 'prop-types'
import Alert from '../modals/alert.js'
import friendsApi from '../apis/friendsApi.js'
import imgStyles from '../../styles/cardImage.js'

const hex = '#F25763'
const font = 'CircularStd-Medium'

export default class ProfileCard extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      isFriend: this.props.friends,
      id: this.props.id,
      pressed: false,
      errorAlert: false,
      deleteFriend: false,
    }
  }

  // accept friend request and modify card
  async acceptFriend () {
    friendsApi
      .acceptFriendRequest(this.state.id)
      .then(() => {
        this.setState({ isFriend: true })
      })
      .catch((error) => this.setState({ errorAlert: true }))
  }

  // delete friend and modify view
  async deleteFriend () {
    friendsApi
      .removeFriendship(this.state.id)
      .then(() => {
        this.setState({ deleteFriend: false })
        var filteredArray = this.props.total.filter((item) => {
          return item.username !== this.props.username
        })
        this.props.press(this.props.id, filteredArray, true)
      })
      .catch((error) => this.setState({ errorAlert: true }))
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
          <Text style={{ fontFamily: font }}>@{this.props.username}</Text>
        </View>
        {this.state.isFriend && (
          <TouchableHighlight onPress={() => this.setState({ deleteFriend: true })}>
            <View style={{ flexDirection: 'row', flex: 1 }}>
              <Text
                style={imgStyles.text, { marginLeft: '25%' }}
              >
                Friends
              </Text>
              <Icon
                style={imgStyles.icon, { marginLeft: '5%' }}
                name="check-circle"
              />
            </View>
          </TouchableHighlight>
        )}
        {!this.state.isFriend && (
          <View style={{ flex: 1, flexDirection: 'row' }}>
            <TouchableHighlight
              underlayColor="black"
              onHideUnderlay={() => this.setState({ pressed: false })}
              onShowUnderlay={() => this.setState({ pressed: true })}
              onPress={() => this.acceptFriend()}
              style={{
                borderColor: 'black',
                borderRadius: 30,
                borderWidth: 2,
                height: '30%',
                width: '50%',
                marginLeft: '25%',
                alignSelf: 'center',
              }}
            >
              <Text
                style={[imgStyles.text, {color: this.state.pressed ? 'white' : 'black'}]}
              >
                Accept
              </Text>
            </TouchableHighlight>
            <Icon
              style={[imgStyles.icon, { margin: '5%' }]}
              name="times-circle"
              onPress={() => {
                var filteredArray = this.props.total.filter((item) => {
                  return item.username !== this.props.username
                })
                this.props.press(this.props.id, filteredArray, false)
              }}
            />
          </View>
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
        {this.state.errorAlert && (
          <Alert
            title="Error, please try again"
            button
            buttonText="Close"
            press={() => this.setState({ errorAlert: false })}
            cancel={() => this.setState({ errorAlert: false })}
          />
        )}
      </View>
    )
  }
}

ProfileCard.propTypes = {
  isFriends: PropTypes.bool,
  id: PropTypes.string,
  total: PropTypes.array,
  username: PropTypes.string,
  press: PropTypes.func,
  name: PropTypes.string,
  image: PropTypes.string,
}
