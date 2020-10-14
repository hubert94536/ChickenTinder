import React from 'react'
import { Dimensions, Image, Linking, StyleSheet, Text, View } from 'react-native'
import { faMapMarkerAlt, faUtensils } from '@fortawesome/free-solid-svg-icons'
import { faStar } from '@fortawesome/free-regular-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import Icon from 'react-native-vector-icons/FontAwesome'
import { TouchableHighlight } from 'react-native-gesture-handler'

// const hex = '#F25763'
const font = 'CircularStd-Medium'

export default class Card extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      press: false,
    }
  }

  // getting which stars to display
  getStarPath(rating) {
    switch (rating) {
      case 0:
        return require('./assets/stars/0.png')
      case 1:
        return require('./assets/stars/1.png')
      case 1.5:
        return require('./assets/stars/1.5.png')
      case 2:
        return require('./assets/stars/2.png')
      case 2.5:
        return require('./assets/stars/2.5.png')
      case 3:
        return require('./assets/stars/3.png')
      case 3.5:
        return require('./assets/stars/3.5.png')
      case 4:
        return require('./assets/stars/4.png')
      case 4.5:
        return require('./assets/stars/4.5.png')
      case 5:
        return require('./assets/stars/5.png')
    }
  }

  // get image based on cuisine
  getCuisine(category) {
    switch (category) {
      case 'American':
        return require('./assets/images/american.png')
      case 'Asian Fusion':
        return require('./assets/images/asianFusion.png')
      case 'Chinese':
        return require('./assets/images/chinese.png')
      case 'European':
        return require('./assets/images/european.png')
      case 'Indian':
        return require('./assets/images/indian.png')
      case 'Italian':
        return require('./assets/images/italian.png')
      case 'Japanese':
        return require('./assets/images/japanese.png')
      case 'Korean':
        return require('./assets/images/korean.png')
      case 'Mediterranean':
        return require('./assets/images/mediterranean.png')
      case 'Mexican':
        return require('./assets/images/mexican.png')
      case 'Middle Eastern':
        return require('./assets/images/middleEastern.png')
      case 'Thai':
        return require('./assets/images/thai.png')
    }
  }

  //   {
  //     name: 'Chinchikurin',
  //     url:
  //       'https://www.yelp.com/biz/chinchikurin-little-tokyo-los-angeles-2?osq=chinchikurin',
  //     image: require('./assets/images/japanese.png'),
  //     stars: require('./assets/stars/4.5.png'),
  //     price: '$$',
  //     rating: 4.5,
  //     review_count: 177,
  //     distance: 10,
  //     categories: [{title: 'Japanese'}],
  //     location: {
  //       city: 'Sawtelle',
  //     },
  //     is_closed: true,
  //     transactions: ['pickup', 'delivery'],
  //   },

  // for each transaction, put into comma-separated string
  evaluateTransactions(transactions) {
    return transactions.map((item) => item).join(', ')
  }

  render() {
    // while (restuarants.length == 0) {
    //   return (
    //     <View style={styles.card}>
    //       <Text
    //         style={{
    //           fontFamily: font,
    //           color: hex,
    //           textAlign: 'center',
    //           fontSize: 40,
    //           marginTop: '30%',
    //         }}>
    //         Fetching Restaurants!
    //       </Text>
    //     </View>
    //   );
    // }
    return (
      <View style={styles.card}>
        <Image source={this.getCuisine(this.props.card.categories[0].title)} style={styles.image} />
        <Text style={styles.title}>{this.props.card.name}</Text>
        <View
          style={{
            flexDirection: 'row',
            marginLeft: '10%',
            marginRight: '3%',
          }}
        >
          <Image
            source={this.getStarPath(this.props.card.rating)}
            style={{ marginRight: '2%', justifyContent: 'center' }}
          />
          <Text style={{ alignSelf: 'center', fontFamily: font, fontSize: 20 }}>
            {this.props.card.price}
          </Text>
        </View>
        <Text style={{ marginLeft: '10%', fontFamily: font, color: '#bebebe' }}>
          Based on {this.props.card.review_count} reviews
        </Text>
        <View style={styles.info}>
          <FontAwesomeIcon icon={faStar} style={styles.icon} />
          <Text style={styles.infoText}>{this.props.card.categories[0].title}</Text>
        </View>
        <View style={styles.info}>
          <FontAwesomeIcon icon={faMapMarkerAlt} style={styles.icon} />
          <Text style={styles.infoText}>
            {this.props.card.distance} miles — {this.props.card.location.city}
          </Text>
        </View>
        <View style={styles.info}>
          <FontAwesomeIcon icon={faUtensils} style={styles.icon} />
          <Text style={styles.infoText}>
            {this.evaluateTransactions(this.props.card.transactions)} available
          </Text>
        </View>
        <TouchableHighlight
          underlayColor="black"
          onShowUnderlay={() => this.setState({ press: true })}
          onHideUnderlay={() => this.setState({ press: false })}
          style={styles.button}
          onPress={() => Linking.openURL(this.props.card.url)}
        >
          <View
            style={{
              flexDirection: 'row',
              padding: '1%',
              paddingLeft: '3%',
              paddingRight: '3%',
            }}
          >
            <Icon name="yelp" style={{ color: 'red', fontSize: 18, marginRight: '2%' }} />
            <Text
              style={{
                fontFamily: font,
                fontSize: 15,
                fontWeight: 'bold',
                color: this.state.press ? 'white' : 'black',
              }}
            >
              See more on Yelp
            </Text>
          </View>
        </TouchableHighlight>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  // Sizing is now based on aspect ratio
  card: {
    backgroundColor: '#fff',
    borderRadius: 40,
    borderWidth: 0,
    borderColor: '#000',
    width: '100%',
    height: '90%',
    elevation: 10,
    marginTop: '2%',
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
    fontSize: 30,
    textAlign: 'left',
    fontWeight: 'bold',
    margin: '3%',
    marginLeft: '10%',
  },
  info: { flexDirection: 'row', marginTop: '2%', marginLeft: '10%' },
  infoText: {
    fontFamily: font,
    fontSize: 16,
    alignSelf: 'center',
  },
  icon: {
    alignSelf: 'center',
    fontFamily: font,
    fontSize: 18,
    marginRight: '2%',
  },
  button: {
    borderRadius: 17,
    borderWidth: 2.5,
    alignSelf: 'center',
    margin: '5%',
  },
})
