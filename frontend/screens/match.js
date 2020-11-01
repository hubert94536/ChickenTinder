import React from 'react'
import { Dimensions, Linking, StyleSheet, Text, TouchableHighlight, View } from 'react-native'
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps'
import Icon from 'react-native-vector-icons/FontAwesome'
import PropTypes from 'prop-types'
import socket from '../apis/socket.js'
import screenStyles from '../../styles/screenStyles.js'

const hex = '#F25763'
const font = 'CircularStd-Bold'

// the card for the restaurant match
export default class Match extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      restaurant: this.props.navigation.state.params.restaurant,
      host: this.props.host,
    }
  }

  endRound() {
    // socket.leaveRoom(this.props.host)
    this.props.navigation.navigate('Home')
  }

  componentDidMount() {
    this._isMounted = true
  }

  componentWillUnmount() {
    this._isMounted = false
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={[styles.general, { fontSize: 65, marginRight: '10%', marginLeft: '10%' }]}>
          It's A Match!
        </Text>
        <Icon name="thumbs-up" style={[styles.general, { fontSize: 50 }]} />
        <Text style={[styles.general, { fontSize: 20 }]}>Your group has selected:</Text>
        <Text style={[styles.general, { fontSize: 30 }]}>{this.state.restaurant.name}</Text>
        <MapView
          provider={PROVIDER_GOOGLE}
          style={styles.map}
          region={{
            latitude: this.state.restaurant.latitude,
            longitude: this.state.restaurant.longitude,
            latitudeDelta: 0.015,
            longitudeDelta: 0.015,
          }}
        >
          <Marker
            coordinate={{
              latitude: this.state.restaurant.latitude,
              longitude: this.state.restaurant.longitude,
            }}
          />
        </MapView>
        <TouchableHighlight
          underlayColor="white"
          style={[screenStyles.medButton, { borderColor: 'white', width: '45%' }]}
          onPress={() => this.endRound()}
        >
          <Text
            style={[styles.endText, screenStyles.medButtonText, { color: 'white', padding: '6%' }]}
          >
            End Round
          </Text>
        </TouchableHighlight>
        <TouchableHighlight
          style={[screenStyles.medButton, styles.yelpButton]}
          onPress={() => Linking.openURL(this.state.restaurant.url)}
        >
          <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
            <Icon name="yelp" style={{ color: 'red', fontSize: 20, alignSelf: 'center' }} />
            <Text style={styles.yelpText}>Go To Yelp</Text>
          </View>
        </TouchableHighlight>
      </View>
    )
  }
}

Match.propTypes = {
  restaurant: PropTypes.array,
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: hex,
    justifyContent: 'space-evenly',
  },
  general: {
    fontFamily: font,
    color: 'white',
    textAlign: 'center',
  },
  map: {
    alignSelf: 'center',
    height: Dimensions.get('window').width * 0.55,
    width: Dimensions.get('window').width * 0.55,
  },
  yelpButton: {
    backgroundColor: 'white',
    width: '30%',
    height: '5%',
    borderColor: 'white',
  },
  yelpText: {
    fontFamily: font,
    textAlign: 'center',
    padding: '5%',
  },
})
