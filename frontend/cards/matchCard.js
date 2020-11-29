import React from 'react'
import { Dimensions, ImageBackground, Image, StyleSheet, Text, View } from 'react-native'
import { faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import PropTypes from 'prop-types'

const font = 'CircularStd-Medium'

export default class MatchCard extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      card: this.props.card,
    }
  }

  // getting which stars to display
  getStarPath(rating) {
    switch (rating) {
      case 0:
        return require('../assets/stars/0.png')
      case 1:
        return require('../assets/stars/1.png')
      case 1.5:
        return require('../assets/stars/1.5.png')
      case 2:
        return require('../assets/stars/2.png')
      case 2.5:
        return require('../assets/stars/2.5.png')
      case 3:
        return require('../assets/stars/3.png')
      case 3.5:
        return require('../assets/stars/3.5.png')
      case 4:
        return require('../assets/stars/4.png')
      case 4.5:
        return require('../assets/stars/4.5.png')
      case 5:
        return require('../assets/stars/5.png')
    }
  }

  // get image based on cuisine
  getCuisine(category) {
    switch (category) {
      case 'American':
        return require('../assets/images/american.png')
      case 'Asian Fusion':
        return require('../assets/images/asianFusion.png')
      case 'Chinese':
        return require('../assets/images/chinese.png')
      case 'European':
        return require('../assets/images/european.png')
      case 'Indian':
        return require('../assets/images/indian.png')
      case 'Italian':
        return require('../assets/images/italian.png')
      case 'Japanese':
        return require('../assets/images/japanese.png')
      case 'Korean':
        return require('../assets/images/korean.png')
      case 'Mediterranean':
        return require('../assets/images/mediterranean.png')
      case 'Mexican':
        return require('../assets/images/mexican.png')
      case 'Middle Eastern':
        return require('../assets/images/middleEastern.png')
      case 'Thai':
        return require('../assets/images/thai.png')
    }
  }

  evaluateCuisines(cuisines) {
    return cuisines.map((item) => item.title).join(', ')
  }

  render() {
    const { card } = this.props

    return (
      <ImageBackground source={this.getCuisine(card.categories[0].title)} style={[styles.card]}>
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
              source={this.getStarPath(card.rating)}
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
