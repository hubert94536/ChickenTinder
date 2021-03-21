import React from 'react'
import { Image, Modal, StyleSheet, Text, TouchableHighlight, View } from 'react-native'
import { BlurView } from '@react-native-community/blur'
import Icon from 'react-native-vector-icons/FontAwesome'
import PropTypes from 'prop-types'
import modalStyles from '../../styles/modalStyles.js'
import normalize from '../../styles/normalize.js'
import screenStyles from '../../styles/screenStyles.js'
import socket from '../apis/socket.js'

//  props are name, image url, and functions for cancel and go
// invite alert

export default class Invite extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      pressed: false,
    }
  }

  handleAccept() {
    socket.joinRoom(this.props.username)
    this.props.cancel()
  }

  handleCancel() {
    socket.declineInvite(this.props.username)
    this.props.cancel()
  }

  render() {
    return (
      <View>
        <Text />
        <BlurView
          blurType="light"
          blurAmount={20}
          reducedTransparencyFallbackColor="white"
          style={modalStyles.blur}
        />
        <Modal transparent animationType="none">
          <View style={modalStyles.modal}>
            <View style={modalStyles.topRightIcon}>
              <Icon
                name="times-circle"
                style={modalStyles.icon}
                onPress={() => this.props.onPress()}
              />
            </View>
            <View style={modalStyles.modalContent}>
              <View style={styles.invite}>
                <Image source={{ uri: this.props.image }} style={styles.avatar} />
                <View>
                  <Text style={[screenStyles.text, styles.inviteText]}>{this.props.name}</Text>
                  <Text style={[screenStyles.text, styles.inviteText]}>invites you to join!</Text>
                </View>
              </View>
              <TouchableHighlight
                underlayColor={screenStyles.hex.color}
                onHideUnderlay={() => this.setState({ pressed: false })}
                onShowUnderlay={() => this.setState({ pressed: true })}
                onPress={() => this.handleAccept()}
                style={modalStyles.button}
              >
                <Text
                  style={[modalStyles.text, this.state.pressed ? styles.white : screenStyles.hex]}
                >
                  Go
                </Text>
              </TouchableHighlight>
            </View>
          </View>
        </Modal>
      </View>
    )
  }
}

Invite.propTypes = {
  username: PropTypes.string,
  image: PropTypes.string,
  cancel: PropTypes.func,
  onPress: PropTypes.func,
  name: PropTypes.string,
}

const styles = StyleSheet.create({
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 63,
    borderWidth: 4,
  },
  invite: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  inviteText: {
    fontSize: normalize(25),
  },
  white: {
    color: 'white',
  },
})
