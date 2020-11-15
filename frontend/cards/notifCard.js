// import React from 'react'
// import { Image, Text, TouchableHighlight, View } from 'react-native'
// import Icon from 'react-native-vector-icons/FontAwesome'
// import PropTypes from 'prop-types'
// import Alert from '../modals/alert.js'
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
import Icon from 'react-native-vector-icons/FontAwesome'
import PropTypes from 'prop-types'
import Alert from '../modals/alert.js'
import friendsApi from '../apis/friendsApi.js'
import imgStyles from '../../styles/cardImage.js'

const font = 'CircularStd-Medium'

export default class NotifCard extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      isFriend: this.props.friends,
      id: this.props.id,
      confirmPressed: false,
      deletePressed: false,
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
      .catch(() => this.setState({ errorAlert: true }))
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
      .catch(() => this.setState({ errorAlert: true }))
  }

  render() {
    return (
      <View style={{ flexDirection: 'row', flex: 1, marginVertical: '1.5%', marginHorizontal: '5%', backgroundColor: '#E5E5E5', borderRadius: 5}}>
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
            flex: 0.8,
          }}
        >

        {this.props.type == "Invite" && (
          <Text style={{ fontFamily: font, fontSize: 15 }}>
          {this.props.name} has invited you to a group!
          </Text>
        )}

        {this.props.type == "Request" && (
          <Text style={{ fontFamily: font, fontSize: 15 }}>
          {this.props.name}
          </Text>
        )}
          
          <Text style={{ fontFamily: font, color:'#F15763' }}>@{this.props.username}</Text>
        </View>
        
        {this.props.type == "Request" && (
          <View style={{ flex: 1, flexDirection: 'row' }}>
            <TouchableHighlight
              underlayColor="#F15763"
              onHideUnderlay={() => this.setState({ confirmPressed: false })}
              onShowUnderlay={() => this.setState({ confirmPressed: true })}
              onPress={() => this.acceptFriend()}
              style={{
                borderColor: '#F15763',
                borderRadius: 30,
                borderWidth: 2,
                height: '30%',
                width: '55%',
                marginLeft: '25%',
                alignSelf: 'center',
                flex: 0.5
              }}
            >
              <Text style={[ { color: this.state.confirmPressed ? 'white' : '#F15763' , fontFamily:font, alignSelf: 'center', fontSize: 12}]}>
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
                height: '30%',
                width: '50%',
                marginLeft: '5%',
                marginRight: '5%',
                alignSelf: 'center',
                flex: 0.5
              }}
            >
              <Text style={[{ color: this.state.deletePressed ? 'white' : 'black' , fontFamily:font, alignSelf: 'center', fontSize: 12}]}>
                Delete
              </Text>
            </TouchableHighlight>
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

NotifCard.propTypes = {
  friends: PropTypes.bool,
  id: PropTypes.string,
  total: PropTypes.array,
  username: PropTypes.string,
  press: PropTypes.func,
  name: PropTypes.string,
  image: PropTypes.string,
}
