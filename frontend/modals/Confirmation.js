import React from 'react'
import {
  Dimensions,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableHighlight,
  View,
} from 'react-native'
import { bindActionCreators } from 'redux'
import { hideError, showError } from '../redux/Actions.js'
import { connect } from 'react-redux'
import AntDesign from 'react-native-vector-icons/AntDesign'
import PropTypes from 'prop-types'
import modalStyles from '../../styles/modalStyles.js'
import normalize from '../../styles/normalize.js'
import screenStyles from '../../styles/screenStyles.js'

const width = Dimensions.get('window').width

class Confirmation extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      code: '',
      pressed: false,
    }
  }

  // function called when main button is pressed
  handlePress() {
    this.props.verify(this.state.code)
  }

  render() {
    return (
      <View style={styles.main}>
        <Text />
        <Modal transparent animationType="none" visible={this.props.visible}>
          <View style={[modalStyles.modal, styles.modal]}>
            <View style={styles.titleContainer}>
              <Text style={[screenStyles.textBold, styles.titleText]}>Confirmation</Text>
              <AntDesign
                name="closecircleo"
                style={[screenStyles.text, styles.closeIcon]}
                onPress={() => this.props.close()}
              />
            </View>
            <View style={styles.bodyContainer}>
              <TextInput
                style={[screenStyles.text, screenStyles.input, styles.textInput]}
                keyboardType="numeric"
                onChangeText={(code) => {
                  this.setState({ code: code })
                }}
                maxLength={6}
                placeholder="Enter Code"
              />
            </View>
            <View style={modalStyles.justifyCenter}>
              <TouchableHighlight
                style={[screenStyles.medButton, styles.verifyButton]}
                underlayColor="white"
                onShowUnderlay={() => this.setState({ press: true })}
                onHideUnderlay={() => this.setState({ press: false })}
                onPress={() => this.handlePress()}
              >
                <Text
                  style={[
                    screenStyles.smallButtonText,
                    styles.verifyText,
                    this.state.press ? screenStyles.hex : styles.white,
                  ]}
                >
                  Verify
                </Text>
              </TouchableHighlight>
            </View>
          </View>
        </Modal>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  main: { position: 'absolute' },
  modal: {
    height: width * 0.4833,
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  titleText: {
    fontSize: normalize(20),
    marginLeft: '10%',
    marginTop: '10%',
    alignSelf: 'center',
  },
  closeIcon: {
    margin: '5%',
    fontSize: normalize(25),
  },
  bodyContainer: {
    justifyContent: 'space-between',
    marginHorizontal: '10%',
  },
  subTitle: {
    color: 'black',
    fontSize: normalize(18),
  },
  textInput: {
    marginTop: '3%',
    borderColor: '#E0E0E0',
    alignSelf: 'stretch',
    borderWidth: 0,
    borderBottomWidth: 1.5,
    paddingLeft: 10,
    color: '#6A6A6A',
    fontSize: normalize(17),
  },
  verifyButton: {
    backgroundColor: screenStyles.hex.color,
    borderColor: screenStyles.hex.color,
    marginTop: '3%',
    width: '40%',
  },
  verifyText: {
    paddingTop: '5%',
    paddingBottom: '5%',
    fontSize: normalize(19),
  },
  white: {
    color: 'white',
  },
})

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

export default connect(mapStateToProps, mapDispatchToProps)(Confirmation)

Confirmation.propTypes = {
  close: PropTypes.func,
  verify: PropTypes.func,
  visible: PropTypes.bool,
}
