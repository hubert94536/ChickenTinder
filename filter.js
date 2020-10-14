import React from 'react';
import {
  PermissionsAndroid,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableHighlight,
  View
} from 'react-native'
import { BlurView } from '@react-native-community/blur'
import DropDownPicker from 'react-native-dropdown-picker'
import Geolocation from 'react-native-geolocation-service'
import Slider from '@react-native-community/slider'
import Alert from './alert.js'
import ChooseFriends from './chooseFriends.js'
import Socket from './socket.js'
import TagsView from './TagsView'

const hex = '#F25763'
const font = 'CircularStd-Bold'

//  need this for choosing the time
const hours = [
  { label: '0', value: 0 },
  { label: '1', value: 1 },
  { label: '2', value: 2 },
  { label: '3', value: 3 },
  { label: '4', value: 4 },
  { label: '5', value: 5 },
  { label: '6', value: 6 },
  { label: '7', value: 7 },
  { label: '8', value: 8 },
  { label: '9', value: 9 },
  { label: '10', value: 10 },
  { label: '11', value: 11 },
  { label: '12', value: 12 },
  { label: '13', value: 13 },
  { label: '14', value: 14 },
  { label: '15', value: 15 },
  { label: '16', value: 16 },
  { label: '17', value: 17 },
  { label: '18', value: 18 },
  { label: '19', value: 19 },
  { label: '20', value: 20 },
  { label: '21', value: 21 },
  { label: '22', value: 22 },
  { label: '23', value: 23 }
]

//  need this for choosing the time
const minutes = [
  { label: '00', value: 0 },
  { label: '05', value: 5 },
  { label: '10', value: 10 },
  { label: '15', value: 15 },
  { label: '20', value: 20 },
  { label: '25', value: 25 },
  { label: '30', value: 30 },
  { label: '35', value: 35 },
  { label: '40', value: 40 },
  { label: '45', value: 45 },
  { label: '50', value: 50 },
  { label: '55', value: 55 }
]

const tagsCuisine = [
  'American',
  'European',
  'Latin American',
  'Mediterranean',
  'South Asian',
  'Southeast Asian',
  'Pacific Islander',
  'East Asian',
  'Middle Eastern',
  'African'
]

const tagsDiet = ['Vegan', 'Vegetarian']

const tagsPrice = ['$', '$$', '$$$', '$$$$']

//  requests the users permission
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
      buttonPositive: 'OK'
    }
  ).then(res => {
    if (res === PermissionsAndroid.RESULTS.GRANTED) {
      return true
    } else {
      return false
    }
  })
}

