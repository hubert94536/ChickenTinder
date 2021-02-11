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
import mapStyle from '../../styles/mapStyle.json'
import Slider from '@react-native-community/slider'
import AntDesign from 'react-native-vector-icons/AntDesign'
import { ZIP_ID, ZIP_TOKEN } from 'react-native-dotenv'

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
      city: null,
      distance: 5.5,
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
        console.log(JSON.stringify(res.lookups[0].result[0]))
        let result = res.lookups[0].result[0]
        if (result.valid) {
          // console.log('valid zip: ' + this.state.zip.toString())
          let data = result.zipcodes[0]
          this.setState({
            zipValid: true,
            city: result.city,
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
    if (this.state.zipValid) this.props.update(this.state.distance, this.state.location)
  }

  //  function called when 'x' is pressed
  handleCancel() {
    this.props.cancel()
  }

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
              height: '20%',
              borderRadius: 7,
              backgroundColor: 'green',
            }}
          ></View>
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
          <TouchableHighlight
            underlayColor="white"
            onHideUnderlay={() => this.setState({ buttonPressed: false })}
            onShowUnderlay={() => this.setState({ buttonPressed: true })}
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
    marginTop: fullHeight * 0.15,
    marginBottom: fullHeight * 0.15,
    height: fullHeight * 0.7,
    width: fullWidth * 0.8,
  },
  map: {
    height: fullHeight * 0.7,
    width: fullWidth * 0.8,
  },
  buttonColor: {
    backgroundColor: screenStyles.hex.color,
  },
  white: {
    color: 'white',
  },
  sliderStyle: {
    width: '85%',
    height: 30,
    alignSelf: 'center',
    position: 'absolute',
    bottom: fullHeight * 0.1,
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
})

Location.propTypes = {
  update: PropTypes.func,
  cancel: PropTypes.func,
  visible: PropTypes.bool,
}
