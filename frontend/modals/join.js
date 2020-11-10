import React from 'react'
import { Image, Modal, StyleSheet, Text, TouchableHighlight, View } from 'react-native'
import { BlurView } from '@react-native-community/blur'
import Icon from 'react-native-vector-icons/FontAwesome'
import PropTypes from 'prop-types'
import socket from '../apis/socket.js'
import modalStyles from '../../styles/modalStyles.js'
import { TextInput } from 'react-native-paper'
import screenStyles from '../../styles/screenStyles.js'

const hex = '#F15763'
const font = 'CircularStd-Medium'
//  props are name, image url, and functions for cancel and go
// invite alert

export default class Join extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      pressed: false,
      code: '',
      isValid: false,
      invalid: false,
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

  evaluatePin(code) {
    this.setState({ code: code, invalid: false })
    if (code.length === 6) this.setState({ isValid: true })
    else this.setState({ isValid: false })
  }

  render() {
    return (
<<<<<<< HEAD
      <View style={{ position: 'absolute' }}>
        <Modal transparent animationType="none">
          <View style={[modalStyles.modal, { height: 180 }]}>
=======
      <View>
        <Modal transparent animationType="none">
          <View style={[modalStyles.modal, {flex: 0, height: 180, borderRadius: 15}]}>
>>>>>>> 8522c47d83d5811d63c3936d16b94aec8a8de1d6
            <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
              <Icon
                name="times-circle"
                style={modalStyles.icon}
                onPress={() => this.props.onPress()}
              />
            </View>
            <View
              style={{
                flex: 1,
                justifyContent: 'space-evenly',
              }}
            >
<<<<<<< HEAD
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-evenly',
                  alignItems: 'center',
                }}
              >
                <Text style={[screenStyles.text, { fontSize: 20 }]}>Group PIN:</Text>
=======
              <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems:'center' }}>
                <Text style={[screenStyles.text, {fontSize: 20, margin: '2%'}]}>Group PIN:</Text>
>>>>>>> 8522c47d83d5811d63c3936d16b94aec8a8de1d6
                <TextInput
                  style={
                    ([screenStyles.input],
                    { height: 30, fontSize: 20, textAlignVertical: 'center' })
                  }
                  placeholderTextColor="#999999"
                  textAlign="left"
                  placeholder="e.g. A12345"
                  onChangeText={(code) => {
                    this.evaluatePin(code)
                  }}
                  value={this.state.code}
                />
              </View>
<<<<<<< HEAD
              {this.state.invalid && (
                <Text style={{ textAlign: 'center' }}>Sorry, PIN is invalid or expired</Text>
              )}
              {this.state.isValid && (
=======
              {!this.state.invalid && <Text style={{textAlign:'center'}}> </Text>}
              {this.state.invalid && <Text style={{textAlign:'center'}}>Sorry, PIN is invalid or expired</Text>}
              {this.state.isValid && 
>>>>>>> 8522c47d83d5811d63c3936d16b94aec8a8de1d6
                <TouchableHighlight
                  underlayColor={hex}
                  onHideUnderlay={() => this.setState({ pressed: false })}
                  onShowUnderlay={() => this.setState({ pressed: true })}
                  onPress={() => this.handleAccept()}
                  style={modalStyles.button}
                >
                  <Text
                    style={[
                      modalStyles.text,
                      this.state.pressed ? { color: 'white' } : { color: hex },
                    ]}
                  >
                    Join Group
                  </Text>
                </TouchableHighlight>
              )}
              {!this.state.isValid && (
                <TouchableHighlight
                  onPress={() => this.setState({ invalid: true })}
                  style={[
                    modalStyles.button,
                    { backgroundColor: '#999999', borderColor: '#999999' },
                  ]}
                >
                  <Text style={[modalStyles.text, { color: 'white' }]}>Join Group</Text>
                </TouchableHighlight>
              )}
            </View>
          </View>
        </Modal>
      </View>
    )
  }
}

Join.propTypes = {
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
})
