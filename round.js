import React from 'react';
import Swiper from 'react-native-deck-swiper';
import {Transitioning, Transition} from 'react-native-reanimated';
import Icon from 'react-native-vector-icons/FontAwesome';
import {SafeAreaView, StyleSheet, Text, View} from 'react-native';
import Card from './roundCard.js';

const hex = '#F25763';
const font = 'CircularStd-Medium';

const restuarants = [
  {
    name: 'Chinchikurin',
    url:
      'https://www.yelp.com/biz/chinchikurin-little-tokyo-los-angeles-2?osq=chinchikurin',
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

export default class RestaurantCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      index: 0,
      results: restuarants,
      isHost: true,
    };
  }

  onSwiped = () => {
    // transitionRef.current.animateNextTransition();
    this.setState({index: this.state.index + 1});
  };

  render() {
    return (
      <SafeAreaView style={styles.mainContainer}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Icon
            name="angle-left"
            style={{
              color: hex,
              fontFamily: font,
              fontSize: 25,
              margin: '3%',
              fontWeight: 'bold',
            }}
            onPress={() => this.props.navigation.navigate('Home')}
          />
          <Text
            style={{
              color: hex,
              fontFamily: font,
              fontSize: 20,
              textAlign: 'left',
            }}>
            {this.state.isHost ? 'End' : 'Leave'}
          </Text>
        </View>
        <Swiper
          cards={this.state.results}
          cardIndex={this.state.index}
          renderCard={card => <Card card={card} />}
          onSwiper={this.onSwiped}
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
        <Text
          style={{
            color: hex,
            fontFamily: font,
            fontSize: 20,
            textAlign: 'center',
            marginBottom: '5%',
          }}>
          Swipe!
        </Text>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  // Fullscreen
  mainContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
    backgroundColor: 'white',
  },

  // Card area is now flexsized and takes 90% of the width of screen
  // cardContainer: {
  //   backgroundColor: hex,
  //   borderRadius: 17,
  //   height: '75%',
  //   alignSelf: 'center',
  //   width: '90%',
  //   height: '80%',
  // },
});