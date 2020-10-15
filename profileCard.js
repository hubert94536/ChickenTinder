import React from 'react'
import { Image, Text, TouchableHighlight, View } from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome'
import Alert from './alert.js'
import friendsApi from './friendsApi.js'

const hex = '#F25763'
const font = 'CircularStd-Medium'

export default class Card extends React.Component {
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
  async acceptFriend() {
    friendsApi
      .acceptFriendRequest(this.state.id)
      .then(() => {
        this.setState({ isFriend: true })
      })
      .catch((error) => console.log(error))
  }

  // delete friend and modify view
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
      .catch((error) => console.log(error))
  }

  render() {
    return (
      <View style={{ flexDirection: 'row', flex: 1 }}>
        <Image
          source={{
            uri: this.props.image,
          }}
          style={{ borderRadius: 63, height: 60, width: 60, margin: '3%' }}
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
                style={{
                  fontFamily: font,
                  color: hex,
                  fontSize: 15,
                  alignSelf: 'center',
                  marginLeft: '25%',
                }}
              >
                Friends
              </Text>
              <Icon
                style={{
                  fontFamily: font,
                  color: hex,
                  fontSize: 35,
                  alignSelf: 'center',
                  marginLeft: '5%',
                }}
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
                style={{
                  fontFamily: font,
                  fontSize: 15,
                  textAlign: 'center',
                  color: this.state.pressed ? 'white' : 'black',
                }}
              >
                Accept
              </Text>
            </TouchableHighlight>
            <Icon
              style={{
                fontFamily: font,
                fontSize: 30,
                alignSelf: 'center',
                margin: '5%',
              }}
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
      </View>
    )
  }
}
