import React from 'react'
import { Image, Text, TouchableHighlight, View } from 'react-native'
import { ID } from 'react-native-dotenv'
import Icon from 'react-native-vector-icons/FontAwesome'
import PropTypes from 'prop-types'
import AsyncStorage from '@react-native-async-storage/async-storage'
import Alert from '../modals/Alert.js'
import friendsApi from '../apis/friendsApi.js'
import imgStyles from '../../styles/cardImage.js'

const font = 'CircularStd-Book'
const hex = '#F15763'
var id = ''

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
    AsyncStorage.getItem(ID).then((res) => {
      id = res
    })
  }

  // accept friend request and modify card
  async acceptFriend() {
    friendsApi
      .acceptFriendRequest(id, this.state.id)
      .then(() => {
        this.setState({ isFriend: true })
      })
      .catch(() => this.setState({ errorAlert: true }))
  }

  // delete friend and modify view
  async deleteFriend() {
    friendsApi
      .removeFriendship(id, this.state.id)
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
      <View
        style={{
          flexDirection: 'row',
          flex: 1,
          justifyContent: 'space-between',
          marginRight: '5%',
          marginLeft: '5%',
          marginTop: '3%',
        }}
      >
        <View style={{ flexDirection: 'row' }}>
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
          <View
            style={{
              alignSelf: 'center',
              marginLeft: '7%',
            }}
          >
            <Text style={{ fontFamily: font, fontSize: 15 }}>{this.props.name}</Text>
            <Text style={{ fontFamily: font, color: hex }}>@{this.props.username}</Text>
          </View>
        </View>
        {this.state.isFriend && (
          <TouchableHighlight onPress={() => this.setState({ deleteFriend: true })}>
            <View style={{ flexDirection: 'row', flex: 1, alignItems: 'center' }}>
              <Text style={(imgStyles.text, { color: hex, marginRight: '5%' })}>Friends</Text>
              <Icon
                style={(imgStyles.icon, { marginLeft: '5%', color: hex, fontSize: 18 })}
                name="heart"
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
                width: '55%',
                marginLeft: '25%',
                alignSelf: 'center',
                flex: 0.5,
              }}
            >
              <Text
                style={[
                  {
                    color: this.state.pressed ? 'white' : 'black',
                    fontFamily: font,
                    alignSelf: 'center',
                    fontSize: 12,
                  },
                ]}
              >
                Confirm
              </Text>
            </TouchableHighlight>

            <TouchableHighlight
              underlayColor="black"
              onHideUnderlay={() => this.setState({ pressed: false })}
              onShowUnderlay={() => this.setState({ pressed: true })}
              onPress={() => {
                var filteredArray = this.props.total.filter((item) => {
                  return item.username !== this.props.username
                })
                this.props.press(this.props.id, filteredArray, false)
              }}
              style={{
                borderColor: 'black',
                borderRadius: 30,
                borderWidth: 2,
                height: '30%',
                width: '50%',
                marginLeft: '5%',
                marginRight: '5%',
                alignSelf: 'center',
                flex: 0.5,
              }}
            >
              <Text
                style={[
                  {
                    color: this.state.pressed ? 'white' : 'black',
                    fontFamily: font,
                    alignSelf: 'center',
                    fontSize: 12,
                  },
                ]}
              >
                Delete
              </Text>
            </TouchableHighlight>
          </View>
        )}
        {this.state.deleteFriend && (
          <Alert
            title={'Unfriend ' + this.props.name}
            body="If you change your mind, you'll have to send a friends request again."
            buttonAff="Unfriend"
            buttonNeg="Cancel"
            height="28%"
            twoButton
            press={() => this.deleteFriend()}
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

ProfileCard.propTypes = {
  friends: PropTypes.bool,
  id: PropTypes.string,
  total: PropTypes.array,
  username: PropTypes.string,
  press: PropTypes.func,
  name: PropTypes.string,
  image: PropTypes.string,
}
