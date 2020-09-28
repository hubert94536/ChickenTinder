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
  TouchableOpacity,
  PermissionsAndroid,
} from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import TagsView from './TagsView';
import Slider from 'react-native-slider';
import BackgroundButton from './BackgroundButton';

const hex = '#F25763';
const font = 'CircularStd-Medium';

const SCREEN_WIDTH = Dimensions.get('window').width;

const tagsCuisine = [
  'Japanese',
  'Korean',
  'Chinese',
  'Thai',
  'Mongolian',
  'Taiwanese',
  'Indian',
  'Vietnamese',
];

const tagsDining = ['Dine-in', 'Delivery', 'Catering', 'Pickup'];

const tagsPrice = ['$', '$$', '$$$', '$$$$', 'Any'];

const tagsDiet = [
  'Eggs',
  'Nuts',
  'Fish',
  'Pork',
  'Dairy',
  'Chicken',
  'Beef',
  'Sesame',
  'Gluten',
  'Soy',
];

const requestLocationPermission = async () => {
  await PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    {
      title: 'Location Permission',
      message:
        'WeChews needs access to your location ' +
        'so you can find nearby restaurants.',
      buttonNeutral: 'Ask Me Later',
      buttonNegative: 'Cancel',
      buttonPositive: 'OK',
    },
  ).then(res => {
    if (res === PermissionsAndroid.RESULTS.GRANTED) {
      return true;
    } else {
      return false;
    }
  });
};

export default class FilterSelector extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isHost: false,
      distance: 5,
      lat: 0,
      long: 0,
      selectedCuisine: [],
      selectedDining: [],
      selectedPrice: [],
      selectedDiet: [],
    };
  }

  componentDidMount() {
    if (requestLocationPermission()) {
      Geolocation.getCurrentPosition(
        position => {
          this.setState({
            long: position.coords.longitude,
            lat: position.coords.latitude,
          });
        },
        error => {
          console.log(error.code, error.message);
        },
        {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
      );
    }
  }

  render() {
    return (
      <SafeAreaView style={styles.mainContainer}>
        <View style={styles.cardContainer}>
          <View style={{flexDirection: 'row'}}>
            <Text
              style={{
                fontFamily: 'CircularStd-Bold',
                fontSize: 28,
                color: 'white',
                // paddingBottom: 10,
                paddingLeft: SCREEN_WIDTH * 0.045,
              }}>
              {this.state.isHost ? 'Group Settings' : 'Set Your Filters'}
            </Text>
            {this.state.isHost && (
              <Text
                style={{
                  fontFamily: font,
                  color: 'white',
                  alignSelf: 'center',
                }}>
                (only visible to host)
              </Text>
            )}
          </View>
          <View style={styles.card}>
            <View style={styles.section}>
              <Text style={styles.header}>Cuisines</Text>
              <TagsView
                all={tagsCuisine}
                selected={this.state.selectedCuisine}
                isExclusive={false}
              />
            </View>
            <View style={[styles.section, styles.section2]}>
              <View style={{flexDirection: 'row'}}>
                <Text style={styles.header}>Distance</Text>
                <Text
                  style={{
                    color: hex,
                    fontFamily: font,
                    alignSelf: 'center',
                    marginLeft: '1%',
                  }}>
                  ({this.state.distance} miles)
                </Text>
              </View>
              <Slider
                style={{
                  width: SCREEN_WIDTH * 0.75,
                  height: 30,
                  alignSelf: 'center',
                }}
                minimumValue={5}
                maximumValue={25}
                value={5}
                step={0.5}
                minimumTrackTintColor={hex}
                thumbTintColor={hex}
                onValueChange={value => this.setState({distance: value})}
              />
            </View>
            <View style={[styles.section, styles.section2]}>
              <Text style={styles.header}>Dining Options</Text>
              <TagsView
                all={tagsDining}
                selected={this.state.selectedDining}
                isExclusive={false}
              />
            </View>
            <View style={[styles.section, styles.section2]}>
              <Text style={styles.header}>Price</Text>
              <TagsView
                all={tagsPrice}
                selected={this.state.selectedPrice}
                isExclusive={false}
              />
            </View>
            <View style={[styles.section]}>
              <Text style={styles.header}>Dietary Restrictions</Text>
              <TagsView
                all={tagsDiet}
                selected={this.state.selectedDiet}
                isExclusive={false}
              />
            </View>
          </View>
        </View>
        <View style={{paddingTop: 10, width: 150, alignSelf: 'center'}} />
        <TouchableOpacity style={styles.touchable}>
          <View style={styles.nextButton}>
            <Text style={styles.nextTitle}>
              {this.state.isHost ? "Let's Go" : 'Submit Filters'}
            </Text>
          </View>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  //Fullscreen
  mainContainer: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: hex,
  },
  //Card area is now flexsized and takes 90% of the width of screen
  cardContainer: {
    borderRadius: 17,
    borderWidth: 0,
    borderColor: '#000',
    justifyContent: 'flex-end',
    alignSelf: 'center',
    // marginTop: 5,
    width: '90%',
    // aspectRatio: 5 / 8,
  },
  //Sizing is now based on aspect ratio
  card: {
    backgroundColor: '#fff',
    borderRadius: 17,
    borderWidth: 0,
    borderColor: '#000',
    alignSelf: 'center',
    width: '90%',
    height: '85%',
    // aspectRatio: 5 / 8,
    // justifyContent: 'center'
  },
  section: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: 'transparent',
    alignSelf: 'center',
    width: '100%',
    height: '27.5%',
    paddingHorizontal: 10,
    paddingVertical: 7.5,
    borderBottomColor: hex,
  },

  section2: {
    height: '15%',
  },

  section3: {
    borderBottomColor: 'white',
  },

  header: {
    textAlign: 'left',
    color: hex,
    fontSize: 18,
    fontFamily: 'CircularStd-Bold',
    // paddingTop: 10,
  },

  touchable: {
    width: '40%',
    alignSelf: 'center',
    // marginLeft: 4,
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
    backgroundColor: hex,
    // height: 46,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    // paddingLeft: 16,
    // paddingRight: 16

    paddingHorizontal: 8,
  },
});
