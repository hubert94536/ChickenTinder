import React from 'react'
import { SafeAreaView, StyleSheet, Text, View } from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome'
import Swiper from 'react-native-deck-swiper'
import Card from './roundCard.js'
import socket from './socket.js'

const hex = '#F25763'
const font = 'CircularStd-Medium'

const restuarants = [
  {
    name: 'Chinchikurin',
    url:
      'https://www.yelp.com/biz/chinchikurin-little-tokyo-los-angeles-2?osq=chinchikurin',
    price: '$$',
    rating: 4.5,
    review_count: 177,
    distance: 10,
    categories: [{ title: 'Japanese' }],
    location: {
      city: 'Sawtelle'
    },
    id: 'Chinchikurin',
    is_closed: true,
    transactions: ['pickup', 'delivery']
  },
  {
    name: 'Padua Pasta Makers',
    url:
      'https://www.yelp.com/biz/chinchikurin-little-tokyo-los-angeles-2?osq=chinchikurin',
    price: '$$',
    rating: 4,
    review_count: 177,
    distance: 2,
    categories: [{ title: 'Italian' }],
    location: {
      city: 'Upland'
    },
    id: 'Padua Pasta Makers',
    is_closed: false,
    transactions: ['pickup', 'delivery']
  },
  {
    name: 'Din Tai Fung',
    url:
      'https://www.yelp.com/biz/chinchikurin-little-tokyo-los-angeles-2?osq=chinchikurin',
    price: '$$',
    rating: 4.5,
    review_count: 177,
    distance: 28.6,
    categories: [{ title: 'Chinese' }],
    location: {
      city: 'Arcadia'
    },
    id: 'Din Tai Fung',
    is_closed: false,
    transactions: ['pickup']
  },
  {
    name: 'BCD Tofu House',
    url:
      'https://www.yelp.com/biz/chinchikurin-little-tokyo-los-angeles-2?osq=chinchikurin',
    price: '$',
    rating: 3.6,
    review_count: 177,
    distance: 18.9,
    categories: [{ title: 'Korean' }],
    location: {
      city: 'Rowland Heights'
    },
    id: 'BCD Tofu House',
    is_closed: false,
    transactions: ['pickup']
  },
  {
    name: 'Zaky Mediterranean Grill',
    url:
      'https://www.yelp.com/biz/chinchikurin-little-tokyo-los-angeles-2?osq=chinchikurin',
    price: '$',
    rating: 3.5,
    review_count: 177,
    distance: 5,
    categories: [{ title: 'Mediterranean' }],
    location: {
      city: 'Upland'
    },
    id: 'Zaky Mediterranean Grill',
    is_closed: true,
    transactions: ['pickup', 'delivery']
  },
  {
    name: 'Riceberry Thai Kitchen',
    url:
      'https://www.yelp.com/biz/chinchikurin-little-tokyo-los-angeles-2?osq=chinchikurin',
    price: '$$$',
    rating: 4.7,
    review_count: 177,
    distance: 10,
    categories: [{ title: 'Thai' }],
    location: {
      city: 'Rancho Cucamonga'
    },
    id: 'Riceberry Thai Kitchen',
    is_closed: true,
    transactions: ['pickup', 'delivery']
  },
  {
    name: "Alina's Lebanese Cuisine",
    url:
      'https://www.yelp.com/biz/chinchikurin-little-tokyo-los-angeles-2?osq=chinchikurin',
    price: '$$',
    rating: 4.4,
    review_count: 177,
    distance: 4.6,
    categories: [{ title: 'Middle Eastern' }],
    location: {
      city: 'Ontario'
    },
    id: "Alina's Lebanese Cuisine",
    is_closed: false,
    transactions: ['pickup', 'delivery']
  },
  {
    name: "Leo's Taco Truck",
    url:
      'https://www.yelp.com/biz/chinchikurin-little-tokyo-los-angeles-2?osq=chinchikurin',
    price: '$',
    rating: 4.9,
    review_count: 177,
    distance: 47,
    categories: [{ title: 'Mexican' }],
    location: {
      city: 'Los Angeles'
    },
    id: "Leo's Taco Truck",
    is_closed: true,
    transactions: ['pickup']
  },
  {
    name: 'Aroma Grill',
    url:
      'https://www.yelp.com/biz/chinchikurin-little-tokyo-los-angeles-2?osq=chinchikurin',
    price: '$$',
    rating: 2.6,
    review_count: 177,
    distance: 6.7,
    categories: [{ title: 'Indian' }],
    location: {
      city: 'City of Industry'
    },
    id: 'Aroma Grill',
    is_closed: true,
    transactions: ['pickup', 'delivery']
  },
  {
    name: 'UPLAND GERMAN DELI',
    url:
      'https://www.yelp.com/biz/chinchikurin-little-tokyo-los-angeles-2?osq=chinchikurin',
    price: '$',
    rating: 4.5,
    review_count: 177,
    distance: 2.1,
    categories: [{ title: 'European' }],
    location: {
      city: 'Upland'
    },
    id: 'UPLAND GERMAN DELI',
    is_closed: true,
    transactions: ['pickup', 'delivery']
  },
  {
    name: 'Lotus Garden',
    url:
      'https://www.yelp.com/biz/chinchikurin-little-tokyo-los-angeles-2?osq=chinchikurin',
    price: '$$$',
    rating: 4.5,
    review_count: 177,
    distance: 2.1,
    categories: [{ title: 'Asian Fusion' }],
    location: {
      city: 'Upland'
    },
    id: 'Lotus Garden',
    is_closed: true,
    transactions: ['pickup', 'delivery', 'dine-in']
  },
  {
    name: 'In-N-Out Burger',
    url:
      'https://www.yelp.com/biz/chinchikurin-little-tokyo-los-angeles-2?osq=chinchikurin',
    price: '$',
    rating: 4.2,
    review_count: 177,
    distance: 2.1,
    categories: [{ title: 'American' }],
    location: {
      city: 'Upland'
    },
    id: 'In-N-Out Burger',
    is_closed: true,
    transactions: ['pickup']
  }
]

