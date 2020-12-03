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
import { BlurView } from '@react-native-community/blur'
import PropTypes from 'prop-types'
import modalStyles from '../../styles/modalStyles.js'
import screenStyles from '../../styles/screenStyles.js'
import AntDesign from 'react-native-vector-icons/AntDesign'
import { ZIP_ID, ZIP_TOKEN } from 'react-native-dotenv'

const hex = '#F15763'
const font = 'CircularStd-Book'
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
          <View style={[modalStyles.modal, { height: height * 0.3 }]}>
            <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
              <AntDesign
                name="closecircleo"
                style={modalStyles.icon}
                onPress={() => this.handleCancel()}
              />
            </View>
            <View
              style={{
                flexDirection: 'column',
                flex: 1,
                justifyContent: 'space-evenly',
              }}
            >
              <View>
                <Text style={styles.title}>Choose a starting location</Text>
              </View>
              <TextInput
                style={[screenStyles.text, screenStyles.input, styles.input]}
                placeholderTextColor="#9F9F9F"
                placeholder="Enter your zip code"
                onChangeText={(text) => this.setState({ zip: text })}
              />
              {this.state.zipValid && <Text style={{ textAlign: 'center' }}> </Text>}
              {!this.state.zipValid && (
                <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: '7.5%' }}>
                  <AntDesign
                    name="exclamationcircle"
                    style={{ color: 'red', marginRight: '2%', fontSize: 15 }}
                  />
                  <Text
                    style={[
                      screenStyles.text,
                      { textAlign: 'center', color: 'red', fontFamily: font },
                    ]}
                  >
                    Invalid zip code
                  </Text>
                </View>
              )}
              <TouchableHighlight
                underlayColor="white"
                onHideUnderlay={() => this.setState({ buttonPressed: false })}
                onShowUnderlay={() => this.setState({ buttonPressed: true })}
                onPress={() => this.validateZip()}
                style={[modalStyles.button, { backgroundColor: hex }]}
              >
                <Text
                  style={[
                    modalStyles.text,
                    this.state.buttonPressed ? { color: hex } : { color: 'white' },
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
    fontFamily: font,
    color: hex,
    fontSize: 20,
    marginLeft: '7.5%',
  },
  input: {
    color: 'black',
    fontSize: 18,
    backgroundColor: '#E0E0E0',
    width: '85%',
    alignSelf: 'center',
    borderRadius: 5,
    padding: '1%',
    fontFamily: font,
  },
})

Location.propTypes = {
  press: PropTypes.func,
  cancel: PropTypes.func,
  visible: PropTypes.bool,
}
