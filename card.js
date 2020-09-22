import React, {Component, useState, useEffect} from 'react';
import api from './api.js';
import Swiper from 'react-native-deck-swiper';
import {Transitioning, Transition} from 'react-native-reanimated';
import Icon from 'react-native-vector-icons/FontAwesome';
import {
  Image,
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  Dimensions,
  Linking,
} from 'react-native';
import {TouchableHighlight} from 'react-native-gesture-handler';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faUtensils, faMapMarkerAlt} from '@fortawesome/free-solid-svg-icons';
import {faStar} from '@fortawesome/free-regular-svg-icons';

const hex = '#F25763';
const font = 'CircularStd-Medium';

const restuarants = [
  {
    name: 'Chinchikurin',
    url:
      'https://www.yelp.com/biz/chinchikurin-little-tokyo-los-angeles-2?osq=chinchikurin',
    image: require('./assets/images/japanese.png'),
    stars: require('./assets/stars/4.5.png'),
    price: '$$',
    rating: 4.5,
    review_count: 177,
    distance: 10,
    categories: [{title: 'Japanese'}],
    location: {
      city: 'Sawtelle',
    },
    is_closed: true,
    transactions: ['pickup', 'delivery'],
  },
  {
    name: 'Padua Pasta Makers',
    url:
      'https://www.yelp.com/biz/chinchikurin-little-tokyo-los-angeles-2?osq=chinchikurin',
    image: require('./assets/images/italian.png'),
    stars: require('./assets/stars/4.png'),
    price: '$$',
    rating: 4,
    review_count: 177,
    distance: 2,
    categories: [{title: 'Italian'}],
    location: {
      city: 'Upland',
    },
    is_closed: false,
    transactions: ['pickup', 'delivery'],
  },
  {
    name: 'Din Tai Fung',
    url:
      'https://www.yelp.com/biz/chinchikurin-little-tokyo-los-angeles-2?osq=chinchikurin',
    image: require('./assets/images/chinese.png'),
    stars: require('./assets/stars/4.5.png'),
    price: '$$',
    rating: 4.5,
    review_count: 177,
    distance: 28.6,
    categories: [{title: 'Chinese'}],
    location: {
      city: 'Arcadia',
    },
    is_closed: false,
    transactions: ['pickup'],
  },
  {
    name: 'BCD Tofu House',
    url:
      'https://www.yelp.com/biz/chinchikurin-little-tokyo-los-angeles-2?osq=chinchikurin',
    image: require('./assets/images/korean.png'),
    stars: require('./assets/stars/3.5.png'),
    price: '$',
    rating: 3.6,
    review_count: 177,
    distance: 18.9,
    categories: [{title: 'Korean'}],
    location: {
      city: 'Rowland Heights',
    },
    is_closed: false,
    transactions: ['pickup'],
  },
  {
    name: 'Zaky Mediterranean Grill',
    url:
      'https://www.yelp.com/biz/chinchikurin-little-tokyo-los-angeles-2?osq=chinchikurin',
    image: require('./assets/images/mediterranean.png'),
    stars: require('./assets/stars/3.5.png'),
    price: '$',
    rating: 3.5,
    review_count: 177,
    distance: 5,
    categories: [{title: 'Mediterranean'}],
    location: {
      city: 'Upland',
    },
    is_closed: true,
    transactions: ['pickup', 'delivery'],
  },
  {
    name: 'Riceberry Thai Kitchen',
    url:
      'https://www.yelp.com/biz/chinchikurin-little-tokyo-los-angeles-2?osq=chinchikurin',
    image: require('./assets/images/thai.png'),
    stars: require('./assets/stars/4.5.png'),
    price: '$$$',
    rating: 4.7,
    review_count: 177,
    distance: 10,
    categories: [{title: 'Thai'}],
    location: {
      city: 'Rancho Cucamonga',
    },
    is_closed: true,
    transactions: ['pickup', 'delivery'],
  },
  {
    name: "Alina's Lebanese Cuisine",
    url:
      'https://www.yelp.com/biz/chinchikurin-little-tokyo-los-angeles-2?osq=chinchikurin',
    image: require('./assets/images/middle-eastern.png'),
    stars: require('./assets/stars/4.5.png'),
    price: '$$',
    rating: 4.4,
    review_count: 177,
    distance: 4.6,
    categories: [{title: 'Middle Eastern'}],
    location: {
      city: 'Ontario',
    },
    is_closed: false,
    transactions: ['pickup', 'delivery'],
  },
  {
    name: "Leo's Taco Truck",
    url:
      'https://www.yelp.com/biz/chinchikurin-little-tokyo-los-angeles-2?osq=chinchikurin',
    image: require('./assets/images/mexican.png'),
    stars: require('./assets/stars/5.png'),
    price: '$',
    rating: 4.9,
    review_count: 177,
    distance: 47,
    categories: [{title: 'Mexican'}],
    location: {
      city: 'Los Angeles',
    },
    is_closed: true,
    transactions: ['pickup'],
  },
  {
    name: 'Aroma Grill',
    url:
      'https://www.yelp.com/biz/chinchikurin-little-tokyo-los-angeles-2?osq=chinchikurin',
    image: require('./assets/images/indian.png'),
    stars: require('./assets/stars/2.5.png'),
    price: '$$',
    rating: 2.6,
    review_count: 177,
    distance: 6.7,
    categories: [{title: 'Indian'}],
    location: {
      city: 'City of Industry',
    },
    is_closed: true,
    transactions: ['pickup', 'delivery'],
  },
  {
    name: 'UPLAND GERMAN DELI',
    url:
      'https://www.yelp.com/biz/chinchikurin-little-tokyo-los-angeles-2?osq=chinchikurin',
    image: require('./assets/images/european.png'),
    stars: require('./assets/stars/4.5.png'),
    price: '$',
    rating: 4.5,
    review_count: 177,
    distance: 2.1,
    categories: [{title: 'European'}],
    location: {
      city: 'Upland',
    },
    is_closed: true,
    transactions: ['pickup', 'delivery'],
  },
  {
    name: 'Lotus Garden',
    url:
      'https://www.yelp.com/biz/chinchikurin-little-tokyo-los-angeles-2?osq=chinchikurin',
    image: require('./assets/images/asian-fusion.png'),
    stars: require('./assets/stars/4.5.png'),
    price: '$$$',
    rating: 4.5,
    review_count: 177,
    distance: 2.1,
    categories: [{title: 'Asian Fusion'}],
    location: {
      city: 'Upland',
    },
    is_closed: true,
    transactions: ['pickup', 'delivery', 'dine-in'],
  },
  {
    name: 'In-N-Out Burger',
    url:
      'https://www.yelp.com/biz/chinchikurin-little-tokyo-los-angeles-2?osq=chinchikurin',
    image: require('./assets/images/american.png'),
    stars: require('./assets/stars/4.png'),
    price: '$',
    rating: 4.2,
    review_count: 177,
    distance: 2.1,
    categories: [{title: 'American'}],
    location: {
      city: 'Upland',
    },
    is_closed: true,
    transactions: ['pickup'],
  },
];

