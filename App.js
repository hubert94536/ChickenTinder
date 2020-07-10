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

        //Overlay offsets must be readjusted when we change to flex sizing
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
                marginTop: -50,
                marginLeft: -150
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
                marginTop: -50,
                marginLeft: -10
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
                marginTop: -50,
                marginLeft: -80
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
                justifyContent: 'center',
                marginTop: 10,
                marginLeft: -80
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

  //card area need to  change to flex sizing; based off of Hanna's box
  cardContainer: {
    borderRadius: 17,
    borderWidth: 0,
    borderColor: '#000',
    alignSelf: 'center',
    marginTop: 40,
    height: 400,
    width: 250,
  },

  //Actual card need to change to flex sizing
  //Current margins and alignment are to fix the offset need to change
  card: {
    backgroundColor: '#fff',
    borderRadius: 17,
    borderWidth: 0,
    borderColor: '#000',
    alignSelf: 'flex-start',
    marginLeft: -20,
    marginTop: -60,
    height: 400,
    width: 250,
  },

  //Default settings need  to fix alignment
  cardImage: {
    width: 160,
    flex: 1,
    resizeMode: 'contain'
  },
});
