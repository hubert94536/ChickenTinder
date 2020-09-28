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
  TouchableHighlight,
  PermissionsAndroid,
} from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import TagsView from './TagsView';
import Slider from 'react-native-slider';
import BackgroundButton from './BackgroundButton';

const hex = '#F25763';
const font = 'CircularStd-Bold';

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
      isHost: true,
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
      <View style={styles.mainContainer}>
        <View style={styles.titleStyle}>
          <Text style={styles.titleText}>
            {this.state.isHost ? 'Group Settings' : 'Set Your Filters'}
          </Text>
          {this.state.isHost && (
            <Text style={styles.titleSub}>(only visible to host)</Text>
          )}
        </View>
        {this.state.isHost && (
          <View style={{flex: 0.5, margin: '2%'}}>
            <Text style={styles.header}>Members</Text>
            <TouchableHighlight
              underlayColor={'white'}
              style={styles.touchableFriends}>
              <Text style={styles.touchableFriendsText}>
                Select from Friends
              </Text>
            </TouchableHighlight>
          </View>
        )}
        <View style={{flex: 1, margin: '2%'}}>
          <Text style={this.state.isHost ? styles.header : styles.headerFalse}>
            Cuisines
          </Text>
          <TagsView
            all={tagsCuisine}
            selected={this.state.selectedCuisine}
            isExclusive={false}
          />
        </View>
        {this.state.isHost && (
          <View style={{flex: 0.5, margin: '2%'}}>
            <View style={{flexDirection: 'row'}}>
              <Text style={styles.header}>Distance</Text>
              <Text
                style={{
                  color: 'white',
                  fontFamily: font,
                  alignSelf: 'center',
                  marginLeft: '1%',
                }}>
                ({this.state.distance} miles)
              </Text>
            </View>
            <Slider
              style={{
                width: '85%',
                height: 30,
                alignSelf: 'center',
              }}
              minimumValue={5}
              maximumValue={25}
              value={5}
              step={0.5}
              minimumTrackTintColor="white"
              thumbTintColor="white"
              onValueChange={value => this.setState({distance: value})}
            />
          </View>
        )}
        {this.state.isHost && (
          <View style={{flex: 0.5, margin: '2%'}}>
            <Text style={styles.header}>Dining Options</Text>
            <TagsView
              all={tagsDining}
              selected={this.state.selectedDining}
              isExclusive={false}
            />
          </View>
        )}
        {this.state.isHost && (
          <View style={{flex: 0.5, margin: '2%'}}>
            <Text style={styles.header}>Price</Text>
            <TagsView
              all={tagsPrice}
              selected={this.state.selectedPrice}
              isExclusive={false}
            />
          </View>
        )}
        <View style={{flex: 1, margin: '2%'}}>
          <Text style={this.state.isHost ? styles.header : styles.headerFalse}>
            Dietary Restrictions
          </Text>
          <TagsView
            all={tagsDiet}
            selected={this.state.selectedDiet}
            isExclusive={false}
          />
        </View>
        <TouchableHighlight underlayColor={'white'} style={styles.touchable}>
          <Text style={styles.nextTitle}>
            {this.state.isHost ? "Let's Go" : 'Submit Filters'}
          </Text>
        </TouchableHighlight>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  //Fullscreen
  mainContainer: {
    flex: 1,
    backgroundColor: hex,
    justifyContent: 'space-between',
  },
  titleStyle: {
    flexDirection: 'row',
    flex: 0.5,
    margin: '2%',
    alignItems: 'center',
  },
  titleText: {
    fontFamily: font,
    fontSize: 28,
    color: 'white',
  },
  titleSub: {
    fontFamily: font,
    color: 'white',
    alignSelf: 'center',
    margin: '1%',
  },
  touchableFriends: {
    borderWidth: 2,
    borderRadius: 25,
    borderColor: 'white',
    alignSelf: 'center',
    width: '60%',
    margin: '1%',
  },
  touchableFriendsText: {
    color: 'white',
    fontFamily: font,
    fontSize: 18,
    alignSelf: 'center',
    paddingTop: '2%',
    paddingBottom: '2%',
  },
  header: {
    textAlign: 'left',
    color: 'white',
    fontSize: 18,
    fontFamily: font,
  },
  headerFalse: {
    textAlign: 'left',
    color: 'white',
    fontSize: 25,
    fontFamily: font,
  },
  touchable: {
    width: '50%',
    alignSelf: 'center',
    borderColor: 'white',
    borderWidth: 2,
    borderRadius: 25,
    justifyContent: 'center',
    margin: '4%',
  },
  nextTitle: {
    textAlign: 'center',
    color: 'white',
    fontSize: 25,
    fontFamily: font,
    paddingTop: '2%',
    paddingBottom: '2%',
  },
});
