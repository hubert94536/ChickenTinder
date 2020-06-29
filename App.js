/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import YelpApi from './api.js';

import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
} from 'react-native';


const Box = () => <View style={styles.boxSimple} elevation={5} />;
//test

    YelpApi.getRestaurants('coffee', 'fremont california').then((businesses) => {
      console.log(businesses.total);
    })
 
const styles = StyleSheet.create({
  boxSimple: {
    backgroundColor: '#fff',
    borderRadius: 17,
    borderWidth: 0,
    borderColor: '#000',
    alignSelf: 'center',
    marginTop: 40,
    height: 400,
    width: 250,
  },
});

export default Box; 
