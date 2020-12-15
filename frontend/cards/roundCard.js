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

const font = 'CircularStd-Medium'


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
      <ImageBackground source={this.props.card.image} style={[styles.card]}>
        <TouchableHighlight
          underlayColor="transparent"
          onPress={() => Linking.openURL(this.props.card.url)}
          style={{ justifyContent: 'flex-start', margin: '2%' }}
        >
          <View style={{ flexDirection: 'row' }}>
            <Text style={[{ fontFamily: font, color: 'black', fontSize: 18 }]}>yelp</Text>
            <Icon name="yelp" style={{ color: 'red', fontSize: 20, marginLeft: '1%' }} />
          </View>
        </TouchableHighlight>
        <View style={{ marginLeft: '5%', justifyContent: 'flex-end', flex: 1, marginBottom: '5%' }}>
          <Text numberOfLines={2} style={styles.title}>
            {this.props.card.name}
          </Text>
          <View
            style={{
              flexDirection: 'row',
              marginRight: '3%',
              alignItems: 'center',
            }}
          >
            <Image
              source={getStarPath(this.props.card.rating)}
              style={{ marginRight: '2%', justifyContent: 'center' }}
            />
            <Text
              numberOfLines={2}
              style={{
                alignSelf: 'center',
                fontFamily: 'CircularStd-Book',
                fontSize: 17,
                color: 'white',
              }}
            >
              {this.props.card.reviewCount} reviews
            </Text>
          </View>
          <View style={[styles.info, { alignItems: 'center' }]}>
            <Text style={{ fontFamily: 'CircularStd-Book', color: 'white', fontSize: 23 }}>
              {this.props.card.price}
            </Text>
            <Text
              numberOfLines={2}
              style={{
                marginLeft: '1%',
                fontFamily: 'CircularStd-Book',
                color: 'white',
                fontSize: 18,
              }}
            >
              • {this.evaluateCuisines(this.props.card.categories)}
            </Text>
          </View>
          <View style={styles.info}>
            <FontAwesomeIcon icon={faMapMarkerAlt} style={styles.icon} />
            <Text numberOfLines={1} style={styles.infoText}>
              {this.props.card.distance} miles away — {this.props.card.city}
            </Text>
          </View>
          {this.props.card.transactions.length > 0 && (
            <View style={styles.info}>
              <FontAwesomeIcon icon={faUtensils} style={styles.icon} />
              <Text numberOfLines={2} style={styles.infoText}>
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
    // width: '100%',
    // height: '85%',
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
    fontFamily: font,
    color: 'white',
    fontSize: Dimensions.get('window').width * 0.08,
    textAlign: 'left',
    fontWeight: 'bold',
    margin: '3%',
    marginLeft: 0,
  },
  info: { flexDirection: 'row', marginTop: '2%', alignItems: 'center' },
  infoText: {
    fontFamily: 'CircularStd-Book',
    fontSize: 20,
    alignSelf: 'center',
    color: 'white',
  },
  icon: {
    alignSelf: 'center',
    fontFamily: font,
    fontSize: 20,
    marginRight: '2%',
    color: 'white',
  },
  button: {
    borderRadius: 17,
    borderWidth: 2.5,
    alignSelf: 'center',
    margin: '3%',
  },
})
