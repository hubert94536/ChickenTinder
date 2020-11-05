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
      id: this.props.id,
      pressed: false,
      errorAlert: false,
    }
  }

  // accept friend request and modify card
  async acceptNotif() {
    // friendsApi
    //   .acceptFriendRequest(this.state.id)
    //   .then(() => {
    //     this.setState({ isFriend: true })
    //   })
    //   .catch(() => this.setState({ errorAlert: true }))
  }

  // delete friend and modify view
  async deleteNotif() {
    // friendsApi
    //   .removeFriendship(this.state.id)
    //   .then(() => {
    //     this.setState({ deleteFriend: false })
    //     var filteredArray = this.props.total.filter((item) => {
    //       return item.username !== this.props.username
    //     })
    //     this.props.press(this.props.id, filteredArray, true)
    //   })
    //   .catch(() => this.setState({ errorAlert: true }))
  }

  render() {
    return (
      <View style={{ flexDirection: 'row', flex: 1 }}>
        
        {/* <View
          style={{
            alignSelf: 'center',
            marginLeft: '1%',
            flex: 1,
          }}
        >
          
        </View> */}
        {this.props.type === "Invite" && (
        <Text style={{ fontFamily: font, fontWeight: 'bold', fontSize: 15, marginLeft: '5%' , marginTop: '5%'}}>
            {this.props.name} has invited you to join a group
        </Text>
            
        //   <TouchableHighlight onPress={() => this.setState({ deleteFriend: true })}>
        //     <View style={{ flexDirection: 'row', flex: 1 }}>
        //       <Text style={(imgStyles.text, { marginLeft: '25%' })}>Friends</Text>
        //       <Icon style={(imgStyles.icon, { marginLeft: '5%' })} name="check-circle" />
        //     </View>
        //   </TouchableHighlight>
        )}
        {this.props.type === "Request" && (
        
        <Text style={{ fontFamily: font, fontWeight: 'bold', fontSize: 15, marginLeft: '5%', marginTop: '5%'}}>
            {this.props.name} has sent you a friend request
        </Text>
        //   <View style={{ flex: 1, flexDirection: 'row' }}>
        //     <TouchableHighlight
        //       underlayColor="black"
        //       onHideUnderlay={() => this.setState({ pressed: false })}
        //       onShowUnderlay={() => this.setState({ pressed: true })}
        //       onPress={() => this.acceptFriend()}
        //       style={{
        //         borderColor: 'black',
        //         borderRadius: 30,
        //         borderWidth: 2,
        //         height: '30%',
        //         width: '50%',
        //         marginLeft: '25%',
        //         alignSelf: 'center',
        //       }}
        //     >
        //       <Text style={[imgStyles.text, { color: this.state.pressed ? 'white' : 'black' }]}>
        //         Accept
        //       </Text>
        //     </TouchableHighlight>
        //     <Icon
        //       style={[imgStyles.icon, { margin: '5%' }]}
        //       name="times-circle"
        //       onPress={() => {
        //         var filteredArray = this.props.total.filter((item) => {
        //           return item.username !== this.props.username
        //         })
        //         this.props.press(this.props.id, filteredArray, false)
        //       }}
        //     />
        //   </View>
        )}

      </View>
    )
  }
}

NotifCard.propTypes = {
  id: PropTypes.string,
  total: PropTypes.array,
  username: PropTypes.string,
  press: PropTypes.func,
  name: PropTypes.string,
  type: PropTypes.string
}
