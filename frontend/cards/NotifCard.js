// import React from 'react'
// import { Image, Text, TouchableHighlight, View } from 'react-native'
// import Icon from 'react-native-vector-icons/FontAwesome'
// import PropTypes from 'prop-types'
// import Alert from '../modals/Alert.js'
// import friendsApi from '../apis/friendsApi.js'
// import imgStyles from '../../styles/cardImage.js'

// const font = 'CircularStd-Medium'

// export default class NotifCard extends React.Component {
//   constructor(props) {
//     super(props)
//     this.state = {
//       id: this.props.id,
//       pressed: false,
//       errorAlert: false,
//     }
//   }

//   // accept friend request and modify card
//   async acceptNotif() {
//     // friendsApi
//     //   .acceptFriendRequest(this.state.id)
//     //   .then(() => {
//     //     this.setState({ isFriend: true })
//     //   })
//     //   .catch(() => this.setState({ errorAlert: true }))
//   }

//   // delete friend and modify view
//   async deleteNotif() {
//     // friendsApi
//     //   .removeFriendship(this.state.id)
//     //   .then(() => {
//     //     this.setState({ deleteFriend: false })
//     //     var filteredArray = this.props.total.filter((item) => {
//     //       return item.username !== this.props.username
//     //     })
//     //     this.props.press(this.props.id, filteredArray, true)
//     //   })
//     //   .catch(() => this.setState({ errorAlert: true }))
//   }

//   render() {
//     return (
//       <View style={{ flexDirection: 'row', flex: 1 }}>

//         <Image
//           source={{
//             uri: this.props.image,
//           }}
//           style={imgStyles.button}
//         />
//         <View
//           style={{
//             alignSelf: 'center',
//             marginLeft: '1%',
//             flex: 0.8,
//           }}
//         ></View>

//           <Text style={{ fontFamily: font, fontWeight: 'bold', fontSize: 15, alignSelf: "flex-start"}}>
//             {this.props.name} has invited you to join a group
//           </Text>

//       </View>
//     )
//   }
// }

// NotifCard.propTypes = {
//   id: PropTypes.string,
//   total: PropTypes.array,
//   username: PropTypes.string,
//   press: PropTypes.func,
//   name: PropTypes.string,
//   type: PropTypes.string
// }

import React from 'react'
import { Image, Text, TouchableHighlight, View } from 'react-native'
import { ID } from 'react-native-dotenv'
import Icon from 'react-native-vector-icons/FontAwesome'
import PropTypes from 'prop-types'
import AsyncStorage from '@react-native-community/async-storage'
import friendsApi from '../apis/friendsApi.js'
import imgStyles from '../../styles/cardImage.js'
import Swipeout from 'react-native-swipeout'

const font = 'CircularStd-Medium'
var id = ''

export default class NotifCard extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      isFriend: this.props.friends,
      id: this.props.id,
      confirmPressed: false,
      deletePressed: false,
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
      .catch(() => this.props.showError())
  }

  // delete friend and modify view
  async deleteFriend() {
    friendsApi
      .removeFriendship(id, this.state.id)
      .then(() => {
        this.props.removeDelete()
        var filteredArray = this.props.total.filter((item) => {
          return item.username !== this.props.username
        })
        this.props.press(this.props.id, filteredArray, true)
      })
      .catch(() => this.props.showError())
  }

  render() {
    let swipeBtns = [
      {
        text: 'Delete',
        backgroundColor: 'red',
        underlayColor: 'rgba(0, 0, 0, 1, 0.6)',
        onPress: () => {},
      },
    ]

    return (
      <Swipeout right={swipeBtns} autoClose="true" backgroundColor="transparent">
        <View
          style={{
            flexDirection: 'row',
            flex: 1,
            marginVertical: '1.5%',
            marginHorizontal: '5%',
            backgroundColor: '#E5E5E5',
            borderRadius: 5,
            paddingVertical: '1.5%',
          }}
        >
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
              flex: 0.9,
            }}
          >
            {this.props.type == 'Invite' && (
              <Text style={{ fontFamily: font, fontSize: 15 }}>
                {this.props.name} has invited you to a group!
              </Text>
            )}

            {this.props.type == 'Request' && (
              <Text style={{ fontFamily: font, fontSize: 15 }}>{this.props.name}</Text>
            )}

            <Text style={{ fontFamily: font, color: '#F15763' }}>@{this.props.username}</Text>
          </View>

          {this.props.type == 'Invite' && (
            <View style={{ flexDirection: 'row', marginLeft: '3%' }}>
              <Icon style={[imgStyles.icon, { fontSize: 20 }]} name="chevron-right" />
            </View>
          )}

          {this.props.type == 'Request' && (
            <View style={{ flex: 1, flexDirection: 'row' }}>
              <TouchableHighlight
                underlayColor="#E5E5E5"
                onHideUnderlay={() => this.setState({ confirmPressed: false })}
                onShowUnderlay={() => this.setState({ confirmPressed: true })}
                onPress={() => this.acceptFriend()}
                style={{
                  borderColor: '#F15763',
                  backgroundColor: '#F15763',
                  borderRadius: 30,
                  borderWidth: 2,
                  height: '40%',
                  width: '55%',
                  marginLeft: '25%',
                  alignSelf: 'center',
                  flex: 0.5,
                }}
              >
                <Text
                  style={[
                    {
                      color: this.state.confirmPressed ? '#F15763' : 'white',
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
                onHideUnderlay={() => this.setState({ deletePressed: false })}
                onShowUnderlay={() => this.setState({ deletePressed: true })}
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
                  height: '40%',
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
                      color: this.state.deletePressed ? 'white' : 'black',
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
        </View>
      </Swipeout>
    )
  }
}

NotifCard.propTypes = {
  friends: PropTypes.bool,
  id: PropTypes.string,
  total: PropTypes.array,
  type: PropTypes.string,
  username: PropTypes.string,
  press: PropTypes.func,
  name: PropTypes.string,
  image: PropTypes.string,
}
