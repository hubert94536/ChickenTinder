import { faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import React from 'react'
import { Dimensions, ImageBackground, Image, StyleSheet, Text, View } from 'react-native'
import PropTypes from 'prop-types'
import getStarPath from '../assets/stars/star.js'
import getCuisine from '../assets/matchcard/foodImages.js'
import imgStyles from '../../styles/cardImage.js'
import normalize from '../../styles/normalize.js'

export default class MatchCard extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      press: false,
      displayCity: this.props.card.city.length <= 12,
    }
  }
  evaluateCuisines(cuisines) {
    return cuisines[0]
  }

  render() {
    const { card } = this.props

    return (
      <ImageBackground source={getCuisine(card.categories)} style={[styles.card]}>
        <View style={styles.container}>
          <Text style={styles.title} numberOfLines={1}>
            {card.name}
          </Text>
          <View style={styles.top}>
            <Image source={getStarPath(card.rating)} style={styles.img} />
            <Text style={[styles.review, styles.text]} numberOfLines={1}>
              {card.reviewCount} reviews
            </Text>
          </View>
          <View style={[styles.info, styles.center]}>
            <Text style={[styles.text, styles.price]}>{card.price}</Text>
            <Text style={[styles.text, styles.categories]}>
              • {this.evaluateCuisines(card.categories)}
            </Text>
          </View>
          <View style={styles.info}>
            <FontAwesomeIcon icon={faMapMarkerAlt} style={styles.icon} />
            {this.state.displayCity && (
              <Text style={[styles.infoText, styles.text]} numberOfLines={1}>
                {card.distance} miles away — {card.city}
              </Text>
            )}
            {!this.state.displayCity && (
              <Text style={[styles.infoText, styles.text]} numberOfLines={1}>
                {card.distance} miles away
              </Text>
            )}
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
  container: {
    marginLeft: '5%',
    justifyContent: 'center',
    flex: 1,
    marginBottom: '4%',
  },
  center: { alignItems: 'center' },
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
  top: {
    flexDirection: 'row',
    marginRight: '3%',
    alignItems: 'center',
  },
  text: {
    fontFamily: 'CircularStd-Book',
    color: 'white',
  },
  img: { marginRight: '2%', justifyContent: 'center' },
  price: { fontSize: normalize(23) },
  title: {
    fontFamily: imgStyles.font.fontFamily,
    color: 'white',
    fontSize: Dimensions.get('window').width * 0.08,
    textAlign: 'left',
    fontWeight: 'bold',
    margin: '3%',
    marginLeft: 0,
  },
  review: {
    alignSelf: 'center',
    fontSize: normalize(17),
  },
  info: {
    flexDirection: 'row',
    marginTop: '2%',
    alignItems: 'center',
  },
  infoText: {
    fontSize: normalize(18),
    alignSelf: 'center',
    marginHorizontal: '1%',
  },
  icon: {
    alignSelf: 'center',
    fontFamily: imgStyles.font.fontFamily,
    fontSize: normalize(20),
    marginRight: '2%',
    color: 'white',
  },
  categories: {
    marginLeft: '1%',
    fontSize: normalize(18),
  },
  button: {
    borderRadius: normalize(17),
    borderWidth: 2.5,
    alignSelf: 'center',
    margin: '3%',
  },
})
