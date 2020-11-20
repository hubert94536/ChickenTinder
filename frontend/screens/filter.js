import React from 'react'
import {
  Dimensions,
  Modal,
  PermissionsAndroid,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableHighlight,
  View,
} from 'react-native'
import { BlurView } from '@react-native-community/blur'
import Geolocation from 'react-native-geolocation-service'
import PropTypes from 'prop-types'
import Slider from '@react-native-community/slider'
import Alert from '../modals/alert.js'
import ChooseFriends from '../modals/chooseFriends.js'
import Socket from '../apis/socket.js'
import TagsView from '../tagsView'
import screenStyles from '../../styles/screenStyles.js'
import modalStyles from '../../styles/modalStyles.js'
import Icon from 'react-native-vector-icons/AntDesign'
import SwitchButton from 'switch-button-react-native'

const hex = '#F15763'
const font = 'CircularStd-Medium'

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
  'African',
]

const tagsDiet = ['Vegan', 'Vegetarian']

const tagsPrice = ['$', '$$', '$$$', '$$$$']

//  requests the users permission
const requestLocationPermission = async () => {
  PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION, {
    title: 'Location Permission',
    message: 'WeChews needs access to your location ' + 'so you can find nearby restaurants.',
    buttonNeutral: 'Ask Me Later',
    buttonNegative: 'Cancel',
    buttonPositive: 'OK',
  })
    .then((res) => {
      if (res === PermissionsAndroid.RESULTS.GRANTED) {
        return true
      } else {
        return false
      }
    })
    .catch(() => {
      this.setState({ errorAlert: true })
    })
}

const date = new Date()

export default class FilterSelector extends React.Component {
  constructor(props) {
    super(props)
    let date = new Date()
    this.state = {
      host: this.props.host,
      isHost: this.props.isHost,
      distance: 5,
      location: null,
      useLocation: false,
      selectedHour: '',
      selectedMinute: '',
      hour: date.getUTCHours(),
      minute: date.getUTCMinutes(),
      timeMode: 'pm',
      lat: 0,
      long: 0,
      selectedCuisine: [],
      selectedPrice: [],
      selectedRestriction: [],
      // showing alerts and modals
      invalidTime: false,
      chooseTime: false,
      locationAlert: false,
      formatAlert: false,
      chooseFriends: false,
      errorAlert: false,
    }
  }

