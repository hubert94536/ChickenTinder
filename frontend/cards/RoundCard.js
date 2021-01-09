import React from 'react'
import {
  Dimensions,
  ImageBackground,
  Image,
  Linking,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
} from 'react-native'
import { faMapMarkerAlt, faUtensils } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import Icon from 'react-native-vector-icons/FontAwesome'
import getStarPath from '../assets/stars/star.js'
import PropTypes from 'prop-types'
import imgStyles from '../../styles/cardImage.js'
import getCuisine from '../assets/cards/foodImages.js'
import normalize from '../../styles/normalize.js'

export default class RoundCard extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      press: false,
    }
  }

  // for each transaction, put into comma-separated string
  evaluateTransactions(transactions) {
    var fork = ''
    for (var i = 0; i < transactions.length; i++) {
      if (transactions[i] === 'restaurant_reservation') fork += 'Reservation'
      else fork += transactions[i].charAt(0).toUpperCase() + transactions[i].slice(1)
      if (i < transactions.length - 1) fork += ', '
    }
    return fork
    //  return transactions.map((item) => item.charAt(0).toUpperCase() + item.slice(1)).join(', ')
  }

  evaluateCuisines(cuisines) {
    // return cuisines.map((item) => item.title).join(', ')
    if (cuisines.length > 2) {
      return cuisines[0].title + ', ' + cuisines[1].title
    } else {
      return cuisines[0].title
    }
  }

  render() {
    // console.log('roundCard: ' + JSON.stringify(this.props.card.categories))
    return (
      <ImageBackground source={getCuisine(this.props.card.categories)} style={[styles.card]}>
        <TouchableHighlight
          underlayColor="transparent"
          onPress={() => Linking.openURL(this.props.card.url)}
          style={styles.yelp}
        >
          <View style={styles.row}>
            <Text style={styles.yelpText}>yelp</Text>
            <Icon name="yelp" style={styles.yelpIcon} />
          </View>
        </TouchableHighlight>
        <View style={styles.name}>
          <Text numberOfLines={2} style={styles.title}>
            {this.props.card.name}
          </Text>
          <View style={[styles.main, styles.row, styles.center]}>
            <Image source={getStarPath(this.props.card.rating)} style={styles.rating} />
            <Text numberOfLines={2} style={[styles.reviews, styles.text]}>
              {this.props.card.reviewCount} reviews
            </Text>
          </View>
          <View style={[styles.info, styles.row, styles.center]}>
            <Text style={[styles.price, styles.text]}>{this.props.card.price}</Text>
            <Text numberOfLines={2} style={[styles.categories, styles.text]}>
              • {this.evaluateCuisines(this.props.card.categories)}
            </Text>
          </View>
          <View style={[styles.info, styles.row, styles.center]}>
            <FontAwesomeIcon icon={faMapMarkerAlt} style={styles.icon} />
            <Text numberOfLines={1} style={[styles.infoText, styles.text]}>
              {this.props.card.distance} miles away — {this.props.card.city}
            </Text>
          </View>
          {this.props.card.transactions.length > 0 && (
            <View style={[styles.info, styles.center, styles.row]}>
              <FontAwesomeIcon icon={faUtensils} style={styles.icon} />
              <Text numberOfLines={2} style={[styles.infoText, styles.text]}>
                {this.evaluateTransactions(this.props.card.transactions)}
              </Text>
            </View>
          )}
        </View>
      </ImageBackground>
    )
  }
}

RoundCard.propTypes = {
  card: PropTypes.object,
}

const styles = StyleSheet.create({
  // Sizing is now based on aspect ratio
  card: {
    backgroundColor: '#fff',
    borderRadius: 15,
    borderWidth: 0,
    borderColor: '#000',
    aspectRatio: 5 / 7.5,
    elevation: 10,
    overflow: 'hidden',
  },
  image: {
    marginTop: '10%',
    alignSelf: 'center',
    height: Dimensions.get('window').width * 0.5,
    width: Dimensions.get('window').width * 0.5,
    borderRadius: 20,
  },
  title: {
    fontFamily: imgStyles.font.fontFamily,
    color: 'white',
    fontSize: Dimensions.get('window').width * 0.08,
    textAlign: 'left',
    fontWeight: 'bold',
    margin: '3%',
    marginLeft: 0,
  },
  info: { marginTop: '2%' },
  infoText: {
    fontSize: normalize(20),
    alignSelf: 'center',
  },
  icon: {
    alignSelf: 'center',
    fontFamily: imgStyles.font.fontFamily,
    fontSize: normalize(20),
    marginRight: '2%',
    color: 'white',
  },
  button: {
    borderRadius: 17,
    borderWidth: 2.5,
    alignSelf: 'center',
    margin: '3%',
  },
  yelp: { justifyContent: 'flex-start', margin: '2%' },
  row: { flexDirection: 'row' },
  yelpText: {
    fontFamily: imgStyles.font.fontFamily,
    color: 'black',
    fontSize: normalize(18),
  },
  yelpIcon: {
    color: 'red',
    fontSize: normalize(20),
    marginLeft: '1%',
  },
  main: { marginRight: '3%' },
  name: {
    marginLeft: '5%',
    justifyContent: 'flex-end',
    flex: 1,
    marginBottom: '5%',
  },
  rating: { marginRight: '2%', justifyContent: 'center' },
  reviews: {
    alignSelf: 'center',
    fontSize: normalize(17),
  },
  center: { alignItems: 'center' },
  price: { fontSize: normalize(23) },
  categories: {
    marginLeft: '1%',
    fontSize: normalize(18),
  },
  text: {
    fontFamily: 'CircularStd-Book',
    color: 'white',
  },
})
