import React from 'react'
import {
  Image,
  StyleSheet,
  Text,
  TouchableHighlight,
  TouchableWithoutFeedback,
  View,
} from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome'
import PropTypes from 'prop-types'
import colors from '../../styles/colors.js'
import friendsApi from '../apis/friendsApi.js'
import imgStyles from '../../styles/cardImage.js'
import normalize from '../../styles/normalize.js'

export default class NotifCard extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      isFriend: this.props.friends,
      uid: this.props.uid,
      confirmPressed: false,
      deletePressed: false,
      trash: false,
    }
  }

  // accept friend request and modify card
  async acceptFriend() {
    friendsApi
      .acceptFriendRequest(this.state.uid)
      .then(() => {
        this.setState({ isFriend: true })
      })
      .catch(() => this.props.showError())
  }

  // delete friend and modify view
  async deleteFriend() {
    friendsApi
      .removeFriendship(this.state.uid)
      .then(() => {
        this.props.removeDelete()
        var filteredArray = this.props.total.filter((item) => {
          return item.username !== this.props.username
        })
        this.props.press(this.props.uid, filteredArray, true)
      })
      .catch(() => this.props.showError())
  }

  handleHold() {
    this.setState({ trash: true })
  }

  handleClick() { }

  pressTrash() {
    this.setState({ trash: false })
  }

  render() {
    return (
      <TouchableWithoutFeedback onPress={() => this.handleHold()}>
        <View style={styles.container}>
          <Image source={{ uri: Image.resolveAssetSource(this.props.image).uri }} style={imgStyles.button} />
          <View style={styles.notif}>
            {this.props.type == 'invited' && (
              <Text style={[imgStyles.font, styles.text]}>
                {this.props.name} has invited you to a group!
              </Text>
            )}

            {this.props.type == 'requested' && (
              <Text style={[imgStyles.font, styles.text]}>{this.props.name}</Text>
            )}

            <Text style={[imgStyles.font, styles.username]}>@{this.props.username}</Text>
          </View>

          {this.props.type == 'invited' && !this.state.trash && (
            <View style={styles.invited}>
              <Icon style={[imgStyles.icon, styles.icon]} name="chevron-right" />
            </View>
          )}

          {this.props.type == 'invited' && this.state.trash && (
            <View style={styles.trashInvite}>
              <Icon
                style={[imgStyles.icon, styles.trashWhite]}
                name="trash"
                onPress={() => this.pressTrash()}
              />
            </View>
          )}

          {this.props.type == 'requested' && (
            <View style={styles.general}>
              <TouchableHighlight
                underlayColor="#E5E5E5"
                onHideUnderlay={() => this.setState({ confirmPressed: false })}
                onShowUnderlay={() => this.setState({ confirmPressed: true })}
                onPress={() => this.acceptFriend()}
                style={styles.requested}
              >
                <Text
                  style={[
                    imgStyles.font,
                    this.state.confirmPressed ? styles.confirmTextPressed : styles.confirmText,
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
                  this.props.press(this.props.uid, filteredArray, false)
                }}
                style={styles.blackButton}
              >
                <Text
                  style={[
                    imgStyles.font,
                    this.state.deletePressed ? styles.deleteTextPressed : styles.deleteText,
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
  uid: PropTypes.string,
  total: PropTypes.array,
  type: PropTypes.string,
  username: PropTypes.string,
  press: PropTypes.func,
  name: PropTypes.string,
  image: PropTypes.string,
  showError: PropTypes.func,
  removeDelete: PropTypes.func,
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flex: 1,
    marginVertical: '1.5%',
    marginHorizontal: '5%',
    backgroundColor: '#E5E5E5',
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
  trashInvite: {
    flexDirection: 'row',
    marginLeft: '3%',
    backgroundColor: '#C82020',
    width: '15%',
    justifyContent: 'center',
    borderRadius: 10,
  },
  trashWhite: { fontSize: normalize(20), color: 'white' },
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
  blackButton: {
    borderColor: 'black',
    borderRadius: 30,
    borderWidth: 2,
    height: '40%',
    width: '50%',
    marginLeft: '5%',
    marginRight: '5%',
    alignSelf: 'center',
    flex: 0.5,
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
})
