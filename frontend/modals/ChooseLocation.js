import React, { Component } from 'react'
import {
  PermissionsAndroid,
  Dimensions,
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
  Modal,
  TextInput,
} from 'react-native'
import Geolocation from 'react-native-geolocation-service'
import PropTypes from 'prop-types'
import MapView, { Circle, PROVIDER_GOOGLE } from 'react-native-maps'
import imgStyles from '../../styles/cardImage.js'
import modalStyles from '../../styles/modalStyles.js'
import normalize from '../../styles/normalize.js'
import screenStyles from '../../styles/screenStyles.js'
import colors from '../../styles/colors.js'
import mapStyle from '../../styles/mapStyle.json'
import Slider from '@react-native-community/slider'
import AntDesign from 'react-native-vector-icons/AntDesign'
import { ZIP_ID, ZIP_TOKEN } from 'react-native-dotenv'
import _ from 'lodash'

const fullWidth = Dimensions.get('window').width
const fullHeight = Dimensions.get('window').height
const ratio = fullHeight / fullWidth

const SmartyStreetsSDK = require('smartystreets-javascript-sdk')
const SmartyStreetsCore = SmartyStreetsSDK.core
const Lookup = SmartyStreetsSDK.usZipcode.Lookup

let clientBuilder = new SmartyStreetsCore.ClientBuilder(
  new SmartyStreetsCore.StaticCredentials(ZIP_ID, ZIP_TOKEN),
)
let client = clientBuilder.buildUsZipcodeClient()

const iconSize = 30

const requestLocationPermission = async () => {
  PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION, {
    title: 'Location Permission',
    message: 'WeChews needs access to your location ' + 'so you can find nearby restaurants.',
    buttonNeutral: 'Ask Me Later',
    buttonNegative: 'Cancel',
    buttonPositive: 'OK',
  })
    .then((res) => {
      if (res === PermissionsAndroid.RESULTS.GRANTED) {
        return true
      } else {
        return false
      }
    })
    .catch(() => {
      this.setState({ errorAlert: true })
      this.props.setBlur(true)
    })
}

export default class Location extends Component {
  constructor(props) {
    super(props)
    this.mapView = React.createRef()
    this.circle = React.createRef()
    this.state = {
      location: {
        latitude: 34.06892,
        longitude: -118.445183,
      },
      city: 'Choose a location',
      state: '',
      distance: 5.5,
      zip: '',
      zipValid: true,
      expanded: true,
    }
  }

  validate() {
    //created Lookup for validating zip code
    let lookup = new Lookup()
    lookup.zipCode = this.state.zip

    client
      .send(lookup)
      .then((res) => {
        // console.log(JSON.stringify(res.lookups[0].result[0]))
        let result = res.lookups[0].result[0]
        if (result.valid) {
          // console.log('valid zip: ' + this.state.zip.toString())
          let data = result.zipcodes[0]
          console.log(JSON.stringify(data))
          this.setState({
            zipValid: true,
            city: data.defaultCity,
            state: ', ' + data.stateAbbreviation,
            location: {
              latitude: data.latitude,
              longitude: data.longitude,
            },
          })
          let newRegion = {
            latitude: data.latitude,
            longitude: data.longitude,
            latitudeDelta: this.state.distance / 60 + 0.3,
            longitudeDelta: this.state.distance / 60 + 0.3,
          }
          this.mapView.current.animateToRegion(newRegion, 3000)
        } else {
          this.setState({ zipValid: false })
          console.log('false')
        }
      })
      .catch((err) => {
        console.log(err)
        this.setState({ zipValid: false })
      })
  }

  // function called when main button is pressed w/ valid ZIP
  handlePress() {
    this.props.update(this.state.distance, this.state.location)
  }

  //  function called when 'x' is pressed
  handleCancel() {
    this.props.cancel()
  }

location(){
  if (requestLocationPermission()) {
    Geolocation.getCurrentPosition(
      (position) => {
        this.setState({
          zipValid: true,
          city: 'Current Location',
          state: '',
          location: {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          },
        })
        let newRegion = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          latitudeDelta: this.state.distance / 60 + 0.3,
          longitudeDelta: this.state.distance / 60 + 0.3,
        }
        this.mapView.current.animateToRegion(newRegion, 3000)
      },
      (error) => {
        console.log(error.code, error.message)
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
    )
  } else {
    console.log('Filter.js: Failed to get location')
  }
}

  getLocation =  _.debounce(this.location.bind(this), 500)
  validateZip = _.debounce(this.validate.bind(this), 200)

