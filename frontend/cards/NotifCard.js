// import React from 'react'
// import { Image, Text, TouchableHighlight, View } from 'react-native'
// import { ID } from 'react-native-dotenv'
// import Icon from 'react-native-vector-icons/FontAwesome'
// import PropTypes from 'prop-types'
// import AsyncStorage from '@react-native-community/async-storage'
// import friendsApi from '../apis/friendsApi.js'
// import imgStyles from '../../styles/cardImage.js'
// import Swipeout from 'react-native-swipeout'

// const font = 'CircularStd-Medium'
// var id = ''

// export default class NotifCard extends React.Component {
//   constructor(props) {
//     super(props)
//     this.state = {
//       isFriend: this.props.friends,
//       id: this.props.id,
//       confirmPressed: false,
//       deletePressed: false,
//     }
//     AsyncStorage.getItem(ID).then((res) => {
//       id = res
//     })
//   }

//   // accept friend request and modify card
//   async acceptFriend() {
//     friendsApi
//       .acceptFriendRequest(id, this.state.id)
//       .then(() => {
//         this.setState({ isFriend: true })
//       })
//       .catch(() => this.props.showError())
//   }

//   // delete friend and modify view
//   async deleteFriend() {
//     friendsApi
//       .removeFriendship(id, this.state.id)
//       .then(() => {
//         this.props.removeDelete()
//         var filteredArray = this.props.total.filter((item) => {
//           return item.username !== this.props.username
//         })
//         this.props.press(this.props.id, filteredArray, true)
//       })
//       .catch(() => this.props.showError())
//   }

//   render() {
//     let swipeBtns = [
//       {
//         text: 'Delete',
//         backgroundColor: 'red',
//         underlayColor: 'rgba(0, 0, 0, 1, 0.6)',
//         onPress: () => {},
//       },
//     ]

//     return (
//       <Swipeout right={swipeBtns} autoClose="true" backgroundColor="transparent">
//         <View
//           style={{
//             flexDirection: 'row',
//             flex: 1,
//             marginVertical: '1.5%',
//             marginHorizontal: '5%',
//             backgroundColor: '#E5E5E5',
//             borderRadius: 5,
//             paddingVertical: '1.5%',
//           }}
//         >
//           <Image
//             source={{
//               uri: this.props.image,
//             }}
//             style={imgStyles.button}
//           />
//           <View
//             style={{
//               alignSelf: 'center',
//               marginLeft: '1%',
//               flex: 0.9,
//             }}
//           >
//             {this.props.type == 'Invite' && (
//               <Text style={{ fontFamily: font, fontSize: 15 }}>
//                 {this.props.name} has invited you to a group!
//               </Text>
//             )}

//             {this.props.type == 'Request' && (
//               <Text style={{ fontFamily: font, fontSize: 15 }}>{this.props.name}</Text>
//             )}

//             <Text style={{ fontFamily: font, color: '#F15763' }}>@{this.props.username}</Text>
//           </View>

//           {this.props.type == 'Invite' && (
//             <View style={{ flexDirection: 'row', marginLeft: '3%' }}>
//               <Icon style={[imgStyles.icon, { fontSize: 20 }]} name="chevron-right" />
//             </View>
//           )}

//           {this.props.type == 'Request' && (
//             <View style={{ flex: 1, flexDirection: 'row' }}>
//               <TouchableHighlight
//                 underlayColor="#E5E5E5"
//                 onHideUnderlay={() => this.setState({ confirmPressed: false })}
//                 onShowUnderlay={() => this.setState({ confirmPressed: true })}
//                 onPress={() => this.acceptFriend()}
//                 style={{
//                   borderColor: '#F15763',
//                   backgroundColor: '#F15763',
//                   borderRadius: 30,
//                   borderWidth: 2,
//                   height: '40%',
//                   width: '55%',
//                   marginLeft: '25%',
//                   alignSelf: 'center',
//                   flex: 0.5,
//                 }}
//               >
//                 <Text
//                   style={[
//                     {
//                       color: this.state.confirmPressed ? '#F15763' : 'white',
//                       fontFamily: font,
//                       alignSelf: 'center',
//                       fontSize: 12,
//                     },
//                   ]}
//                 >
//                   Confirm
//                 </Text>
//               </TouchableHighlight>