export default class FilterSelector extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      host: this.props.host,
      isHost: this.props.isHost,
      distance: 5,
      location: null,
      useLocation: false,
      hour: '',
      minute: '',
      lat: 0,
      long: 0,
      selectedCuisine: [],
      selectedPrice: [],
      selectedRestriction: [],
      // showing alerts and modals
      locationAlert: false,
      formatAlert: false,
      chooseFriends: false
    }
  }

  // updates state when tag is selected/deselected
  handleUpdate (chosenState, event) {
    this.setState({ chosenState: event })
  }

  // asks user for permission and get location as the component mounts
  componentDidMount () {
    if (requestLocationPermission()) {
      Geolocation.getCurrentPosition(
        position => {
          this.setState({
            long: position.coords.longitude,
            lat: position.coords.latitude
          })
        },
        error => {
          console.log(error.code, error.message)
        },
        { venableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
      )
    }
  }

  //  pushes the 'subcategories' of each cusisine
  categorize (cat) {
    var categories = []
    for (var i = 0; i < cat.length; i++) {
      switch (cat[i]) {
        case 'American':
          categories.push('American')
          break
        case 'European':
          categories.push('Eastern European')
          categories.push('French')
          categories.push('British')
          categories.push('Spanish')
          categories.push('Portuguese')
          categories.push('German')
          categories.push('Austrian')
          categories.push('Danish')
          categories.push('Swedish')
          break
        case 'Latin American':
          categories.push('Argentine')
          categories.push('Brazilian')
          categories.push('Cuban')
          categories.push('Caribbean')
          categories.push('Honduran')
          categories.push('Mexican')
          categories.push('Nicaraguan')
          categories.push('Peruvian')
          break
        case 'Mediterranean':
          categories.push('Mediterranean')
          break
        case 'South Asian':
          categories.push('Indian')
          categories.push('Pakistani')
          categories.push('Afghan')
          categories.push('Bangladeshi')
          categories.push('Himalayan')
          categories.push('Nepalese')
          categories.push('Sri Lankan')
          break
        case 'Southeast Asian':
          categories.push('Cambodian')
          categories.push('Indonesian')
          categories.push('Laotian')
          categories.push('Malaysian')
          categories.push('Filipino')
          categories.push('Singaporean')
          categories.push('Thai')
          categories.push('Vietnamese')
          break
        case 'Pacific Islander':
          categories.push('Polynesian')
          categories.push('Filipino')
          break
        case 'East Asian':
          categories.push('Japanese')
          categories.push('Korean')
          categories.push('Chinese')
          categories.push('Taiwanese')
          categories.push('Mongolian')
          break
        case 'Middle Eastern':
          categories.push('Middle Eastern')
          break
        case 'African':
          categories.push('African')
          break
        case 'Asian Fusion':
          categories.push('Asian Fusion')
          break
        case 'Vegetarian':
          categories.push('Vegetarian')
          break
        case 'Vegan':
          categories.push('Vegan')
          break
      }
    }
    console.log(categories)
    return categories
  }

  // this will pass the filters to the groups page
  handlePress (setFilters) {
    this.props.press(setFilters)
  }

  //  formats the filters to call yelp api
  evaluateFilters () {
    var filters = {}
    //  convert to unix time
    const date = new Date()
    const dd = date.getDate()
    const mm = date.getMonth()
    const yyyy = date.getFullYear()
    const unix = Date.UTC(yyyy, mm, dd, this.state.hour, this.state.minute) / 1000
    filters.open_at = unix
    filters.price = this.state.selectedPrice
      .map(item => item.length)
      .toString()
      // puts the cuisine and restrictions into one array
    var selections = this.state.selectedCuisine.concat(this.state.selectedRestriction)
    filters.categories = this.categorize(selections)
    filters.radius = this.state.distance * 1600
    //  making sure we have a valid location
    if (this.state.useLocation) {
      filters.latitude = this.state.lat
      filters.longitude = this.state.long
      Socket.submitFilters(filters, this.state.host)
      this.handlePress(filters)
    } else {
      if (
        this.state.isHost &&
        this.state.location === null &&
        this.state.useLocation === false
      ) {
        this.setState({ locationAlert: true })
      } else {
        filters.location = this.state.location
        Socket.submitFilters(filters, this.state.host)
        this.handlePress(filters)
      }
      // else if (true) {
      // this.setState({formatAlert: true});
      // console.log('format problems');
      // //if location is null and useLocation is false for HOST -> create alert location is required,
      // //check body that it's in format (city, state) if not send alert too
      // }
    }
  }

  render () {
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
            <View style={{ margin: '5%' }}>
              <Text style={styles.header}>Members</Text>
              <TouchableHighlight
                onPress={() => this.setState({ chooseFriends: true })}
                underlayColor={hex}
                style={styles.touchableFriends}
              >
                <Text style={styles.touchableFriendsText}>
                  Select from Friends
                </Text>
              </TouchableHighlight>
            </View>
          )}
          <View style={{ marginLeft: '5%', marginRight: '5%', marginTop: '2%' }}>
            <Text style={styles.header}>Cuisines</Text>
            <TagsView
              all={tagsCuisine}
              selected={this.state.selectedCuisine}
              isExclusive={false}
              onChange={event => this.handleUpdate(this.state.selectedCuisine, event)}
            />
          </View>
          {this.state.isHost && (
            <View
              style={{
                marginLeft: '5%',
                marginRight: '5%',
                marginTop: '2%'
              }}
            >
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between'
                }}
              >
                <Text style={styles.header}>Use Current Location:</Text>
                <Switch
                  thumbColor={hex}
                  trackColor={{ true: '#eba2a8' }}
                  style={{ marginTop: '1%' }}
                  value={this.state.useLocation}
                  onValueChange={val => {
                    this.setState({
                      useLocation: val
                    })
                  }}
                />
              </View>
              <TextInput
                placeholder={
                  this.state.useLocation
                    ? 'Using Current Location'
                    : 'Enter City, State'
                }
                onChangeText={text => this.setState({ location: text })}
                style={
                  this.state.useLocation
                    ? styles.inputDisabled
                    : styles.inputEnabled
                }
                //  To make TextInput enable/disable
                editable={!this.state.useLocation}
              />
            </View>
          )}
          {this.state.isHost && (
            <View style={{ margin: '5%' }}>
              <View style={{ flexDirection: 'row' }}>
                <Text style={styles.header}>Distance</Text>
                <Text
                  style={{
                    color: hex,
                    fontFamily: font,
                    alignSelf: 'center',
                    marginLeft: '1%',
                    marginTop: '1%'
                  }}
                >
                  ({this.state.distance} miles)
                </Text>
              </View>
              <Slider
                style={{
                  width: '85%',
                  height: 30,
                  alignSelf: 'center'
                }}
                minimumValue={5}
                maximumValue={25}
                value={5}
                step={0.5}
                minimumTrackTintColor={hex}
                thumbTintColor={hex}
                onValueChange={value => this.setState({ distance: value })}
              />
            </View>
          )}
          {this.state.isHost && (
            <View
              style={{ marginLeft: '5%', marginRight: '5%', marginTop: '2%' }}
            >
              <Text style={styles.header}>Open at:</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <DropDownPicker
                  selectedLabelStyle={{
                    color: hex,
                    fontFamily: font,
                    fontSize: 20,
                    textAlign: 'right'
                  }}
                  arrowColor={hex}
                  arrowSize={25}
                  placeholder=' '
                  items={hours}
                  containerStyle={{ height: 40, width: '50%' }}
                  style={{
                    flexDirection: 'row-reverse',
                    backgroundColor: 'white',
                    borderWidth: 0
                  }}
                  labelStyle={{
                    color: hex,
                    fontSize: 20,
                    fontFamily: font
                  }}
                  onChangeItem={selection =>
                    this.setState({ hour: selection.value })}
                />
                <Text
                  style={{
                    fontFamily: font,
                    color: hex,
                    fontSize: 25
                  }}
                >
                  :
                </Text>
                <DropDownPicker
                  selectedLabelStyle={{
                    color: hex,
                    fontFamily: font,
                    fontSize: 20
                  }}
                  arrowColor={hex}
                  arrowSize={25}
                  placeholder=' '
                  items={minutes}
                  containerStyle={{ height: 40, width: '50%' }}
                  style={{
                    backgroundColor: 'white',
                    borderWidth: 0
                  }}
                  labelStyle={{
                    color: hex,
                    fontSize: 20,
                    fontFamily: font
                  }}
                  onChangeItem={selection =>
                    this.setState({ minute: selection.value })}
                />
              </View>
            </View>
          )}
          {this.state.isHost && (
            <View style={{ margin: '5%' }}>
              <Text style={styles.header}>Price</Text>
              <TagsView
                all={tagsPrice}
                selected={this.state.selectedPrice}
                isExclusive={false}
                onChange={event => this.handleUpdate(this.state.selectedPrice, event)}
              />
            </View>
          )}
          <View style={{ marginLeft: '5%', marginRight: '5%', marginTop: '1%' }}>
            <Text style={styles.header}>Dietary Restrictions</Text>
            <TagsView
              all={tagsDiet}
              selected={this.state.selectedRestriction}
              isExclusive={false}
              onChange={event => this.handleUpdate(this.state.selectedRestriction, event)}
            />
          </View>
        </ScrollView>
        <TouchableHighlight
          underlayColor={hex}
          style={styles.touchable}
          onPress={() => this.evaluateFilters()}
        >
          <Text style={styles.nextTitle}>
            {this.state.isHost ? "Let's Go" : 'Submit Filters'}
          </Text>
        </TouchableHighlight>
        {(this.state.locationAlert || this.state.formatAlert || this.state.chooseFriends) && (
          <BlurView
            blurType='light'
            blurAmount={20}
            reducedTransparencyFallbackColor='white'
            style={{ position: 'absolute', top: 0, bottom: 0, left: 0, right: 0 }}
          />
        )}
        {this.state.locationAlert && (
          <Alert
            title='Location Required'
            body='Your location is required to find nearby restuarants'
            button
            buttonText='Close'
            press={() => this.setState({ locationAlert: false })}
            cancel={() => this.setState({ locationAlert: false })}
          />
        )}
        {this.state.formatAlert && (
          <Alert
            title='Error'
            body='Make sure your location is in the correct format: City, State'
            button
            buttonText='Close'
            press={() => this.setState({ formatAlert: false })}
            cancel={() => this.setState({ formatAlert: false })}
          />
        )}
        {this.state.chooseFriends && (
          <ChooseFriends press={() => this.setState({ chooseFriends: false })} />
        )}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  //  Fullscreen
  mainContainer: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'space-between'
  },
  titleStyle: {
    flexDirection: 'row',
    margin: '5%'
    // alignItems: 'center',
  },
  titleText: {
    fontFamily: font,
    fontSize: 28,
    color: hex
  },
  titleSub: {
    fontFamily: font,
    color: hex,
    alignSelf: 'center',
    margin: '1%',
    marginTop: '2%'
  },
  touchableFriends: {
    borderWidth: 2,
    borderRadius: 25,
    borderColor: hex,
    alignSelf: 'center',
    marginTop: '5%'
  },
  touchableFriendsText: {
    color: hex,
    fontFamily: font,
    fontSize: 18,
    alignSelf: 'center',
    paddingLeft: '3%',
    paddingRight: '3%',
    paddingTop: '2%',
    paddingBottom: '2%'
  },
  header: {
    textAlign: 'left',
    color: hex,
    fontSize: 25,
    margin: '1%',
    fontFamily: font
  },
  touchable: {
    width: '50%',
    alignSelf: 'center',
    borderColor: hex,
    borderWidth: 2,
    borderRadius: 25,
    justifyContent: 'center',
    margin: '5%'
  },
  nextTitle: {
    textAlign: 'center',
    color: hex,
    fontSize: 25,
    fontFamily: font,
    paddingTop: '2%',
    paddingBottom: '2%'
  },
  inputEnabled: {
    backgroundColor: 'white',
    borderColor: 'black'
  },
  inputDisabled: {
    backgroundColor: 'white'
  }
})