export default function RestaurantCard() {
  const [index, setIndex] = useState(0);
  const [results, setResults] = useState(restuarants);
  const [press, setPress] = useState(false);

  const Card = ({card}) => {
    while (results.length == 0) {
      return (
        <View style={styles.card}>
          <Text
            style={{
              fontFamily: font,
              color: hex,
              textAlign: 'center',
              fontSize: 40,
              marginTop: '30%',
            }}>
            Fetching Restaurants!
          </Text>
        </View>
      );
    }
    return (
      <View style={styles.card}>
        <Image source={card.image} style={styles.image} />
        <Text style={styles.title}>{card.name}</Text>
        <View
          style={{
            flexDirection: 'row',
            marginLeft: '10%',
            marginRight: '3%',
          }}>
          <Image
            source={card.stars}
            style={{marginRight: '2%', justifyContent: 'center'}}
          />
          <Text style={{alignSelf: 'center', fontFamily: font, fontSize: 20}}>
            {card.price}
          </Text>
        </View>
        <Text style={{marginLeft: '10%', fontFamily: font, color: '#bebebe'}}>
          Based on {card.review_count} reviews
        </Text>
        <View style={styles.info}>
          <FontAwesomeIcon icon={faStar} style={styles.icon} />
          <Text style={styles.infoText}>{card.categories[0].title}</Text>
        </View>
        <View style={styles.info}>
          <FontAwesomeIcon icon={faMapMarkerAlt} style={styles.icon} />
          <Text style={styles.infoText}>
            {card.distance} miles — {card.location.city}
          </Text>
        </View>
        <View style={styles.info}>
          <FontAwesomeIcon icon={faUtensils} style={styles.icon} />
          <Text style={styles.infoText}>{card.transactions} available</Text>
        </View>
        <TouchableHighlight
          underlayColor={'black'}
          onShowUnderlay={() => setPress(true)}
          onHideUnderlay={() => setPress(false)}
          style={styles.button}
          onPress={() => Linking.openURL(card.url)}>
          <View
            style={{
              flexDirection: 'row',
              padding: '1%',
              paddingLeft: '3%',
              paddingRight: '3%',
            }}>
            <Icon
              name="yelp"
              style={{color: 'red', fontSize: 18, marginRight: '2%'}}
            />
            <Text
              style={{
                fontFamily: font,
                fontSize: 15,
                fontWeight: 'bold',
                color: press ? 'white' : 'black',
              }}>
              See more on Yelp
            </Text>
          </View>
        </TouchableHighlight>
      </View>
    );
  };

  const onSwiped = () => {
    // transitionRef.current.animateNextTransition();
    setIndex(index + 1);
  };
  return (
    <SafeAreaView style={styles.mainContainer}>
      <View style={styles.cardContainer}>
        <Swiper
          cards={results}
          cardIndex={index}
          renderCard={card => <Card card={card} />}
          onSwiper={onSwiped}
          stackSize={10}
          stackSeparation={0}
          backgroundColor="transparent"
          animateOverlayLabelsOpacity
          // Overlay offsets adjusted to flex sizing. May need to be retested on different device
          overlayLabels={{
            left: {
              title: 'NOPE',
              style: {
                label: {
                  backgroundColor: 'red',
                  borderColor: 'red',
                  color: 'white',
                  borderWidth: 1,
                  fontSize: 24,
                },
                wrapper: {
                  flexDirection: 'column',
                  alignItems: 'flex-end',
                  justifyContent: 'flex-start',
                  marginTop: 20,
                  marginLeft: -50,
                },
              },
            },
            right: {
              title: 'LIKE',
              style: {
                label: {
                  backgroundColor: 'green',
                  borderColor: 'green',
                  color: 'white',
                  borderWidth: 1,
                  fontSize: 24,
                },
                wrapper: {
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  justifyContent: 'flex-start',
                  marginTop: 20,
                  marginLeft: 20,
                },
              },
            },
            bottom: {
              title: 'HATE',
              style: {
                label: {
                  backgroundColor: 'black',
                  borderColor: 'black',
                  color: 'white',
                  borderWidth: 1,
                  fontSize: 24,
                },
                wrapper: {
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'flex-start',
                  marginTop: 20,
                  marginLeft: -20,
                },
              },
            },
            top: {
              title: 'LOVE',
              style: {
                label: {
                  backgroundColor: 'pink',
                  borderColor: 'pink',
                  color: 'white',
                  borderWidth: 1,
                  fontSize: 24,
                },
                wrapper: {
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'flex-end',
                  marginTop: -50,
                  marginLeft: -20,
                },
              },
            },
          }}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  // Fullscreen
  mainContainer: {
    flex: 1,
    backgroundColor: 'white',
  },

  // Card area is now flexsized and takes 90% of the width of screen
  cardContainer: {
    borderRadius: 17,
    borderWidth: 0,
    borderColor: '#000',
    width: '90%',
    height: '80%',
    alignItems: 'center',
  },

  // Sizing is now based on aspect ratio
  card: {
    backgroundColor: '#fff',
    borderRadius: 40,
    borderWidth: 0,
    borderColor: '#000',
    width: '100%',
    height: '100%',
    elevation: 10,
  },
  image: {
    marginTop: '10%',
    alignSelf: 'center',
    height: Dimensions.get('window').width * 0.6,
    width: Dimensions.get('window').width * 0.6,
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
  info: {flexDirection: 'row', marginTop: '2%', marginLeft: '10%'},
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
});
