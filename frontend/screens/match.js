import React from 'react'
import { Dimensions, Linking, StyleSheet, Text, TouchableHighlight, View } from 'react-native'
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps'
import Icon from 'react-native-vector-icons/FontAwesome'
import PropTypes from 'prop-types'
import screenStyles from '../../styles/screenStyles.js'
// commented out during linting but socket is used in commented-out code below
//import socket from '../apis/socket.js'

const hex = '#F15763'
const font = 'CircularStd-Medium'

// the card for the restaurant match
export default class Match extends React.Component {
  constructor(props) {
    super(props)
    var restaurant_JSON = {
      id: 'E8RJkjfdcwgtyoPMjQ_Olg',
      name: 'Four Barrel Coffee',
      distance: 2.4,
      reviewCount: 1738,
      rating: 4,
      price: '$',
      phone: '+14152520800',
      city: 'San Francisco',
      latitude: 37.7670169511878,
      longitude: -122.42184275,
      url: 'https://www.yelp.com/biz/four-barrel-coffee-san-francisco',
      transactions: ['pickup', 'delivery'],
      categories: [
        {
          alias: 'coffee',
          title: 'Coffee & Tea',
        },
      ],
    }
    var parseRestaurant = []
    parseRestaurant['id'] = 'E8RJkjfdcwgtyoPMjQ_Olg'
    parseRestaurant['name'] = 'Four Barrel Coffee'
    parseRestaurant['phone'] = '+14152520800'
    parseRestaurant['latitude'] = 37.7670169511878
    parseRestaurant['longitude'] = -122.42184275
    parseRestaurant['url'] = 'https://www.yelp.com/biz/four-barrel-coffee-san-francisco'

    this.state = {
      // restaurant: this.props.navigation.state.params.restaurant,
      restaurant: parseRestaurant,
      //host: this.props.host, only for socket testing
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
    const { restaurant } = this.state
    return (
      <View style={styles.container}>
        <Text style={[styles.general, { fontSize: 65, marginRight: '10%', marginLeft: '10%' }]}>
          WeChews you!
        </Text>
        <Icon name="thumbs-up" style={[styles.general, { fontSize: 50 }]} />
        <Text style={[styles.general, { fontSize: 20 }]}>Your group has selected:</Text>
        <Text style={[styles.general, { fontSize: 30 }]}>{restaurant.name}</Text>
        <MapView
          provider={PROVIDER_GOOGLE}
          style={styles.map}
          region={{
            //latitude: 37.7670169511878,
            //longitude: -122.42184275,
            latitude: restaurant.latitude,
            longitude: restaurant.longitude,
            latitudeDelta: 0.015,
            longitudeDelta: 0.015,
          }}
        >
          <Marker
            coordinate={{
              latitude: restaurant.latitude,
              longitude: restaurant.longitude,
            }}
          />
        </MapView>
        <TouchableHighlight //Button to open restaurant on yelp
          underlayColor="white"
          style={styles.yelpButton}
          onPress={() => Linking.openURL(restaurant.url)}
        >
          <Text style={[screenStyles.medButtonText, { color: 'white' }]}>Open on Yelp</Text>
        </TouchableHighlight>
        <TouchableHighlight
          /* Button to call phone # */
          style={styles.callButton}
          //TODO: onPress, call fx to call phone
        >
          <Text style={[screenStyles.medButtonText, { color: hex }]}>Call: {restaurant.phone}</Text>
        </TouchableHighlight>
        <Text /* Link to exit round */
          style={[screenStyles.medButtonText, styles.exitRoundText]}
          onPress={() => this.endRound()}
        >
          Exit Round
        </Text>
      </View>
    )
  }
}

Match.propTypes = {
  restaurant: PropTypes.array,
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
  }),
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'space-evenly',
  },
  general: {
    fontFamily: font,
    color: hex,
    textAlign: 'center',
  },
  map: {
    alignSelf: 'center',
    height: Dimensions.get('window').width * 0.55,
    width: Dimensions.get('window').width * 0.55,
  },
  /* For "Open on Yelp" button */
  yelpButton: {
    backgroundColor: hex,
    width: '55%',
    height: '4%',
    justifyContent: 'center',
    alignSelf: 'center',
    borderRadius: 30,
    borderWidth: 2.5,
    borderColor: hex,
  },
  /* For "Call number" button */
  callButton: {
    backgroundColor: 'white',
    width: '55%',
    height: '4%',
    justifyContent: 'center',
    alignSelf: 'center',
    borderRadius: 30,
    borderWidth: 2.5,
    borderColor: hex,
  },
  exitRoundText: {
    color: '#6A6A6A',
    justifyContent: 'center',
    alignSelf: 'center',
    width: '55%',
    height: '4%',
  },
})
