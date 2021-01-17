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
import MapView, { Circle, Marker, PROVIDER_GOOGLE } from 'react-native-maps'
import modalStyles from '../../styles/modalStyles.js'
import normalize from '../../styles/normalize.js'
import screenStyles from '../../styles/screenStyles.js'
import colors from '../../styles/colors.js'
import Slider from '@react-native-community/slider'
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
      location: {
        latitude: 34.06892,
        longitude: -118.445183,
      },
      distance: 5.5,
      zip: '',
      zipValid: true,
      //style of the button
      buttonPressed: false,
    }
  }

  validateZip() {
    this.props.update(this.state.distance)
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
    this.props.update(this.state.distance)
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
              <Text style={[styles.title, screenStyles.textBook, screenStyles.hex]}>
                Choose a starting location
              </Text>
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
            <Text style={styles.distanceText}>({this.state.distance} miles)</Text>
            <Slider
              style={{
                width: '85%',
                height: 30,
                alignSelf: 'center',
              }}
              minimumValue={5}
              maximumValue={25}
              value={5}
              step={0.5}
              minimumTrackTintColor={colors.hex}
              maximumTrackTintColor={colors.hex}
              thumbTintColor={colors.hex}
              onValueChange={(value) => {
                this.setState({ distance: value })
              }}
            />
            <View style={styles.mapContainer}>
              <MapView
                provider={PROVIDER_GOOGLE}
                style={styles.map}
                showsScale={true}
                showsCompass={true}
                showsBuildings={true}
                showsMyLocationButton={true}
                region={{
                  latitude: 34.06892,
                  longitude: -118.445183,
                  latitudeDelta: this.state.distance / 60 + 0.3,
                  longitudeDelta: this.state.distance / 60 + 0.3,
                }}
                onMarkerDragEnd={(res) => {
                  this.setState({ location: res.coordinate })
                }}
              >
                <Marker
                  draggable
                  coordinate={{
                    latitude: 34.06892,
                    longitude: -118.445183,
                  }}
                />
                <Circle
                  center={this.state.location}
                  radius={this.state.distance * 1609.34}
                  fillColor={'rgba(241, 87, 99, 0.7)'}
                />
              </MapView>
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
    height: height * 0.8,
    margin: '20%',
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
    color: 'white',
  },
  mapContainer: {
    borderBottomLeftRadius: 14,
    borderBottomRightRadius: 14,
    overflow: 'hidden', //hides map overflow
    alignSelf: 'center',
    justifyContent: 'flex-end',
    height: Dimensions.get('window').height * 0.5,
    width: Dimensions.get('window').width * 0.8,
  },
  map: {
    borderBottomLeftRadius: 14,
    borderBottomRightRadius: 14,
    overflow: 'hidden', //hides map overflow
    alignSelf: 'center',
    justifyContent: 'flex-end',
    height: Dimensions.get('window').height * 0.5,
    width: Dimensions.get('window').width * 0.8,
  },
  distanceText: {
    color: '#747474',
    alignSelf: 'center',
  }
})

Location.propTypes = {
  update: PropTypes.func,
  press: PropTypes.func,
  cancel: PropTypes.func,
  visible: PropTypes.bool,
}
