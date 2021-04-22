import React from 'react'
import { CheckBox, Image, StyleSheet, Text, TouchableWithoutFeedback, View } from 'react-native'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { setDisable, hideDisable, setHold } from '../redux/Actions.js'
import Icon from 'react-native-vector-icons/FontAwesome'
import PropTypes from 'prop-types'
import colors from '../../styles/colors.js'
import friendsApi from '../apis/friendsApi.js'
import imgStyles from '../../styles/cardImage.js'
import normalize from '../../styles/normalize.js'
import socket from '../apis/socket.js'
import AntDesign from 'react-native-vector-icons/AntDesign'

class NotifCard extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      // isFriend: this.props.friends,
      uid: this.props.uid,
      confirmPressed: false,
      deletePressed: false,
      hold: true,
      selected: false,
    }
  }

  // accept friend request and modify card
  async acceptFriend() {
    this.props.setDisable()
    friendsApi
      .acceptFriendRequest(this.state.uid)
      .then(() => {
        // this.setState({ isFriend: true })
        this.props.hideDisable()
      })
      .catch(() => {
        this.props.showError()
        this.props.hideDisable()
      })
  }

  // delete friend and modify view
  async deleteFriend() {
    this.props.setDisable()
    friendsApi
      .removeFriendship(this.props.uid)
      .then(() => {
        this.props.removeDelete()
        var filteredArray = this.props.total.filter((item) => {
          return item.username !== this.props.username
        })
        this.props.press(this.props.uid, filteredArray, true)
        this.props.hideDisable()
      })
      .catch(() => {
        this.props.showError()
        this.props.hideDisable()
      })
  }

  handleDelete() {
    this.props.setHold()
  }

  handleClick() {
    this.props.setDisable()
    if (this.props.type == 'invite') {
      socket.joinRoom(this.props.content)
    }
    this.props.hideDisable()
  }

  modifyList() {
    this.setState({ selected: this.state.selected ? false : true })
    this.props.deleteNotif(this.state.selected, this.props.index)
  }

  render() {
    return (
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        {this.props.hold && (
          <CheckBox
            onChange={() => this.modifyList()}
            value={this.state.selected}
            tintColors={{ true: colors.hex }}
          />
        )}
        <TouchableWithoutFeedback
          onPress={() => this.handleClick()}
          disabled={this.props.disable}
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
                  {this.props.name} has invited you to a group!
                </Text>
              )}
              {this.props.type == 'accepted' && !this.state.hold && (
                <Text style={[imgStyles.bookFont, styles.text]}>
                  {this.props.name} accepted your friend request!
                </Text>
              )}

              {this.props.type == 'friends' && !this.state.hold && (
                <Text style={[imgStyles.bookFont, styles.text]}>
                  {this.props.name} is friends with you!
                </Text>
              )}

              {this.props.type == 'pending' && !this.state.hold && (
                <Text style={[imgStyles.bookFont, styles.text]}>
                  {this.props.name} sent you a friend request!
                </Text>
              )}

              <Text style={[imgStyles.bookFont, styles.username]}>@{this.props.username}</Text>
            </View>

            {this.props.type == 'invite' && (
              <View style={styles.invited}>
                <Icon style={[imgStyles.icon, styles.icon]} name="chevron-right" />
              </View>
            )}

            {this.props.type == 'pending' && (
              <View style={styles.request}>
                <Icon
                  style={[imgStyles.icon, styles.pend]}
                  name="check-circle"
                  onPress={() => this.acceptFriend()}
                />
                <AntDesign
                  style={[imgStyles.icon, styles.pend, styles.black]}
                  name="closecircleo"
                  onPress={() => this.rejectFriend()}
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
    },
    dispatch,
  )

export default connect(mapStateToProps, mapDispatchToProps)(NotifCard)

NotifCard.propTypes = {
  friends: PropTypes.bool,
  uid: PropTypes.string,
  total: PropTypes.array,
  type: PropTypes.string,
  content: PropTypes.string,
  username: PropTypes.string,
  press: PropTypes.func,
  name: PropTypes.string,
  image: PropTypes.string,
  showError: PropTypes.func,
  removeDelete: PropTypes.func,
  setDisable: PropTypes.func,
  hideDisable: PropTypes.func,
  disable: PropTypes.bool,
  hold: PropTypes.bool,
  setHold: PropTypes.func,
  deleteNotif: PropTypes.func,
  index: PropTypes.number,
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flex: 1,
    marginVertical: '1.5%',
    marginHorizontal: '5%',
    backgroundColor: '#F1F1F1',
    borderRadius: 5,
    paddingVertical: '1.5%',
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
    // width: '50%',
    marginLeft: '5%',
    // marginRight: '5%',
    alignSelf: 'center',
    // flex: 0.5,
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
  pend: { fontSize: normalize(25), marginHorizontal: '3%' },
  request: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    // borderColor: 'black', borderWidth: 2
  },
})
