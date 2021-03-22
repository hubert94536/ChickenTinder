import PropTypes from 'prop-types'
import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { NAME, USERNAME, PHOTO, EMAIL, PHONE } from 'react-native-dotenv'
import AsyncStorage from '@react-native-async-storage/async-storage'
import friendsApi from '../apis/friendsApi'
import global from '../../global.js'
import { changeFriends, changeName, changeUsername, changeImage } from '../redux/Actions.js'
import socket from '../apis/socket.js'

/* Renderless Component to fetch user's info from AsyncStorage and set in Redux/Globals */

class UserInfo extends React.Component {
  constructor(props) {
    super(props)
  }

  async componentDidMount() {
    socket.connect()
    let res = await AsyncStorage.multiGet([USERNAME, NAME, PHOTO, EMAIL, PHONE])
    this.props.changeUsername(res[0][1])
    this.props.changeName(res[1][1])
    this.props.changeImage(res[2][1])
    global.email = res[3][1]
    global.phone = res[4][1]
    const friends = await friendsApi.getFriends()
    this.props.changeFriends(friends.friendList)
  }

  render() {
    return null
  }
}

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      changeFriends,
      changeName,
      changeUsername,
      changeImage,
    },
    dispatch,
  )

export default connect(null, mapDispatchToProps)(UserInfo)

UserInfo.propTypes = {
  changeFriends: PropTypes.func,
  changeImage: PropTypes.func,
  changeName: PropTypes.func,
  changeUsername: PropTypes.func,
}
