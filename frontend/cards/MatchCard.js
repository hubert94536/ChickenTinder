import { faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import React from 'react'
import { Dimensions, ImageBackground, Image, StyleSheet, Text, View } from 'react-native'
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
      case 'African':
        return require('../assets/images/matchcard/African.png')
      case 'Australian':
        return require('../assets/images/matchcard/Australian.png')
      case 'Bakery':
        return require('../assets/images/matchcard/Bakery.png')
      case 'French Bakery':
        return require('../assets/images/matchcard/BakeryFrench.png')
      case 'Breakfast':
        return require('../assets/images/matchcard/Breakfast.png')
      case 'British':
        return require('../assets/images/matchcard/British.png')
      case 'Burgers':
        return require('../assets/images/matchcard/BurgersAmerican.png')
      case 'Burmese':
        return require('../assets/images/matchcard/Burmese.png')
      case 'Cambodian':
        return require('../assets/images/matchcard/Cambodian.png')
      case 'Canadian':
        return require('../assets/images/matchcard/Canadian.png')
      case 'Caribbean':
        return require('../assets/images/matchcard/Caribbean.png')
      case 'Chicken':
        return require('../assets/images/matchcard/ChickenWings.png')
      case 'Chinese':
        return require('../assets/images/matchcard/ChineseDimSum.png')
      case 'Coffee':
      case 'Coffee & Tea':
      case 'Tea':
      case 'Cafe':
        return require('../assets/images/matchcard/CoffeeTeaCafes.png')
      case 'Cuban':
      case 'Latin American':
        return require('../assets/images/matchcard/CubanMexicanLatinAmerican.png')
      case 'Ethiopian':
        return require('../assets/images/matchcard/Ethiopian.png')
      case 'Filipino':
        return require('../assets/images/matchcard/Filipino.png')
      case 'French':
        return require('../assets/images/matchcard/French.png')
      case 'German':
        return require('../assets/images/matchcard/German.png')
      case 'Greek':
        return require('../assets/images/matchcard/Greek.png')
      case 'Halal':
        return require('../assets/images/matchcard/HalalMiddleEastern.png')
      case 'Hawaiian':
        return require('../assets/images/matchcard/Hawaiian.png')
      case 'Polynesian':
        return require('../assets/images/matchcard/HawaiianPolynesian.png')
      case 'Hot Dog':
        return require('../assets/images/matchcard/HotDogAmerican.png')
      case 'Indian':
        return require('../assets/images/matchcard/Indian.png')
      case 'Indonesian':
        return require('../assets/images/matchcard/Indonesian.png')
      case 'Irish':
        return require('../assets/images/matchcard/Irish.png')
      case 'Italian':
        return require('../assets/images/matchcard/ItalianNoodles.png')
      case 'Japanese':
        return require('../assets/images/matchcard/Japanese.png')
      case 'Japanese Noodles':
        return require('../assets/images/matchcard/JapaneseNoodles.png')
      case 'Korean':
        return require('../assets/images/matchcard/Korean.png')
      case 'Mediterranean':
        return require('../assets/images/matchcard/MediterraneanMiddleEastern.png')
      case 'Mexican':
        return require('../assets/images/matchcard/MexicanTacos.png')
      case 'Middle Eastern':
        return require('../assets/images/matchcard/MiddleEastern.png')
      case 'Mongolian':
        return require('../assets/images/matchcard/Mongolian.png')
      case 'Moroccan':
        return require('../assets/images/matchcard/Moroccan.png')
      case 'Peruvian':
        return require('../assets/images/matchcard/Peruvian.png')
      case 'Pizza':
        return require('../assets/images/matchcard/PizzaAmerican.png')
      case 'Polish':
        return require('../assets/images/matchcard/Polish.png')
      case 'Russian':
        return require('../assets/images/matchcard/Russian.png')
      case 'Salad':
        return require('../assets/images/matchcard/SaladAmerican.png')
      case 'Scandinavian':
      case 'Swedish':
        return require('../assets/images/matchcard/ScandinavianSwedish.png')
      case 'Sandwiches':
        return require('../assets/images/matchcard/SandwichesAmerican.png')
      case 'Seafood':
      case 'Cajun':
        return require('../assets/images/matchcard/SeafoodCajunAmerican.png')
      case 'Southern':
      case 'Soul Food':
        return require('../assets/images/matchcard/SouthernSoulFood.png')
      case 'Spanish':
        return require('../assets/images/matchcard/SpanishTapas.png')
      case 'Sri Lankan':
        return require('../assets/images/matchcard/SriLankan.png')
      case 'Steakhouse':
        return require('../assets/images/matchcard/Steakhouse.png')
      case 'Taiwanese':
        return require('../assets/images/matchcard/TaiwaneseChinese.png')
      case 'Thai':
        return require('../assets/images/matchcard/Thai.png')
      case 'Vietnamese':
        return require('../assets/images/matchcard/Vietnamese.png')
      default:
        return require('../assets/images/matchcard/General1.png')
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