//               <TouchableHighlight
//                 underlayColor="black"
//                 onHideUnderlay={() => this.setState({ deletePressed: false })}
//                 onShowUnderlay={() => this.setState({ deletePressed: true })}
//                 onPress={() => {
//                   var filteredArray = this.props.total.filter((item) => {
//                     return item.username !== this.props.username
//                   })
//                   this.props.press(this.props.id, filteredArray, false)
//                 }}
//                 style={{
//                   borderColor: 'black',
//                   borderRadius: 30,
//                   borderWidth: 2,
//                   height: '40%',
//                   width: '50%',
//                   marginLeft: '5%',
//                   marginRight: '5%',
//                   alignSelf: 'center',
//                   flex: 0.5,
//                 }}
//               >
//                 <Text
//                   style={[
//                     {
//                       color: this.state.deletePressed ? 'white' : 'black',
//                       fontFamily: font,
//                       alignSelf: 'center',
//                       fontSize: 12,
//                     },
//                   ]}
//                 >
//                   Delete
//                 </Text>
//               </TouchableHighlight>
//             </View>
//           )}
//         </View>
//       </Swipeout>
//     )
//   }
// }

// NotifCard.propTypes = {
//   friends: PropTypes.bool,
//   id: PropTypes.string,
//   total: PropTypes.array,
//   type: PropTypes.string,
//   username: PropTypes.string,
//   press: PropTypes.func,
//   name: PropTypes.string,
//   image: PropTypes.string,
// }
import React from 'react'
import { Image, Text, TouchableHighlight, TouchableWithoutFeedback, View } from 'react-native'
import { ID } from 'react-native-dotenv'
import Icon from 'react-native-vector-icons/FontAwesome'
import PropTypes from 'prop-types'
import AsyncStorage from '@react-native-async-storage/async-storage'
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
      trash: false,
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

  handleHold()
  {
    this.setState({trash: true})
    console.log("held")
  }

  handleClick()
  {

  }

  pressTrash()
  {
    this.setState({trash: false})
    console.log("Trash")

  }



  render() {

    return (
      <TouchableWithoutFeedback
      onPress={() => this.handleHold()}>
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
          {/* <Image
            source={{
              uri: this.props.image,
            }}
            style={imgStyles.button}
          /> */}

        {this.props.image.includes("file") || this.props.image.includes("http") ? (
          <Image
            source={{
              uri: this.props.image,
            }}
            style={imgStyles.button}
          />
          ) : (
            <Image source={this.props.image} style={imgStyles.button}/>
 
            )} 
 
          
          <View
            style={{
              alignSelf: 'center',
              marginLeft: '1%',
              flex: 0.9,
            }}
          >
            {this.props.type == 'invited' && (
              <Text style={{ fontFamily: font, fontSize: 15 }}>
                {this.props.name} has invited you to a group!
              </Text>
            )}

            {this.props.type == 'requested' && (
              <Text style={{ fontFamily: font, fontSize: 15 }}>{this.props.name}</Text>
            )}

            <Text style={{ fontFamily: font, color: '#F15763' }}>@{this.props.username}</Text>
          </View>

          {this.props.type == 'invited' && !this.state.trash &&(
            <View style={{ flexDirection: 'row', marginLeft: '3%' }}>
              <Icon style={[imgStyles.icon, { fontSize: 20, }]} name="chevron-right" />
            </View>
          )}

          {this.props.type == 'invited' && this.state.trash &&(
            <View style={{ flexDirection: 'row', marginLeft: '3%', backgroundColor: '#C82020', width: '15%', justifyContent: 'center', borderRadius: 10,}}>
              <Icon style={[imgStyles.icon, { fontSize: 20, color: 'white' }]} name="trash" 
              onPress={() => this.pressTrash()}/>
            </View>
          )}

          {this.props.type == 'requested' && (
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
        </TouchableWithoutFeedback>
      
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

