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
import DropDownPicker from 'react-native-dropdown-picker';

const hex = '#F25763';
const font = 'CircularStd-Bold';

const hours = [
  {label: '0', value: '00'},
  {label: '1', value: '01'},
  {label: '2', value: '02'},
  {label: '3', value: '03'},
  {label: '4', value: '04'},
  {label: '5', value: '05'},
  {label: '6', value: '06'},
  {label: '7', value: '07'},
  {label: '8', value: '08'},
  {label: '9', value: '09'},
  {label: '10', value: '10'},
  {label: '10', value: '11'},
  {label: '12', value: '12'},
  {label: '13', value: '13'},
  {label: '14', value: '14'},
  {label: '15', value: '15'},
  {label: '16', value: '16'},
  {label: '17', value: '17'},
  {label: '18', value: '18'},
  {label: '19', value: '19'},
  {label: '20', value: '20'},
  {label: '21', value: '21'},
  {label: '22', value: '22'},
  {label: '23', value: '23'},
];

const minutes = [
  {label: '00', value: '00'},
  {label: '05', value: '05'},
  {label: '10', value: '10'},
  {label: '15', value: '15'},
  {label: '20', value: '20'},
  {label: '25', value: '25'},
  {label: '30', value: '30'},
  {label: '35', value: '35'},
  {label: '40', value: '40'},
  {label: '45', value: '45'},
  {label: '50', value: '50'},
  {label: '55', value: '55'},
];
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
      hour: '',
      minute: '',
      time: 0,
      lat: 0,
      long: 0,
      selectedCuisine: [], //array
      selectedPrice: [], //string "1,2,3"
      price: null, //string of prices
      selectedDiet: [],
    };
  }

  componentDidMount() {
    this._isMounted = true;
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
    this.setState({time: parseInt(this.state.hour + this.state.minute + '00')});
    console.log(this.state.time);
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
            <View style={{margin: '5%'}}>
              <Text style={styles.header}>Members</Text>
              <TouchableHighlight
                underlayColor={hex}
                style={styles.touchableFriends}>
                <Text style={styles.touchableFriendsText}>
                  Select from Friends
                </Text>
              </TouchableHighlight>
            </View>
          )}
          <View style={{margin: '5%'}}>
            <Text style={styles.header}>Cuisines</Text>
            <TagsView
              all={tagsCuisine}
              selected={this.state.selectedCuisine}
              isExclusive={false}
            />
          </View>
          {this.state.isHost && (
            <View style={{margin: '5%'}}>
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
                  width: '85%',
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
          )}
          {this.state.isHost && (
            <View style={{margin: '5%'}}>
              <Text style={styles.header}>Open at:</Text>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <DropDownPicker
                  selectedLabelStyle={{
                    color: hex,
                    fontFamily: font,
                    fontSize: 20,
                    textAlign: 'right',
                  }}
                  arrowColor={hex}
                  arrowSize={25}
                  placeholder={' '}
                  items={hours}
                  containerStyle={{height: 40, width: '50%'}}
                  style={{
                    flexDirection: 'row-reverse',
                    backgroundColor: 'white',
                    borderWidth: 0,
                  }}
                  labelStyle={{
                    color: hex,
                    fontSize: 20,
                    fontFamily: font,
                  }}
                  onChangeItem={selection =>
                    this.setState({hour: selection.value})
                  }
                />
                <Text
                  style={{
                    fontFamily: font,
                    color: hex,
                    fontSize: 25,
                  }}>
                  :
                </Text>
                <DropDownPicker
                  selectedLabelStyle={{
                    color: hex,
                    fontFamily: font,
                    fontSize: 20,
                  }}
                  arrowColor={hex}
                  arrowSize={25}
                  placeholder={' '}
                  items={minutes}
                  containerStyle={{height: 40, width: '50%'}}
                  style={{
                    backgroundColor: 'white',
                    borderWidth: 0,
                  }}
                  labelStyle={{
                    color: hex,
                    fontSize: 20,
                    fontFamily: font,
                  }}
                  onChangeItem={selection =>
                    this.setState({minute: selection.value})
                  }
                />
              </View>
            </View>
          )}
          {this.state.isHost && (
            <View style={{margin: '5%'}}>
              <Text style={styles.header}>Price</Text>
              <TagsView
                all={tagsPrice}
                selected={this.state.selectedPrice}
                isExclusive={false}
              />
            </View>
          )}
          <View style={{margin: '5%'}}>
            <Text style={styles.header}>Dietary Restrictions</Text>
            <TagsView
              all={tagsDiet}
              selected={this.state.selectedDiet}
              isExclusive={false}
            />
          </View>
        </ScrollView>
        <TouchableHighlight
          underlayColor={hex}
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
    backgroundColor: 'white',
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
    color: hex,
  },
  titleSub: {
    fontFamily: font,
    color: hex,
    alignSelf: 'center',
    margin: '1%',
  },
  touchableFriends: {
    borderWidth: 2,
    borderRadius: 25,
    borderColor: hex,
    alignSelf: 'center',
    marginTop: '5%',
  },
  touchableFriendsText: {
    color: hex,
    fontFamily: font,
    fontSize: 18,
    alignSelf: 'center',
    paddingLeft: '3%',
    paddingRight: '3%',
    paddingTop: '2%',
    paddingBottom: '2%',
  },
  header: {
    textAlign: 'left',
    color: hex,
    fontSize: 25,
    margin: '1%',
    fontFamily: font,
  },
  touchable: {
    width: '50%',
    alignSelf: 'center',
    borderColor: hex,
    borderWidth: 2,
    borderRadius: 25,
    justifyContent: 'center',
    margin: '5%',
  },
  nextTitle: {
    textAlign: 'center',
    color: hex,
    fontSize: 25,
    fontFamily: font,
    paddingTop: '2%',
    paddingBottom: '2%',
  },
});
