import React from 'react'
import { Image, StyleSheet, Text, TouchableHighlight, View } from 'react-native'
import AntDesign from 'react-native-vector-icons/AntDesign'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { hideError, showError } from '../redux/Actions.js'
import Icon from 'react-native-vector-icons/FontAwesome'
import PropTypes from 'prop-types'
import Alert from '../modals/Alert.js'
import friendsApi from '../apis/friendsApi.js'
import imgStyles from '../../styles/cardImage.js'
import normalize from '../../styles/normalize.js'

class Card extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      deleteFriend: false,
      status: this.props.status,
      pressed: false,
    }
  }

  deleteFriend() {
    friendsApi
      .removeFriendship(this.props.uid)
      .then(() => {
        this.setState({ deleteFriend: false, status: 'add' })
        var filteredArray = this.props.total.filter((item) => {
          return item.username !== this.props.username
        })
        this.props.press(this.props.uid, filteredArray)
      })
      .catch(() => {
        this.props.showError()
        this.setState({ deleteFriend: false })
      })
  }

  acceptFriend() {
    friendsApi
      .acceptFriendRequest(this.props.uid)
      .then(() => {
        this.setState({ status: 'friends' })
      })
      .catch(() => this.props.showError())
  }

  addFriend() {
    friendsApi
      .createFriendship(this.props.uid)
      .then(() => {
        this.setState({ status: 'requested' })
      })
      .catch(() => this.props.showError())
  }

  rejectFriend() {
    friendsApi
      .removeFriendship(this.props.uid)
      .then(() => {
        this.setState({ status: 'add' })
      })
      .catch(() => this.props.showError())
  }

  render() {
    const renderOption = this.props.currentUser !== this.props.username
    return (
      <View style={styles.container}>
        <Image
          source={{ uri: Image.resolveAssetSource(this.props.image).uri }}
          style={imgStyles.button}
        />
        <View style={styles.info}>
          <Text style={[imgStyles.font, styles.name]}>{this.props.name}</Text>
          <Text style={[imgStyles.font, imgStyles.hex]}>@{this.props.username}</Text>
        </View>
        {/* if user is in a group */}
        {this.state.status === 'in group' && (
          <View style={imgStyles.card}>
            <Text style={[imgStyles.text, styles.text]}>Added!</Text>
          </View>
        )}
        {/* if user is not in a group */}
        {this.state.status === 'not added' && (
          <TouchableHighlight>
            <View style={imgStyles.card}>
              <Text style={[imgStyles.text, styles.topMargin]}>Add</Text>
              <AntDesign
                style={[imgStyles.icon, styles.addIcon]}
                name="pluscircleo"
                onPress={() => {
                  this.setState({ status: 'in group' })
                  this.props.press()
                }}
              />
            </View>
          </TouchableHighlight>
        )}
        {/* if user has requested to add them as a friend */}
        {this.state.status === 'requested' && renderOption && (
          <View style={imgStyles.card}>
            <Text style={[imgStyles.text, styles.grey]}>Request Sent</Text>
            <Icon style={[imgStyles.icon, styles.icon, styles.grey]} name="hourglass-end" />
          </View>
        )}
        {/* if they are not friends */}
        {this.state.status === 'add' && renderOption && (
          <TouchableHighlight underlayColor="white" onPress={() => this.addFriend()}>
            <View style={imgStyles.card}>
              <Text style={[imgStyles.text, styles.black]}>Add Friend</Text>
              <AntDesign style={[imgStyles.icon, styles.icon, styles.black]} name="pluscircleo" />
            </View>
          </TouchableHighlight>
        )}
        {/* if they are friends */}
        {this.state.status === 'friends' && renderOption && (
          <TouchableHighlight
            underlayColor="transparent"
            onPress={() => {
              this.props.hideError()
              this.setState({ deleteFriend: true })
            }}
          >
            <View style={imgStyles.card}>
              <Text style={[imgStyles.text]}>Friends</Text>
              <Icon style={[imgStyles.icon, styles.icon]} name="heart" />
            </View>
          </TouchableHighlight>
        )}
        {/* if they've requested you as a friend*/}
        {this.state.status === 'pending' && renderOption && (
          <View style={imgStyles.card}>
            <Text style={[imgStyles.text, styles.black]}>Accept Request</Text>
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
        {this.state.deleteFriend && (
          <Alert
            title={'Unfriend ' + this.props.name}
            body="If you change your mind, you'll have to send a friends request again."
            buttonAff="Unfriend"
            buttonNeg="Cancel"
            height="28%"
            twoButton
            blur
            press={() => {
              this.deleteFriend()
            }}
            cancel={() => this.setState({ deleteFriend: false })}
          />
        )}
        {this.props.error && (
          <Alert
            title="Error, please try again"
            buttonAff="Close"
            height="20%"
            blur
            press={() => this.props.hideError()}
            cancel={() => this.props.hideError()}
          />
        )}
      </View>
    )
  }
}

const mapStateToProps = (state) => {
  const { error } = state
  return { error }
}

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      showError,
      hideError,
    },
    dispatch,
  )

export default connect(mapStateToProps, mapDispatchToProps)(Card)

Card.propTypes = {
  currentUser: PropTypes.string,
  username: PropTypes.string,
  status: PropTypes.string,
  uid: PropTypes.string,
  total: PropTypes.array,
  image: PropTypes.string,
  press: PropTypes.func,
  name: PropTypes.string,
  showError: PropTypes.func,
  hideError: PropTypes.func,
  // error: PropTypes.bool,
}

const styles = StyleSheet.create({
  container: { flexDirection: 'row', flex: 1, width: '85%', alignSelf: 'center' },
  info: {
    alignSelf: 'center',
    marginLeft: '1%',
    flex: 1,
  },
  name: { fontWeight: 'bold', fontSize: normalize(15) },
  text: { color: '#6A6A6A', marginRight: '8%' },
  icon: { fontSize: normalize(20), margin: '8%' },
  pend: { fontSize: normalize(25), margin: '3%' },
  grey: { color: '#777777' },
  black: { color: 'black' },
  topMargin: { marginTop: '10%' },
  addIcon: { margin: '10%', marginTop: '20%', fontSize: normalize(25) },
})
