/*
    Filter Selection Menu
*/

import React from 'react';
import {
    Image,
    SafeAreaView,
    StyleSheet,
    ScrollView,
    View,
    Text,
    StatusBar,
    Dimensions,
    Button,
    TouchableOpacity
  } from 'react-native';
import TagsView from './TagsView';
import Slider from '@react-native-community/slider';
import BackgroundButton from './BackgroundButton';

const SCREEN_WIDTH = Dimensions.get('window').width;

const selectedCuisine = []
const tagsCuisine = ['Japanese', 'Korean', 'Chinese', 'Thai', 'Mongolian', 'Taiwanese', 'Indian', 'Vietnamese']

const selectedDining = []
const tagsDining = ['Dine-in', 'Delivery', 'Catering', 'Pickup']

const selectedPrice = []
const tagsPrice = ['$', '$$', '$$$', '$$$$', 'Any']

const selectedDiet = []
const tagsDiet = ['Eggs', 'Nuts', 'Fish', 'Pork', 'Dairy', 'Chicken', 'Beef', 'Sesame', 'Gluten', 'Soy']

const mainColor = "#FB6767"


export default function filterSelector(){

    return (
        <SafeAreaView style={styles.mainContainer }>
        <View style={styles.cardContainer}>

          <Text style ={{fontFamily: 'CircularStd-Bold', fontSize: 28, color: 'white', paddingBottom:10, paddingLeft: SCREEN_WIDTH * 0.045}}> Set Your Filters</Text>
          <View style={styles.card}>
            <View style={styles.section}>
              <Text style={styles.header}>Cuisines</Text>
              <TagsView
                all={tagsCuisine}
                selected={selectedCuisine}
                isExclusive={false}
              />
            </View>

            <View style={[styles.section, styles.section2]}>
              <Text style={styles.header}>Distance</Text>
              <Slider
                style={{width: SCREEN_WIDTH*0.75, height: 30, alignSelf: 'center'}}
                minimumValue={5}
                maximumValue={25}
                value = {5}
                minimumTrackTintColor = "#FB6767"
                maximumTrackTintColor='#000000'
                thumbTintColor= "#FB6767"
            />  
            </View>

            <View style={[styles.section, styles.section2]}>
              <Text style={styles.header}>Dining Options</Text>
              <TagsView
                all={tagsDining}
                selected={selectedDining}
                isExclusive={false}
              />
            </View>

            <View style={[styles.section, styles.section2]}>
              <Text style={styles.header}>Price</Text>
              <TagsView
                all={tagsPrice}
                selected={selectedPrice}
                isExclusive={false}
              />
            </View>

            <View style={[styles.section]}>
              <Text style={styles.header}>Dietary Restrictions</Text>
              <TagsView
                all={tagsDiet}
                selected={selectedDiet}
                isExclusive={false}
              />
            </View>

            {/* <Button 
              title = "Let's Go"
              color = 'white'
              fontSize = 20;
            
            />
               */}

            {/* <TouchableOpacity style={styles.touchable}>
              <View style={styles.view}>
                <Text style={styles.text}>Let's Go</Text>
              </View>
            </TouchableOpacity> */}
          
          

          </View>
        </View>

        <View style = {{paddingTop: 10, width: 150, alignSelf: 'center'}}>
        {/* <BackgroundButton
          backgroundColor= 'white'
          textColor= 'pink'
          borderColor= 'transparent'
          // onPress={() => {
          //   this.onPress(tag)
          // }}
          title = "Let's Go" /> */}

          <TouchableOpacity style={styles.touchable}>
            <View style={styles.nextButton}>
            <Text style={styles.nextTitle}>Let's Go</Text>
            </View>
          </TouchableOpacity>

          </View>


        </SafeAreaView>
      )
  
}





const styles = StyleSheet.create({
  //Fullscreen
  mainContainer: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: mainColor,
  },
  //Card area is now flexsized and takes 90% of the width of screen
  cardContainer: {
   // backgroundColor: '#ff0',
    borderRadius: 17,
    borderWidth: 0,
    borderColor: '#000',
    justifyContent: 'flex-end',
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
    alignSelf: 'center',
    width: "90%",
    aspectRatio: 5/8,
    // justifyContent: 'center'
  },
  section: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: 'transparent',
    alignSelf: 'center',
    width: "100%",
    height:"27.5%",
    paddingHorizontal:10,
    paddingVertical:7.5,
    borderBottomColor: mainColor
  },

  section2: {
    height:"15%",
  },

  header: {
    textAlign: 'left',
    color: mainColor,
    fontSize: 18,
    fontFamily: 'CircularStd-Bold',
    // paddingTop: 10,
  },

  touchable: {
    // marginLeft: 4,
    marginRight: 8,
    marginBottom: 6

    // marginLeft: 3,
    // marginRight: 3,
    // marginBottom: 6
  },

  nextTitle: {
    // fontSize: 5,
    textAlign: 'center',
    color: 'white',
    // fontSize: 16
    fontSize: 18,
    fontFamily: 'CircularStd-Bold',
  },

  nextButton: {
    // flexDirection: 'row',
    // borderRadius: 23,
    borderColor: 'white',
    borderWidth: 2,
    borderRadius: 18,
    backgroundColor: mainColor,
    // height: 46,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    // paddingLeft: 16,
    // paddingRight: 16

    paddingHorizontal: 8
  },
});