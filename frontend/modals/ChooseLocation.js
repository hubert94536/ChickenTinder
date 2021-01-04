import React, { Component } from 'react'
import {
  Dimensions,
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
  Modal,
  TextInput,
} from 'react-native'
import PropTypes from 'prop-types'
import modalStyles from '../../styles/modalStyles.js'
import normalize from '../../styles/normalize.js'
import screenStyles from '../../styles/screenStyles.js'
import AntDesign from 'react-native-vector-icons/AntDesign'
import { ZIP_ID, ZIP_TOKEN } from 'react-native-dotenv'

const height = Dimensions.get('window').height

const SmartyStreetsSDK = require('smartystreets-javascript-sdk')
const SmartyStreetsCore = SmartyStreetsSDK.core
const Lookup = SmartyStreetsSDK.usZipcode.Lookup

let clientBuilder = new SmartyStreetsCore.ClientBuilder(
  new SmartyStreetsCore.StaticCredentials(ZIP_ID, ZIP_TOKEN),
)
let client = clientBuilder.buildUsZipcodeClient()

export default class Location extends Component {
  constructor(props) {
    super(props)
    this.state = {
      zip: '',
      zipValid: true,
      //style of the button
      buttonPressed: false,
    }
  }

  validateZip() {
    //created Lookup for validating zip code
    let lookup = new Lookup()
    lookup.zipCode = this.state.zip

    client
      .send(lookup)
      .then((res) => {
        if (res.lookups[0].result[0].valid) this.handlePress()
        else this.setState({ zipValid: false })
      })
      .catch((err) => console.log(err))
  }
  // function called when main button is pressed
  handlePress() {
    this.props.press(this.state.zip)
  }

  //  function called when 'x' is pressed
  handleCancel() {
    this.props.cancel()
  }

  render() {
    return (
      <View>
        <Text />
        <Modal transparent animationType="none" visible={this.props.visible}>
          <View style={[modalStyles.modal, styles.modalHeight]}>
            <View style={styles.icon}>
              <AntDesign
                name="closecircleo"
                style={modalStyles.icon}
                onPress={() => this.handleCancel()}
              />
            </View>
            <View style={styles.modalStyle}>
              <Text style={[styles.title, screenStyles.textBook, screenStyles.hex]}>Choose a starting location</Text>
              <TextInput
                style={[screenStyles.input, screenStyles.textBook, styles.input]}
                placeholderTextColor="#9F9F9F"
                placeholder="Enter your zip code"
                onChangeText={(text) => this.setState({ zip: text })}
              />
              {this.state.zipValid && <Text style={{ textAlign: 'center' }}> </Text>}
              {!this.state.zipValid && (
                <View style={styles.error}>
                  <AntDesign name="exclamationcircle" style={styles.errorIcon} />
                  <Text style={[screenStyles.textBook, styles.errorText]}>Invalid zip code</Text>
                </View>
              )}
              <TouchableHighlight
                underlayColor="white"
                onHideUnderlay={() => this.setState({ buttonPressed: false })}
                onShowUnderlay={() => this.setState({ buttonPressed: true })}
                onPress={() => this.validateZip()}
                style={[modalStyles.button, styles.buttonColor]}
              >
                <Text
                  style={[
                    modalStyles.text,
                    this.state.buttonPressed ? screenStyles.hex : styles.white,
                  ]}
                >
                  Done
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
  title: {
    fontSize: normalize(20),
    marginLeft: '7.5%',
  },
  input: {
    color: 'black',
    fontSize: normalize(18),
    backgroundColor: '#E0E0E0',
    width: '85%',
    alignSelf: 'center',
    borderRadius: 5,
    padding: '1%',
  },
  modalHeight: {
    height: height * 0.3,
  },
  icon: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  modalStyle: {
    flexDirection: 'column',
    flex: 1,
    justifyContent: 'space-evenly',
  },
  error: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: '8%',
  },
  errorIcon: {
    color: 'red',
    marginRight: '2%',
    fontSize: normalize(15),
  },
  errorText: {
    textAlign: 'center',
    color: 'red',
  },
  buttonColor: {
    backgroundColor: screenStyles.hex.color,
  },
  white: {
    color: 'white'
  }
})

Location.propTypes = {
  press: PropTypes.func,
  cancel: PropTypes.func,
  visible: PropTypes.bool,
}
