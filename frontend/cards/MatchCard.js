import { faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import React from 'react'
import { Dimensions, ImageBackground, Image, StyleSheet, Text, View } from 'react-native'
import PropTypes from 'prop-types'
import getStarPath from '../assets/stars/star.js'
import getCuisine from '../assets/matchcard/foodImages.js'

const font = 'CircularStd-Medium'

export default class MatchCard extends React.Component {
  constructor(props) {
    super(props)
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
    const { card } = this.props

    return (
      <ImageBackground source={getCuisine(card.categories)} style={[styles.card]}>
        <View style={{ marginLeft: '5%', justifyContent: 'center', flex: 1, marginBottom: '4%' }}>
          <Text style={styles.title}>{card.name}</Text>
          <View
            style={{
              flexDirection: 'row',
              marginRight: '3%',
              alignItems: 'center',
            }}
          >
            <Image
              source={getStarPath(card.rating)}
              style={{ marginRight: '2%', justifyContent: 'center' }}
            />
            <Text
              style={{
                alignSelf: 'center',
                fontFamily: 'CircularStd-Book',
                fontSize: 17,
                color: 'white',
              }}
            >
              {card.reviewCount} reviews
            </Text>
          </View>
          <View style={[styles.info, { alignItems: 'center' }]}>
            <Text style={{ fontFamily: 'CircularStd-Book', color: 'white', fontSize: 23 }}>
              {card.price}
            </Text>
            <Text
              style={{
                marginLeft: '1%',
                fontFamily: 'CircularStd-Book',
                color: 'white',
                fontSize: 18,
              }}
            >
              • {this.evaluateCuisines(card.categories)}
            </Text>
          </View>
          <View style={styles.info}>
            <FontAwesomeIcon icon={faMapMarkerAlt} style={styles.icon} />
            <Text style={styles.infoText}>
              {card.distance} miles away — {card.city}
            </Text>
          </View>
        </View>
      </ImageBackground>
    )
  }
}

MatchCard.propTypes = {
  card: PropTypes.object,
}

const styles = StyleSheet.create({
  // Sizing is now based on aspect ratio
  card: {
    backgroundColor: 'lightgray',
    borderTopRightRadius: 14,
    borderTopLeftRadius: 14,
    aspectRatio: 14.5 / 8, //height/width ratio
    elevation: 10,
    overflow: 'hidden',
    marginBottom: '0.2%',
    width: '105%',
    alignSelf: 'center',
    alignItems: 'flex-start',
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
  info: {
    flexDirection: 'row',
    marginTop: '2%',
    alignItems: 'center',
  },
  infoText: {
    fontFamily: 'CircularStd-Book',
    fontSize: 18,
    alignSelf: 'center',
    color: 'white',
    marginHorizontal: '1%',
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
