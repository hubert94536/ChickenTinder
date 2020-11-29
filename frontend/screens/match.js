import React from 'react'
import { Dimensions, Linking, StyleSheet, Text, TouchableHighlight, View } from 'react-native'
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps'
import Icon from 'react-native-vector-icons/FontAwesome'
import PropTypes from 'prop-types'
import screenStyles from '../../styles/screenStyles.js'
import MatchCard from '../cards/matchCard.js'

// commented out during linting but socket is used in commented-out code below
//import socket from '../apis/socket.js'

const hex = '#F15763'
const font = 'CircularStd-Medium'

// the card for the restaurant match
export default class Match extends React.Component {
  constructor(props) {
    super(props)

    var parseRestaurant = [] //dummy restaurant for testing purposes
    parseRestaurant['id'] = 'E8RJkjfdcwgtyoPMjQ_Olg'
    parseRestaurant['name'] = 'Four Barrel Coffee'
    parseRestaurant['distance'] = 2.4
    parseRestaurant['reviewCount'] = 1738
    parseRestaurant['rating'] = 4
    parseRestaurant['price'] = '$'
    parseRestaurant['phone'] = '+14152520800'
    parseRestaurant['city'] = 'San Francisco'
    parseRestaurant['latitude'] = 37.7670169511878
    parseRestaurant['longitude'] = -122.42184275
    parseRestaurant['url'] = 'https://www.yelp.com/biz/four-barrel-coffee-san-francisco'
    parseRestaurant['transactions'] = ['pickup', 'delivery']
    parseRestaurant['categories'] = [
      {
        alias: 'coffee',
        title: 'Coffee & Tea',
      },
    ]

    this.state = {
      navigation: this.props.navigation,
      //restaurant: this.props.navigation.state.params.restaurant,
      restaurant: parseRestaurant,
      //host: this.props.host, only for socket testing
    }
  }

  endRound() {
    // socket.leaveRoom(this.props.host)
    const { navigation } = this.state
    navigation.navigate('Home')
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
        <View style={styles.headerContainer} /*Header for header text and heart icon */>
          <Text style={[styles.general, { fontSize: 33, marginHorizontal: '3%' }]}>
            WeChews you!
          </Text>
          <Icon name="heart" style={[styles.general, { fontSize: 35, paddingVertical: '1%' }]} />
        </View>
        <View style={styles.restaurantCardContainer} /*Restaurant card*/>
          <MatchCard card={restaurant} />
          <MapView
            provider={PROVIDER_GOOGLE}
            style={styles.map}
            region={{
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
        </View>
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
          onPress={() => Linking.openURL(`tel:${restaurant.phone}`)}
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
  //navig should contain navigate fx + state, which contains params which contains the necessary restaurant arr
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
    state: PropTypes.shape({
      params: PropTypes.shape({
        restaurant: PropTypes.array.isRequired,
      }),
    }),
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
  /* Alignment for header text and icon on top of screen */
  headerContainer: {
    flexDirection: 'row',
    alignContent: 'center',
    justifyContent: 'center',
    padding: '1%',
    paddingTop: '5%',
  },
  /* Container holding the restaurant details and map */
  restaurantCardContainer: {
    marginHorizontal: '9%',
    padding: '2%',
    borderRadius: 14, //roundness of border
    height: '65%',
    width: '82%',
    //backgroundColor: hex, for testing
  },
  /*Name of restaurant
  restaurantNameText: {
    color: 'white',
    fontSize: 25,
    textAlign: 'left',
    padding: '3%',
  },
  //Styling for restaurant info card with info, image/gradient
  restaurantInfoCard: {
    alignSelf: 'center',
    justifyContent: 'flex-start',
    //height: '20%',
    //width: '70%',
    backgroundColor: 'grey',
  },
  //Small info text inside restaurant card
  restaurantInfoText: {
    color: 'white',
    fontSize: 15,
    textAlign: 'left',
    padding: '2%',
  }, */
  //Styling for Google map for restaurant
  map: {
    alignSelf: 'center',
    justifyContent: 'flex-end',
    height: Dimensions.get('window').height * 0.4,
    width: Dimensions.get('window').width * 0.82,
    borderRadius: 14,
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
    marginTop: '8%',
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
  /* Text for exit round link */
  exitRoundText: {
    color: '#6A6A6A',
    justifyContent: 'center',
    alignSelf: 'center',
    width: '55%',
    height: '4%',
    marginBottom: '4%',
  },
})
