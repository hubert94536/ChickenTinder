import React from 'react'
import { Modal, Text, TouchableHighlight, View } from 'react-native'
import PropTypes from 'prop-types'
import socket from '../apis/socket.js'
import { TextInput } from 'react-native-paper'
import AntDesign from 'react-native-vector-icons/AntDesign'
import modalStyles from '../../styles/modalStyles.js'
import screenStyles from '../../styles/screenStyles.js'

const hex = '#F15763'
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
    this.setState({ pressed: false })
    const code = this.state.code
    this.setState({ code: '' })
    // const { code } = this.state
    socket.joinRoom(code)
    this.props.cancel()
  }

  handleCancel() {
    const { username } = this.props
    socket.declineInvite(username)
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
          <View style={[modalStyles.modal, { flex: 0, height: 180, borderRadius: 15 }]}>
            <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
              <AntDesign
                name="closecircleo"
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
              <View
                style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}
              >
                <Text style={[screenStyles.text, { fontSize: 20, margin: '2%' }]}>Group PIN:</Text>
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
              {!this.state.invalid && <Text style={{ textAlign: 'center' }}> </Text>}
              {this.state.invalid && (
                <Text style={{ textAlign: 'center' }}>Sorry, PIN is invalid or expired</Text>
              )}
              {this.state.isValid && (
                <TouchableHighlight
                  underlayColor={hex}
                  onHideUnderlay={() => this.setState({ pressed: false })}
                  onShowUnderlay={() => this.setState({ pressed: true })}
                  onPress={() => this.handleAccept()}
                  style={modalStyles.button}
                >
                  <Text style={[modalStyles.text, { color: this.state.pressed ? 'white' : hex }]}>
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
  visible: PropTypes.bool,
}