  // asks user for permission and get location as the component mounts
  componentDidMount() {
    if (requestLocationPermission()) {
      Geolocation.getCurrentPosition(
        (position) => {
          this.setState({
            long: position.coords.longitude,
            lat: position.coords.latitude,
          })
        },
        (error) => {
          console.log(error.code, error.message)
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
      )
    }
  }

  //  pushes the 'subcategories' of each cusisine
  categorize(cat) {
    var categories = []
    for (var i = 0; i < cat.length; i++) {
      switch (cat[i]) {
        case 'American':
          categories.push('american')
          break
        case 'European':
          categories.push('eastern_european')
          categories.push('french')
          categories.push('british')
          categories.push('spanish')
          categories.push('portuguese')
          categories.push('german')
          categories.push('austrian')
          categories.push('danish')
          categories.push('swedish')
          break
        case 'Latin American':
          categories.push('argentine')
          categories.push('brazilian')
          categories.push('cuban')
          categories.push('caribbean')
          categories.push('honduran')
          categories.push('mexican')
          categories.push('nicaraguan')
          categories.push('peruvian')
          break
        case 'Mediterranean':
          categories.push('mediterranean')
          break
        case 'South Asian':
          categories.push('indian')
          categories.push('pakistani')
          categories.push('afghan')
          categories.push('bangladeshi')
          categories.push('himalayan')
          categories.push('nepalese')
          categories.push('srilankan')
          break
        case 'Southeast Asian':
          categories.push('cambodian')
          categories.push('indonesian')
          categories.push('laotian')
          categories.push('malaysian')
          categories.push('filipino')
          categories.push('singaporean')
          categories.push('thai')
          categories.push('vietnamese')
          break
        case 'Pacific Islander':
          categories.push('polynesian')
          categories.push('filipino')
          break
        case 'East Asian':
          categories.push('japanese')
          categories.push('korean')
          categories.push('chinese')
          categories.push('taiwanese')
          categories.push('mongolian')
          break
        case 'Middle Eastern':
          categories.push('middle_eastern')
          break
        case 'African':
          categories.push('african')
          break
        case 'Asian Fusion':
          categories.push('asianfusion')
          break
        case 'Vegetarian':
          categories.push('vegetarian')
          break
        case 'Vegan':
          categories.push('vegan')
          break
      }
    }
    return categories
  }

  // this will pass the filters to the groups page
  handlePress(setFilters) {
    this.props.press(setFilters)
  }

  //  formats the filters to call yelp api
  evaluateFilters() {
    var filters = {}
    //  convert to unix time
    const dd = date.getDate()
    const mm = date.getMonth()
    const yyyy = date.getFullYear()
    const timezone = date.getTimezoneOffset()
    const unix = Date.UTC(yyyy, mm, dd, this.state.hour, this.state.minute + timezone) / 1000
    filters.open_at = unix
    filters.price = this.state.selectedPrice.map((item) => item.length).toString()
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
      if (this.state.isHost && this.state.location === null && this.state.useLocation === false) {
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

  evaluateTime() {
    if (this.state.selectedMinute === '' || this.state.selectedHour === '') {
      this.setState({ invalidTime: true })
    }
    var hour = parseInt(this.state.selectedHour)
    var min = parseInt(this.state.selectedMinute)
    if (hour < 0 || hour > 12 || min < 0 || min > 59) {
      this.setState({ invalidTime: true })
    } else {
      if (this.state.timeMode === 'pm') {
        if (hour !== 12) {
          hour = hour + 12
        }
      } else if (this.state.timeMode === 'am') {
        if (hour === 12) {
          hour = 0
        }
      }
      this.setState({ hour: hour, minute: min, chooseTime: false })
      console.log(hour + ':' + min)
    }
  }

  render() {
    return (
      <View style={styles.mainContainer}>
        <View style={styles.titleStyle}>
          <Text style={[screenStyles.text, { fontSize: 28 }]}>
            {this.state.isHost ? 'Group Settings' : 'Set Your Filters'}
          </Text>
          {this.state.isHost && (
            <Text style={[screenStyles.text, styles.titleSub]}>(only visible to host)</Text>
          )}
        </View>
        <ScrollView>
          {this.state.isHost && (
            <View style={{ margin: '5%' }}>
              <Text style={[screenStyles.text, styles.header]}>Members</Text>
              <TouchableHighlight
                onPress={() => this.setState({ chooseFriends: true })}
                underlayColor={hex}
                style={[
                  screenStyles.text,
                  screenStyles.medButton,
                  { borderColor: hex, marginTop: '5%' },
                ]}
              >
                <Text style={[screenStyles.text, styles.touchableFriendsText]}>
                  Select from Friends
                </Text>
              </TouchableHighlight>
            </View>
          )}
          <View style={{ marginLeft: '5%', marginRight: '5%', marginTop: '2%' }}>
            <Text style={[screenStyles.text, styles.header]}>Cuisines</Text>
            <TagsView
              all={tagsCuisine}
              selected={this.state.selectedCuisine}
              isExclusive={false}
              onChange={(event) => this.setState({ selectedCuisine: event })}
            />
          </View>
          {this.state.isHost && (
            <View
              style={{
                marginLeft: '5%',
                marginRight: '5%',
                marginTop: '2%',
              }}
            >
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}
              >
                <Text style={[screenStyles.text, styles.header]}>Use Current Location:</Text>
                <Switch
                  thumbColor={hex}
                  trackColor={{ true: '#eba2a8' }}
                  style={{ marginTop: '1%' }}
                  value={this.state.useLocation}
                  onValueChange={(val) => {
                    this.setState({
                      useLocation: val,
                    })
                  }}
                />
              </View>
              <TextInput
                placeholder={
                  this.state.useLocation ? 'Using Current Location' : 'Enter City, State'
                }
                onChangeText={(text) => this.setState({ location: text })}
                style={this.state.useLocation ? styles.inputDisabled : styles.inputEnabled}
                //  To make TextInput enable/disable
                editable={!this.state.useLocation}
              />
            </View>
          )}
          {this.state.isHost && (
            <View style={{ margin: '5%' }}>
              <View style={{ flexDirection: 'row' }}>
                <Text style={[screenStyles.text, styles.header]}>Distance</Text>
                <Text
                  style={{
                    color: hex,
                    fontFamily: font,
                    alignSelf: 'center',
                    marginLeft: '1%',
                    marginTop: '1%',
                  }}
                >
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
                onValueChange={(value) => this.setState({ distance: value })}
              />
            </View>
          )}
          {this.state.isHost && (
            <View style={{ marginLeft: '5%', marginRight: '5%', marginTop: '2%' }}>
              <Text style={[screenStyles.text, styles.header]}>Open at:</Text>
            </View>
          )}
          {this.state.isHost && (
            <View style={{ margin: '5%' }}>
              <Text style={[screenStyles.text, styles.header]}>Price</Text>
              <TagsView
                all={tagsPrice}
                selected={this.state.selectedPrice}
                isExclusive={false}
                onChange={(event) => this.setState({ selectedPrice: event })}
              />
            </View>
          )}
          <View style={{ marginLeft: '5%', marginRight: '5%', marginTop: '1%' }}>
            <Text style={[screenStyles.text, styles.header]}>Dietary Restrictions</Text>
            <TagsView
              all={tagsDiet}
              selected={this.state.selectedRestriction}
              isExclusive={false}
              onChange={(event) => this.setState({ selectedRestriction: event })}
            />
          </View>
        </ScrollView>
        <TouchableHighlight
          underlayColor={hex}
          style={[screenStyles.medButton, styles.touchable]}
          onPress={() => this.evaluateFilters()}
        >
          <Text style={[screenStyles.text, styles.nextTitle]}>
            {this.state.isHost ? "Let's Go" : 'Submit Filters'}
          </Text>
        </TouchableHighlight>
        {(this.state.locationAlert || this.state.formatAlert || this.state.chooseFriends) && (
          <BlurView
            blurType="light"
            blurAmount={20}
            reducedTransparencyFallbackColor="white"
            style={modalStyles.blur}
          />
        )}
        {this.state.locationAlert && (
          <Alert
            title="Location Required"
            body="Your location is required to find nearby restuarants"
            button
            buttonText="Close"
            press={() => this.setState({ locationAlert: false })}
            cancel={() => this.setState({ locationAlert: false })}
          />
        )}
        {this.state.formatAlert && (
          <Alert
            title="Error"
            body="Make sure your location is in the correct format: City, State"
            button
            buttonText="Close"
            press={() => this.setState({ formatAlert: false })}
            cancel={() => this.setState({ formatAlert: false })}
          />
        )}
        {this.state.errorAlert && (
          <Alert
            title="Error, please try again"
            button
            buttonText="Close"
            press={() => this.setState({ errorAlert: false })}
            cancel={() => this.setState({ errorAlert: false })}
          />
        )}
        {this.state.chooseFriends && (
          <ChooseFriends
            members={this.props.members}
            press={() => this.setState({ chooseFriends: false })}
          />
        )}
        {this.state.chooseTime && (
          <BlurView
            blurType="dark"
            blurAmount={10}
            reducedTransparencyFallbackColor="white"
            style={modalStyles.blur}
          />
        )}
        <Modal animationType="fade" transparent visible={this.state.chooseTime}>
          <View
            style={[
              {
                height: Dimensions.get('window').height * 0.3,
                width: '75%',
                marginTop: '50%',
                backgroundColor: 'white',
                elevation: 20,
                alignSelf: 'center',
                borderRadius: 10,
              },
            ]}
          >
            <Icon
              name="closecircleo"
              style={[
                screenStyles.text,
                {
                  fontSize: 18,
                  flexDirection: 'row',
                  alignSelf: 'flex-end',
                  marginTop: '4%',
                  marginRight: '4%',
                },
              ]}
              onPress={() => this.setState({ chooseTime: false })}
            />
            <View style={{ marginLeft: '5%' }}>
              <Text style={[screenStyles.text, { fontSize: 17, marginBottom: '3%' }]}>Time</Text>
              <Text style={[screenStyles.text, { color: 'black' }]}>
                Set a time for your group to eat
              </Text>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <TextInput
                  style={[
                    {
                      fontSize: 17,
                      color: '#9f9f9f',
                      backgroundColor: '#E5E5E5',
                      height: '80%',
                      width: '17%',
                      borderRadius: 7,
                      textAlign: 'center',
                      padding: '3%',
                    },
                  ]}
                  value={this.state.selectedHour}
                  placeholder="12"
                  onChangeText={(text) => this.setState({ selectedHour: text, invalidTime: false })}
                  keyboardType="numeric"
                />
                <Text
                  style={[screenStyles.text, { fontSize: 20, marginRight: '2%', marginLeft: '2%' }]}
                >
                  :
                </Text>
                <TextInput
                  style={[
                    {
                      fontSize: 17,
                      color: '#9f9f9f',
                      backgroundColor: '#E5E5E5',
                      height: '80%',
                      width: '17%',
                      borderRadius: 7,
                      textAlign: 'center',
                      padding: '3%',
                      marginRight: '4%',
                    },
                  ]}
                  value={this.state.selectedMinute}
                  placeholder="00"
                  onChangeText={(text) =>
                    this.setState({ selectedMinute: text, invalidTime: false })
                  }
                  keyboardType="numeric"
                />
                <SwitchButton
                  onValueChange={(val) => this.setState({ timeMode: val })}
                  text1="pm"
                  text2="am"
                  switchWidth={75}
                  switchHeight={30}
                  switchBorderColor={hex}
                  btnBorderColor={hex}
                  btnBackgroundColor={hex}
                  fontColor={hex}
                  activeFontColor="white"
                />
              </View>
              {this.state.invalidTime && (
                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: '3%' }}>
                  <Icon
                    name="exclamationcircle"
                    color={hex}
                    style={{ fontSize: 15, marginRight: '2%' }}
                  />
                  <Text style={[screenStyles.text, { fontSize: 12 }]}>
                    Invalid time. Please try again
                  </Text>
                </View>
              )}
              {!this.state.invalidTime && (
                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: '3%' }}>
                  <Text style={[screenStyles.text, { fontSize: 12 }]}> </Text>
                </View>
              )}
              <TouchableHighlight
                style={{
                  backgroundColor: hex,
                  borderRadius: 30,
                  alignSelf: 'center',
                  width: '40%',
                  marginTop: '5%',
                }}
                onPress={() => this.evaluateTime()}
              >
                <Text
                  style={[
                    screenStyles.text,
                    {
                      color: 'white',
                      textAlign: 'center',
                      paddingTop: '5%',
                      paddingBottom: '5%',
                      fontSize: 20,
                    },
                  ]}
                >
                  Done
                </Text>
              </TouchableHighlight>
            </View>
          </View>
        </Modal>
      </View>
    )
  }
}

FilterSelector.propTypes = {
  host: PropTypes.string,
  isHost: PropTypes.bool,
  press: PropTypes.func,
  members: PropTypes.array,
}

const styles = StyleSheet.create({
  //  Fullscreen
  mainContainer: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'space-between',
  },
  titleStyle: {
    flexDirection: 'row',
    margin: '5%',
  },
  titleSub: {
    alignSelf: 'center',
    margin: '1%',
    marginTop: '2%',
  },
  touchableFriendsText: {
    fontSize: 18,
    alignSelf: 'center',
    paddingLeft: '3%',
    paddingRight: '3%',
    paddingTop: '2%',
    paddingBottom: '2%',
  },
  header: {
    textAlign: 'left',
    fontSize: 25,
    margin: '1%',
  },
  touchable: {
    width: '50%',
    borderColor: hex,
    justifyContent: 'center',
    margin: '5%',
  },
  nextTitle: {
    textAlign: 'center',
    fontSize: 25,
    paddingTop: '2%',
    paddingBottom: '2%',
  },
  inputEnabled: {
    backgroundColor: 'white',
    borderColor: 'black',
  },
  inputDisabled: {
    backgroundColor: 'white',
  },
})
