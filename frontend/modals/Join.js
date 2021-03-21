import React from 'react'
import { Modal, StyleSheet, Text, TouchableHighlight, View, TextInput } from 'react-native'
import PropTypes from 'prop-types'
import socket from '../apis/socket.js'
import AntDesign from 'react-native-vector-icons/AntDesign'
import modalStyles from '../../styles/modalStyles.js'
import normalize from '../../styles/normalize.js'
import screenStyles from '../../styles/screenStyles.js'

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
      disabled: false,
    }
  }

  handleAccept() {
    this.setState({ pressed: false, disabled: true })
    const code = this.state.code
    this.setState({ code: '' })
    socket.joinRoom(code)
    this.props.cancel()
    this.setState({ disabled: false })
  }

  handleCancel() {
    this.props.cancel()
  }

  evaluatePin(code) {
    this.setState({ code: code, invalid: false })
    if (code.length === 6) this.setState({ isValid: true })
    else this.setState({ isValid: false })
  }

  render() {
    return (
      <View>
        <Modal transparent animationType="none" visible={this.props.visible}>
          <View style={[modalStyles.modal, styles.modalContainer]}>
            <View style={modalStyles.topRightIcon}>
              <AntDesign
                name="closecircleo"
                style={modalStyles.icon}
                onPress={() => this.props.onPress()}
              />
            </View>
            <View style={modalStyles.modalContent}>
              <View style={styles.inputContainer}>
                <Text style={[screenStyles.text, styles.text]}>Group PIN:</Text>
                <TextInput
                  style={[screenStyles.text, screenStyles.input, styles.textInput]}
                  placeholderTextColor="#9F9F9F"
                  textAlign="left"
                  placeholder="e.g. A12345"
                  backgroundColor="#E0E0E0"
                  underlineColorAndroid="transparent"
                  //change max length accordingly to avoid overflow
                  maxLength={6}
                  onChangeText={(code) => {
                    this.evaluatePin(code)
                  }}
                  value={this.state.code}
                />
              </View>
              {!this.state.invalid && <Text style={styles.alignCenter}> </Text>}
              {this.state.invalid && (
                <Text style={styles.alignCenter}>Sorry, PIN is invalid or expired</Text>
              )}
              {this.state.isValid && (
                <TouchableHighlight
                  underlayColor={screenStyles.hex.color}
                  disabled={this.state.disabled}
                  onHideUnderlay={() => this.setState({ pressed: false })}
                  onShowUnderlay={() => this.setState({ pressed: true })}
                  onPress={() => this.handleAccept()}
                  style={modalStyles.button}
                >
                  <Text
                    style={[
                      modalStyles.text,
                      { color: this.state.pressed ? 'white' : screenStyles.hex.color },
                    ]}
                  >
                    Join
                  </Text>
                </TouchableHighlight>
              )}
              {!this.state.isValid && (
                <TouchableHighlight
                  onPress={() => this.setState({ invalid: true })}
                  style={[modalStyles.button, styles.bgHex]}
                >
                  <Text style={[modalStyles.text, styles.white]}>Join</Text>
                </TouchableHighlight>
              )}
            </View>
          </View>
        </Modal>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 0,
    height: 180,
    borderRadius: 15,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: '-10%',
  },
  text: {
    fontSize: normalize(20),
    marginRight: '10%',
    marginLeft: '10%',
  },
  textInput: {
    fontSize: normalize(18),
    borderRadius: 5,
    paddingLeft: '4%',
    paddingRight: '4%',
    paddingTop: '2%',
    paddingBottom: '2%',
    textAlignVertical: 'center',
    color: 'black',
  },
  alignCenter: {
    textAlign: 'center',
  },
  bgHex: {
    backgroundColor: screenStyles.hex.color,
  },
  white: {
    color: 'white',
  },
})

Join.propTypes = {
  username: PropTypes.string,
  image: PropTypes.string,
  cancel: PropTypes.func,
  onPress: PropTypes.func,
  name: PropTypes.string,
  visible: PropTypes.bool,
}
