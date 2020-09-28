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
import TimePicker from 'react-native-simple-time-picker';

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
      hour: 23,
      minute: 59,
      time: 235900, //unix time
      lat: 0,
      long: 0,
      selectedCuisine: [], //array
      selectedPrice: [], //string "1,2,3"
      price: null, //string of prices
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

  evaluateFilters() {
    this.setState({
      time: parseInt(
        JSON.stringify(this.state.hour) +
          JSON.stringify(this.state.minute) +
          '00',
      ),
    });
    var prices = '';
    for (var i = 0; i < this.state.selectedPrice.length; i++) {
      switch (this.state.selectedPrice[i]) {
        case '$':
          prices += '1';
          break;
        case '$$':
          if (prices === '') {
            prices += '2';
          } else {
            prices += ',2';
          }
          break;
        case '$$$':
          if (prices === '') {
            prices += '3';
          } else {
            prices += ',3';
          }
          break;
        case '$$$$':
          if (prices === '') {
            prices += '4';
          } else {
            prices += ',4';
          }
          break;
        case 'Any':
          prices = '1,2,3,4';
          break;
      }
    }
    this.setState({price: prices});
    console.log(this.state.price);
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
        <ScrollView>
          {this.state.isHost && (
            <View style={{margin: '2%'}}>
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
          <View style={{margin: '2%'}}>
            <Text style={styles.header}>Cuisines</Text>
            <TagsView
              all={tagsCuisine}
              selected={this.state.selectedCuisine}
              isExclusive={false}
            />
          </View>
          {this.state.isHost && (
            <View style={{margin: '2%'}}>
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
            <View style={{margin: '2%'}}>
              <Text style={styles.header}>
                Open at: {this.state.hour}:{this.state.minute}
              </Text>
              <TimePicker
                selectedHours={this.state.hour}
                selectedMinutes={this.state.minute}
                onChange={(hours, minutes) =>
                  this.setState({
                    hour: hours,
                    minute: minutes,
                  })
                }
              />
            </View>
          )}
          {this.state.isHost && (
            <View style={{margin: '2%'}}>
              <Text style={styles.header}>Price</Text>
              <TagsView
                all={tagsPrice}
                selected={this.state.selectedPrice}
                isExclusive={false}
              />
            </View>
          )}
          <View style={{margin: '2%'}}>
            <Text style={styles.header}>Dietary Restrictions</Text>
            <TagsView
              all={tagsDiet}
              selected={this.state.selectedDiet}
              isExclusive={false}
            />
          </View>
        </ScrollView>
        <TouchableHighlight
          underlayColor={'white'}
          style={styles.touchable}
          onPress={() => this.evaluateFilters()}>
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
    margin: '5%',
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
    marginTop: '5%',
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
    fontSize: 25,
    margin: '1%',
    fontFamily: font,
  },
  touchable: {
    width: '50%',
    alignSelf: 'center',
    borderColor: 'white',
    borderWidth: 2,
    borderRadius: 25,
    justifyContent: 'center',
    margin: '5%',
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
