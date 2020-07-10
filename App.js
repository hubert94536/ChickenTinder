/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import YelpApi from './api.js';
import Swiper from 'react-native-deck-swiper';
import { Transitioning, Transition } from 'react-native-reanimated';
import data from './data';
import{facebookService} from './facebookService.js';
import {
  Image,
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  Dimensions
} from 'react-native';


const Card = ({ card }) => {
  return (
    <View style={styles.card}>
      <Image source={{ uri: card.image }} style={styles.cardImage} />
    </View>
  );
};


facebookService.makeLoginButton();
export default function App()
{
  
  const[index, setIndex] = React.useState(0);

  const onSwiped = () => {
    // transitionRef.current.animateNextTransition();
    setIndex((index + 1));
  }
  return (
    <SafeAreaView style={styles.mainContainer}>
    <View style={styles.cardContainer}>
      <Swiper
        cards = {data}
        cardIndex= {index}
        renderCard= {(card) => <Card card= {card}/>}
        onSwiper = {onSwiped}
        stackSize = {10}
        stackSeparation = {0}
        backgroundColor= {'transparent'}

        animateOverlayLabelsOpacity

        //Overlay offsets adjusted to flex sizing. May need to be retested on different device
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
    </View>
    </SafeAreaView>
  );
}
 
const styles = StyleSheet.create({

  //Fullscreen
  mainContainer: {
    flex: 1,
    backgroundColor: '#000'
  },

  //Card area is now flexsized and takes 90% of the width of screen
  cardContainer: {
    borderRadius: 17,
    borderWidth: 0,
    borderColor: '#000',
    alignSelf: 'center',
    marginTop: 5,
    width: "90%",
    aspectRatio: 5/8,
  },

  //Sizing is now based on aspect ratio
  card: {
    backgroundColor: '#fff',
    borderRadius: 17,
    borderWidth: 0,
    borderColor: '#000',
    alignSelf: 'flex-start',
    width: "90%",
    aspectRatio: 5/8,
  },

  //Card image is now centered
  cardImage: {
    marginTop: 60,
    flex: 0.5,
    resizeMode: 'contain',
  },
});
