import React from 'react'
import {
  Dimensions,
  Modal,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
  TextInput,
} from 'react-native'
import AntDesign from 'react-native-vector-icons/AntDesign'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { setDisable, hideDisable, showRefresh, hideRefresh } from '../redux/Actions.js'
import modalStyles from '../../styles/modalStyles.js'
import normalize from '../../styles/normalize.js'
import screenStyles from '../../styles/screenStyles.js'
import socket from '../apis/socket.js'

//  props are name, image url, and functions for cancel and go
// invite alert

const width = Dimensions.get('screen').width

class Join extends React.Component {
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
    this.props.setDisable()
    this.setState({ pressed: false })
    const code = this.state.code
    this.setState({ code: '' })
    socket.joinRoom(code)
    this.props.cancel()
    this.props.showRefresh()
    this.props.hideDisable()
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
                onPress={() => {
                  this.setState({ invalid: false }, () => this.props.onPress())
                }}
              />
            </View>
            <View style={modalStyles.modalContent}>
              <View style={styles.inputContainer}>
                <Text style={[screenStyles.text, styles.text]}>Group PIN:</Text>
                <TextInput
                  style={[screenStyles.input, styles.textInput, screenStyles.book]}
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
              <View style={styles.errorText}>
                <AntDesign
                  name="exclamationcircle"
                  style={[this.state.invalid ? styles.error : styles.noError]}
                />
                <Text
                  style={[screenStyles.book, this.state.invalid ? styles.error : styles.noError]}
                >
                  Invalid PIN. Please try again.
                </Text>
              </View>
              {this.state.isValid && (
                <TouchableHighlight
                  underlayColor={screenStyles.hex.color}
                  disabled={this.props.disable}
                  onHideUnderlay={() => this.setState({ pressed: false })}
                  onShowUnderlay={() => this.setState({ pressed: true })}
                  onPress={() => this.handleAccept()}
                  style={[modalStyles.button, styles.button]}
                >
                  <Text
                    style={[
                      modalStyles.text,
                      screenStyles.book,
                      styles.buttonText,
                      { color: this.state.pressed ? 'white' : screenStyles.hex.color },
                    ]}
                  >
                    Join Group
                  </Text>
                </TouchableHighlight>
              )}
              {!this.state.isValid && (
                <TouchableHighlight
                  onPress={() => this.setState({ invalid: true })}
                  style={[modalStyles.button, styles.bgHex]}
                >
                  <Text style={[modalStyles.text, styles.white, screenStyles.book]}>
                    Join Group
                  </Text>
                </TouchableHighlight>
              )}
            </View>
          </View>
        </Modal>
      </View>
    )
  }
}

const mapStateToProps = (state) => {
  const { disable } = state
  const { refresh } = state
  return { disable, refresh }
}

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      setDisable,
      hideDisable,
      showRefresh,
      hideRefresh,
    },
    dispatch,
  )
export default connect(mapStateToProps, mapDispatchToProps)(Join)

const styles = StyleSheet.create({
  modalContainer: {
    flex: 0,
    height: width * 0.5,
    borderRadius: 15,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: '-10%',
  },
  text: {
    fontSize: normalize(20),
    marginRight: '5%',
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
    height: width * 0.089,
  },
  noError: {
    marginLeft: '2%',
    color: 'white',
  },
  error: {
    marginLeft: '2%',
    color: 'red',
  },
  errorText: {
    marginTop: '10%',
    marginLeft: '10%',
    flexDirection: 'row',
    alignItems: 'center',
  },
  bgHex: {
    backgroundColor: screenStyles.hex.color,
    width: '45%',
  },
  button: {
    width: '45%',
  },
  buttonText: {
    fontSize: normalize(17),
    paddingTop: '8%',
    paddingBottom: '8%',
  },
  white: {
    color: 'white',
    fontSize: normalize(17),
    paddingTop: '8%',
    paddingBottom: '8%',
  },
})

Join.propTypes = {
  username: PropTypes.string,
  image: PropTypes.string,
  cancel: PropTypes.func,
  onPress: PropTypes.func,
  name: PropTypes.string,
  visible: PropTypes.bool,
  showRefresh: PropTypes.func,
  setDisable: PropTypes.func,
  hideDisable: PropTypes.func,
  disable: PropTypes.bool,
}