export default class RestaurantCard extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      index: 0,
      results: this.props.navigation.state.params.results,
      isHost: true
    }
    socket.getSocket().on('match', restaurant => {
      console.log(restaurant)
      this.props.navigation.navigate('Match', {match: restaurant})
      // TODO: connect match here
    })

    socket.getSocket().on('exception', error => {
      console.log(error)
    })
  }

  handleSwiped() {
    // transitionRef.current.animateNextTransition();
    this.setState({ index: this.state.index + 1 })
  }

  likeRestaurant(resId) {
    // uncomment and pass in host + restaurant id
    socket.likeRestaurant(this.state.host, resId)
  }

  endGroup() {
    socket.endSession();
    socket.getSocket().on('leave', res => {
      this.props.navigation.navigate('Home');
    });
  }

  leaveGroup () {
    socket.leaveRoom()
    this.props.navigation.navigate('Home')
  }

  render () {
    return (
      <SafeAreaView style={styles.mainContainer}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Icon
            name='angle-left'
            style={{
              color: hex,
              fontFamily: font,
              fontSize: 25,
              margin: '3%',
              fontWeight: 'bold'
            }}
            onPress={() => this.endGroup()}
          />
          <TouchableHighlight onPress={() => this.endGroup()}>
            <Text
              style={{
                color: hex,
                fontFamily: font,
                fontSize: 20,
                textAlign: 'left'
              }}
            >
              {this.state.isHost ? 'End' : 'Leave'}
            </Text>
          </TouchableHighlight>
        </View>
        <Swiper
          cards={this.state.results}
          cardIndex={this.state.index}
          renderCard={card => <Card card={card} />}
          onSwiper={this.handleSwiped}
          stackSize={10}
          disableBottomSwipe
          disableTopSwipe
          onSwipedRight={(cardIndex) => this.likeRestaurant(this.state.results[cardIndex].id)}
          stackSeparation={0}
          backgroundColor='transparent'
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
                  fontSize: 24
                },
                wrapper: {
                  flexDirection: 'column',
                  alignItems: 'flex-end',
                  justifyContent: 'flex-start',
                  marginTop: 20,
                  marginLeft: -50
                }
              }
            },
            right: {
              title: 'LIKE',
              style: {
                label: {
                  backgroundColor: 'green',
                  borderColor: 'green',
                  color: 'white',
                  borderWidth: 1,
                  fontSize: 24
                },
                wrapper: {
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  justifyContent: 'flex-start',
                  marginTop: 20,
                  marginLeft: 20
                }
              }
            },
            bottom: {
              title: 'HATE',
              style: {
                label: {
                  backgroundColor: 'black',
                  borderColor: 'black',
                  color: 'white',
                  borderWidth: 1,
                  fontSize: 24
                },
                wrapper: {
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'flex-start',
                  marginTop: 20,
                  marginLeft: -20
                }
              }
            },
            top: {
              title: 'LOVE',
              style: {
                label: {
                  backgroundColor: 'pink',
                  borderColor: 'pink',
                  color: 'white',
                  borderWidth: 1,
                  fontSize: 24
                },
                wrapper: {
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'flex-end',
                  marginTop: -50,
                  marginLeft: -20
                }
              }
            }
          }}
        />
        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginBottom: '5%' }}>
          <Icon name='chevron-left' style={{ fontFamily: font, color: hex, fontSize: 18, marginRight: '5%' }} />
          <Text
            style={{
              color: hex,
              fontFamily: font,
              fontSize: 20
            }}
          >
            Swipe!
          </Text>
          <Icon name='chevron-right' style={{ fontFamily: font, color: hex, fontSize: 18, marginLeft: '5%' }} />
        </View>
      </SafeAreaView>
    )
  }
}

const styles = StyleSheet.create({
  // Fullscreen
  mainContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
    backgroundColor: 'white'
  }

  // Card area is now flexsized and takes 90% of the width of screen
  // cardContainer: {
  //   backgroundColor: hex,
  //   borderRadius: 17,
  //   height: '75%',
  //   alignSelf: 'center',
  //   width: '90%',
  //   height: '80%',
  // },
})
