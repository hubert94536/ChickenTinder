import React from 'react'
import { Dimensions, Linking, StyleSheet, Text, TouchableHighlight, View } from 'react-native'
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps'
import Icon from 'react-native-vector-icons/FontAwesome'
import PropTypes from 'prop-types'
import colors from '../../styles/colors.js'
import screenStyles from '../../styles/screenStyles.js'
import MatchCard from '../cards/MatchCard.js'
import normalize from '../../styles/normalize.js'
import socket from '../apis/socket.js'

// the card for the restaurant match
export default class Match extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      restaurant: this.props.navigation.state.params.restaurant,
    }
  }

  endRound() {
    this.props.navigation.replace('Home')
    socket.leaveRoom(global.code)
  }

  render() {
    const { restaurant } = this.state
    return (
      <View style={styles.container}>
        <View style={styles.headerContainer} /*Header for header text and heart icon */>
          <Text style={[screenStyles.textBold, styles.title]}>WeChews you!</Text>
          <Icon name="heart" style={[styles.general, styles.heart]} />
        </View>
        <View style={styles.restaurantCardContainer} /*Restaurant card*/>
          <MatchCard card={restaurant} />
          <View style={styles.mapContainer}>
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
        </View>
        <TouchableHighlight //Button to open restaurant on yelp
          underlayColor="white"
          style={[screenStyles.bigButton, styles.yelpButton]}
          onPress={() => Linking.openURL(restaurant.url)}
        >
          <Text style={[screenStyles.bigButtonText, styles.white]}>Open on Yelp</Text>
        </TouchableHighlight>
        <TouchableHighlight
          /* Button to call phone # */
          style={[screenStyles.bigButton, styles.callButton]}
          onPress={() => Linking.openURL(`tel:${restaurant.phone}`)}
        >
          <Text style={[screenStyles.bigButtonText, { color: colors.hex }]}>
            Call: {restaurant.phone}
          </Text>
        </TouchableHighlight>
        <Text /* Link to exit round */
          style={[screenStyles.bigButtonText, styles.exitRoundText]}
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
    replace: PropTypes.func,
    navigate: PropTypes.func,
    state: PropTypes.shape({
      params: PropTypes.shape({
        restaurant: PropTypes.object,
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
  title: { fontSize: normalize(33), marginHorizontal: '3%' },
  heart: { fontSize: normalize(35), paddingVertical: '1%' },
  general: {
    fontFamily: screenStyles.medium.fontFamily,
    color: colors.hex,
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
  //To give the Google Map rounded bottom edges
  mapContainer: {
    borderBottomLeftRadius: 14,
    borderBottomRightRadius: 14,
    overflow: 'hidden', //hides map overflow
    alignSelf: 'center',
    justifyContent: 'flex-end',
    height: Dimensions.get('window').height * 0.4,
    width: Dimensions.get('window').width * 0.82,
  },
  map: {
    alignSelf: 'center',
    justifyContent: 'flex-end',
    height: Dimensions.get('window').height * 0.4,
    width: Dimensions.get('window').width * 0.82,
  },
  //Styling for Google map for restaurant
  /* For "Open on Yelp" button */
  yelpButton: {
    backgroundColor: colors.hex,
    height: '4%',
    justifyContent: 'center',
    alignSelf: 'center',
    borderColor: colors.hex,
    marginTop: '8%',
  },
  /* For "Call number" button */
  callButton: {
    backgroundColor: 'white',
    height: '4%',
    justifyContent: 'center',
    alignSelf: 'center',
    borderColor: colors.hex,
  },
  /* Text for exit round link */
  exitRoundText: {
    color: '#6A6A6A',
    justifyContent: 'center',
    alignSelf: 'center',
    width: '65%',
    height: '4%',
    marginBottom: '4%',
  },
  white: { color: 'white' },
})