  render() {
    return (
      <Modal transparent animationType="none" visible={this.props.visible} style={styles.main}>
        <View style={styles.mapContainer}>
          <MapView
            ref={this.mapView}
            provider={PROVIDER_GOOGLE}
            style={styles.map}
            customMapStyle={mapStyle}
            initialRegion={{
              latitude: this.state.location.latitude,
              longitude: this.state.location.longitude,
              latitudeDelta: this.state.distance / 60 + 0.3,
              longitudeDelta: this.state.distance / 60 + 0.3,
            }}
          >
            <Circle
              ref={this.circle}
              center={this.state.location}
              radius={this.state.distance * 1609.34}
              fillColor={'rgba(0, 0, 0, 0.1)'}
              strokeWidth={0}
            />
            <Circle
              center={this.state.location}
              radius={1000}
              fillColor={'rgba(0, 0, 0, 0.2)'}
              strokeWidth={0}
            />
          </MapView>
          <View
            style={{
              position: 'absolute',
              top: '5%',
              left: '7%',
              right: '7%',
              alignSelf: 'center',
              height: '25%',
              borderRadius: 7,
              backgroundColor: 'white',

              flexDirection: 'column',
              justifyContent: 'flex-start',
            }}
          >
            {/* Top - title & expand/contract */}
            <View
              style={{
                flex: 0.5,
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              {/* <View style={styles.icon} /> */}
              <Text style={[styles.title, screenStyles.textBook, screenStyles.hex]}>
                {this.state.city + this.state.state}
              </Text>

              <AntDesign
                style={styles.icon}
                name={this.state.expanded ? 'up' : 'down'}
                onPress={() => {
                  console.log('chooselocation: pressed')
                  this.setState((prev) => ({
                    expanded: !prev.expanded,
                  }))
                }}
              />
            </View>
            {/* Horizontal Line */}
            <View
              style={{
                height: 1,
                width: '100%',
                borderWidth: 1,
                borderColor: '#E0E0E0',
              }}
            />
            {/* Middle - zip code text input, current location button */}
            <View
              style={{
                flex: 1,
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <TextInput
                style={[screenStyles.input, screenStyles.textBook, styles.input]}
                keyboardType="number-pad"
                placeholderTextColor="#9F9F9F"
                placeholder="Enter your zip code"
                textAlign="center"
                onSubmitEditing={({ nativeEvent }) => {
                  this.setState({ zip: nativeEvent.text }, () => this.validateZip())
                }}
              />
              <TouchableHighlight
                underlayColor="white"
                onPress={() => this.getLocation()}
                style={[modalStyles.button, styles.buttonColor, styles.locationButton]}
              >
                <Text style={[modalStyles.text, styles.white, styles.locationText]}>
                  Get Current Location
                </Text>
              </TouchableHighlight>
            </View>
            {/* Horizontal Line */}
            <View
              style={{
                height: 1,
                width: '100%',
                borderWidth: 1,
                borderColor: '#E0E0E0',
              }}
            />
            {/* Bottom - slider & info text */}
            <View
              style={{
                flex: 0.25,
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Slider
                style={styles.sliderStyle}
                minimumValue={5}
                maximumValue={25}
                value={5}
                step={0.25}
                minimumTrackTintColor={colors.hex}
                maximumTrackTintColor={colors.hex}
                thumbTintColor={colors.hex}
                onValueChange={(value) => {
                  this.setState({ distance: value })
                  let newRegion = {
                    latitude: this.state.location.latitude,
                    longitude: this.state.location.longitude,
                    latitudeDelta: value / 40 + 0.2,
                    longitudeDelta: value / 40 + 0.2,
                  }
                  this.mapView.current.animateToRegion(newRegion, 100)
                }}
              />
            </View>
          </View>

          <TouchableHighlight
            underlayColor="white"
            onPress={() => this.handlePress()}
            style={[modalStyles.button, styles.buttonColor, styles.doneButton]}
          >
            <Text style={[modalStyles.text, styles.white]}>Done</Text>
          </TouchableHighlight>
        </View>
      </Modal>
    )
  }
}

const styles = StyleSheet.create({
  main: {
    // technically uneeded
    alignItems: 'center',
  },
  mapContainer: {
    alignSelf: 'center',
    borderRadius: 14,
    overflow: 'hidden',
    marginTop: fullHeight * 0.11,
    marginBottom: fullHeight * 0.11,
    height: fullHeight * 0.78,
    width: fullWidth * 0.8,
  },
  map: {
    height: fullHeight * 0.98,
    width: fullWidth * 0.8,
  },
  buttonColor: {
    backgroundColor: screenStyles.hex.color,
  },
  white: {
    color: 'white',
    fontWeight: '300',
  },
  sliderStyle: {
    width: '85%',
    height: 30,
    alignSelf: 'center',
  },
  title: {
    fontWeight: 'bold',
    fontSize: normalize(20),
  },
  input: {
    color: 'black',
    fontSize: normalize(14),
    fontWeight: '300',
    backgroundColor: '#E0E0E0',
    width: '85%',
    alignSelf: 'center',
    borderRadius: 5,
  },
  distanceText: {
    color: '#747474',
    alignSelf: 'center',
  },
  doneButton: {
    position: 'absolute',
    alignSelf: 'center',
    bottom: 15,
    height: normalize(25),
  },
  locationButton: {
    borderRadius: 5,
    alignSelf: 'center',
    justifyContent: 'center',
    alignContent: 'center',
    flexDirection: 'column',
    fontSize: normalize(14),
    width: '85%',
    height: '30%',
  },
  locationText: {
    fontSize: normalize(14),
    fontWeight: '300',
  },
  icon: {
    position: 'absolute',
    right: '2%',
    height: normalize(iconSize),
    width: normalize(iconSize),
    fontFamily: 'CircularStd-Medium',
    color: colors.gray,
    fontSize: normalize(iconSize),
  },
})

Location.propTypes = {
  update: PropTypes.func,
  cancel: PropTypes.func,
  visible: PropTypes.bool,
}
