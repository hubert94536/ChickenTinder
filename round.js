import React from 'react'
import { SafeAreaView, StyleSheet, Text, View, TouchableHighlight } from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome'
import Swiper from 'react-native-deck-swiper'
import Card from './roundCard.js'
import socket from './socket.js'

const hex = '#F25763'
const font = 'CircularStd-Medium'

export default class RestaurantCard extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      index: 0,
      results: this.props.navigation.state.params.results,
      host: this.props.navigation.state.params.host,
      isHost: this.props.navigation.state.params.isHost,
    }
    socket.getSocket().on('match', (data) => {
      this.props.navigation.navigate('Match', { restaurant: data.restaurant })
    })

    socket.getSocket().on('exception', (error) => {
      console.log(error)
    })
  }

  handleSwiped() {
    // transitionRef.current.animateNextTransition();
    this.setState({ index: this.state.index + 1 })
  }

  likeRestaurant(resId) {
    socket.likeRestaurant(this.state.host, resId)
  }

  endGroup() {
    socket.endSession()
    socket.getSocket().on('leave', (res) => {
      this.props.navigation.navigate('Home')
    })
  }

  leaveGroup() {
    socket.leaveRoom()
    this.props.navigation.navigate('Home')
  }

  render() {
    return (
      <SafeAreaView style={styles.mainContainer}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Icon
            name="angle-left"
            style={{
              color: hex,
              fontFamily: font,
              fontSize: 25,
              margin: '3%',
              fontWeight: 'bold',
            }}
            onPress={() => this.endGroup()}
          />
          <TouchableHighlight onPress={() => this.endGroup()}>
            <Text
              style={{
                color: hex,
                fontFamily: font,
                fontSize: 20,
                textAlign: 'left',
              }}
            >
              {this.state.isHost ? 'End' : 'Leave'}
            </Text>
          </TouchableHighlight>
        </View>
        <Swiper
          cards={this.state.results}
          cardIndex={this.state.index}
          renderCard={(card) => <Card card={card} />}
          onSwiper={this.handleSwiped}
          stackSize={10}
          disableBottomSwipe
          disableTopSwipe
          onSwipedRight={(cardIndex) => this.likeRestaurant(this.state.results[cardIndex].id)}
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
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: '5%',
          }}
        >
          <Icon
            name="chevron-left"
            style={{ fontFamily: font, color: hex, fontSize: 18, marginRight: '5%' }}
          />
          <Text
            style={{
              color: hex,
              fontFamily: font,
              fontSize: 20,
            }}
          >
            Swipe!
          </Text>
          <Icon
            name="chevron-right"
            style={{ fontFamily: font, color: hex, fontSize: 18, marginLeft: '5%' }}
          />
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
})
