import React from 'react'
import { Dimensions, Linking, StyleSheet, Text, TouchableHighlight, View } from 'react-native'
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps'
import Icon from 'react-native-vector-icons/FontAwesome'
import PropTypes from 'prop-types'
import socket from '../apis/socket.js'

const hex = '#F25763'
const font = 'CircularStd-Medium'

// the card for the restaurant match
export default class Match extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      endRound: false,
      goToYelp: false,
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
        <Text style={styles.text}>It's A Match!</Text>
        <Icon name="thumbs-up" style={styles.thumbIcon} />
        <Text style={styles.subheading}>Your group has selected:</Text>
        <Text style={styles.restaurantName}>{this.state.restaurant.name}</Text>
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
          onShowUnderlay={() => this.setState({ endRound: true })}
          onHideUnderlay={() => this.setState({ endRound: false })}
          style={styles.endButton}
          onPress={() => this.endRound()}
        >
          <Text style={this.state.endRound ? styles.endTextPressed : styles.endText}>
            End Round
          </Text>
        </TouchableHighlight>
        <TouchableHighlight
          style={styles.yelpButton}
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
  text: {
    fontFamily: font,
    color: 'white',
    fontSize: 65,
    textAlign: 'center',
    fontWeight: 'bold',
    marginRight: '10%',
    marginLeft: '10%',
  },
  thumbIcon: {
    color: 'white',
    textAlign: 'center',
    fontFamily: font,
    fontSize: 50,
  },
  restaurantName: {
    fontFamily: font,
    color: 'white',
    textAlign: 'center',
    fontSize: 30,
    fontWeight: 'bold',
  },
  subheading: {
    fontFamily: font,
    color: 'white',
    textAlign: 'center',
    fontSize: 20,
  },
  restaurantName: {
    fontFamily: font,
    color: 'white',
    textAlign: 'center',
    fontSize: 30,
    fontWeight: 'bold',
  },
  subheading: {
    fontFamily: font,
    color: 'white',
    textAlign: 'center',
    fontSize: 20,
  },
  map: {
    alignSelf: 'center',
    height: Dimensions.get('window').width * 0.55,
    width: Dimensions.get('window').width * 0.55,
  },
  endButton: {
    borderColor: 'white',
    borderWidth: 2.5,
    borderRadius: 30,
    alignSelf: 'center',
    width: '45%',
  },
  endText: {
    fontFamily: font,
    color: 'white',
    fontSize: 20,
    textAlign: 'center',
    padding: '6%',
    fontWeight: 'bold',
  },
  endTextPressed: {
    fontFamily: font,
    color: 'white',
    fontSize: 20,
    textAlign: 'center',
    padding: '6%',
    fontWeight: 'bold',
  },
  yelpButton: {
    backgroundColor: 'white',
    width: '30%',
    height: '5%',
    borderWidth: 2.5,
    borderColor: 'white',
    borderRadius: 30,
    alignSelf: 'center',
  },
  yelpText: {
    fontFamily: font,
    textAlign: 'center',
    padding: '5%',
  },
})
