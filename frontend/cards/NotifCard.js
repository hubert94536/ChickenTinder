import React from 'react'
import { Image, StyleSheet, Text, TouchableWithoutFeedback, View } from 'react-native'
import CheckBox from '@react-native-community/checkbox'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import {
  setDisable,
  hideDisable,
  setHold,
  showError,
  showRefresh,
  removeFriend,
  removeNotif,
  acceptFriend,
  updateNotif,
} from '../redux/Actions.js'
import AntDesign from 'react-native-vector-icons/AntDesign'
import Icon from 'react-native-vector-icons/FontAwesome'
import PropTypes from 'prop-types'
import colors from '../../styles/colors.js'
import friendsApi from '../apis/friendsApi.js'
import imgStyles from '../../styles/cardImage.js'
import normalize from '../../styles/normalize.js'
import notificationsApi from '../apis/notificationsApi.js'
import socket from '../apis/socket.js'

class NotifCard extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      hold: false,
      selected: false,
      disable: false,
    }
  }

  // accept friend request and modify card
  async acceptFriend() {
    this.setState({ disable: true })
    friendsApi
      .acceptFriendRequest(this.props.uid)
      .then(() => {
        this.props.acceptFriend(this.props.uid)
        this.props.updateNotif(this.props.id, 'friends')
        this.setState({ disable: false })
      })
      .catch(() => {
        this.props.showError()
        this.setState({ disable: false })
      })
  }

  // delete friend and modify view
  async deleteFriend() {
    this.setState({ disable: true })
    friendsApi
      .removeFriendship(this.props.uid)
      .then(() => {
        notificationsApi.removeNotif(this.props.id).catch(() => {
          this.props.showError()
        })
        this.props.removeFriend(this.props.uid)
        this.props.removeNotif([this.props.id])
        this.setState({ disable: false })
      })
      .catch(() => {
        this.props.showError()
        this.setState({ disable: false })
      })
  }

  // toggle delete view
  handleDelete() {
    this.props.setHold()
  }

  handleClick() {
    if (this.props.type === 'invite') {
      this.props.setDisable()
      this.props.showRefresh()
      socket.joinRoom(this.props.content)
      notificationsApi.removeNotif(this.props.id).catch(() => {
        this.props.showError()
      })
      this.props.removeNotif([this.props.id])
    }
  }

  modifyList() {
    this.setState({ selected: this.state.selected ? false : true })
    this.props.deleteNotif(this.state.selected, this.props.id)
  }

  // deselect when hold to delete is cancelled
  componentDidUpdate() {
    if (!this.props.hold && this.state.selected) this.setState({ selected: false })
  }

  render() {
    return (
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        {this.props.hold && (
          <CheckBox
            onChange={() => this.modifyList()}
            value={this.state.selected}
            tintColors={{ true: colors.hex, false: colors.gray }}
            style={{ marginLeft: '5%', marginRight: '-2%' }}
          />
        )}
        <TouchableWithoutFeedback
          onPress={() => this.handleClick()}
          disabled={this.props.disable && this.state.disable}
          onLongPress={() => this.handleDelete()}
        >
          <View style={styles.container}>
            <Image
              source={{ uri: Image.resolveAssetSource(this.props.image).uri }}
              style={imgStyles.button}
            />
            <View style={styles.notif}>
              {this.props.type == 'invite' && (
                <Text style={[imgStyles.bookFont, styles.text]}>
                  {this.props.name} invites you to a group!
                </Text>
              )}
              {this.props.type == 'accepted' && (
                <Text style={[imgStyles.bookFont, styles.text]}>
                  {this.props.name} accepted your request!
                </Text>
              )}

              {this.props.type == 'friends' && (
                <Text style={[imgStyles.bookFont, styles.text]}>
                  {this.props.name} is friends with you!
                </Text>
              )}

              {this.props.type == 'pending' && (
                <Text style={[imgStyles.bookFont, styles.text]}>
                  {this.props.name} requested you!
                </Text>
              )}

              <Text style={[imgStyles.bookFont, styles.username]}>@{this.props.username}</Text>
            </View>

            {this.props.type == 'invite' && (
              <View style={styles.invited}>
                <Icon style={[imgStyles.icon, styles.icon]} name="chevron-right" />
              </View>
            )}

            {this.props.type == 'pending' && !this.props.hold && (
              <View style={styles.request}>
                <Icon
                  style={[imgStyles.icon, styles.pend]}
                  name="check-circle"
                  onPress={() => this.acceptFriend()}
                />
                <AntDesign
                  style={[imgStyles.icon, styles.pend, styles.black]}
                  name="closecircleo"
                  onPress={() => this.deleteFriend()}
                />
              </View>
            )}
          </View>
        </TouchableWithoutFeedback>
      </View>
    )
  }
}

const mapStateToProps = (state) => {
  const { disable } = state
  const { hold } = state
  return { disable, hold }
}

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      setDisable,
      hideDisable,
      setHold,
      showError,
      showRefresh,
      removeFriend,
      removeNotif,
      acceptFriend,
      updateNotif,
    },
    dispatch,
  )

export default connect(mapStateToProps, mapDispatchToProps)(NotifCard)

NotifCard.propTypes = {
  uid: PropTypes.string,
  id: PropTypes.string,
  total: PropTypes.array,
  type: PropTypes.string,
  content: PropTypes.string,
  username: PropTypes.string,
  name: PropTypes.string,
  image: PropTypes.string,
  showError: PropTypes.func,
  setDisable: PropTypes.func,
  hideDisable: PropTypes.func,
  showRefresh: PropTypes.func,
  disable: PropTypes.bool,
  hold: PropTypes.bool,
  setHold: PropTypes.func,
  deleteNotif: PropTypes.func,
  removeFriend: PropTypes.func,
  removeNotif: PropTypes.func,
  acceptFriend: PropTypes.func,
  updateNotif: PropTypes.func,
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flex: 1,
    marginVertical: '1.5%',
    marginHorizontal: '5%',
    backgroundColor: '#F1F1F1',
    borderRadius: 5,
    paddingVertical: '1%',
    paddingLeft: '2%',
  },
  notif: {
    alignSelf: 'center',
    marginLeft: '1%',
    flex: 0.9,
  },
  text: { fontSize: normalize(15) },
  username: { color: colors.hex },
  invited: { flexDirection: 'row', marginLeft: '3%' },
  icon: { fontSize: normalize(20) },
  delete: { flexDirection: 'row', alignItems: 'center' },
  general: { flex: 1, flexDirection: 'row' },
  requested: {
    borderColor: colors.hex,
    backgroundColor: colors.hex,
    borderRadius: 30,
    borderWidth: 2,
    height: '40%',
    width: '55%',
    marginLeft: '25%',
    alignSelf: 'center',
    flex: 0.5,
  },
  confirmText: {
    color: 'white',
    alignSelf: 'center',
    fontSize: normalize(12),
  },
  confirmTextPressed: {
    color: colors.hex,
    alignSelf: 'center',
    fontSize: normalize(12),
  },
  hexButton: {
    backgroundColor: colors.hex,
  },
  blackButton: {
    borderColor: 'black',
    borderRadius: 30,
    borderWidth: 2,
    height: '40%',
    marginLeft: '5%',
    alignSelf: 'center',
  },
  deleteText: {
    color: 'black',
    alignSelf: 'center',
    fontSize: normalize(12),
  },
  deleteTextPressed: {
    color: 'white',
    alignSelf: 'center',
    fontSize: normalize(12),
  },
  black: { color: 'black' },
  pend: { fontSize: normalize(25), marginHorizontal: '5%' },
  request: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
})
