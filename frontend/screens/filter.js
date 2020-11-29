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
import SliderText from 'react-native-slider-text'
import Alert from '../modals/alert.js'
import ChooseFriends from '../modals/chooseFriends.js'
import Socket from '../apis/socket.js'
import TagsView from '../tagsView.js'
import DynamicTags from '../tagsViewGenerator.js'
import BackgroundButton from '../backgroundButton.js'
import Location from '../modals/chooseLocation.js'
import Time from '../modals/chooseTime.js'
import Size from '../modals/chooseSize.js'
import Majority from '../modals/chooseMajority.js'
import screenStyles from '../../styles/screenStyles.js'
import modalStyles from '../../styles/modalStyles.js'
import Icon from 'react-native-vector-icons/AntDesign'
import SwitchButton from 'switch-button-react-native'

const hex = '#F15763'
const font = 'CircularStd-Medium'

const BACKGROUND_COLOR = '#F15763'
const BORDER_COLOR = 'white'
const TEXT_COLOR = 'white'
const ACCENT_COLOr = '#F15763'

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

const tagsSizes = [10, 20, 30]

const tagsMajority = ['6', '10', 'All', 'Custom: ']

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
    const date = new Date()
    this.state = {
      host: this.props.host,
      isHost: this.props.isHost,
      distance: 5,
      zipcode: '',
      location: null,
      useLocation: false,
      hour: date.getUTCHours(),
      minute: date.getUTCMinutes(),
      asap: true,
      lat: 0,
      long: 0,
      size: 10,
      majority: this.props.members.length,
      selectedCuisine: [],
      selectedPrice: [],
      selectedRestriction: [],
      selectedSize: [],
      selectedMajority: [],
      // showing alerts and modals
      chooseTime: false,
      locationAlert: false,
      chooseLocation: false,
      chooseFriends: false,
      chooseMajority: false,
      chooseSize: false,
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
    const categories = []
    for (let i = 0; i < cat.length; i++) {
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
    const filters = {}
    //  convert to unix time
    const dd = date.getDate()
    const mm = date.getMonth()
    const yyyy = date.getFullYear()
    const timezone = date.getTimezoneOffset()
    const unix = Date.UTC(yyyy, mm, dd, this.state.hour, this.state.minute + timezone) / 1000
    filters.open_at = unix
    filters.price = this.state.selectedPrice.map((item) => item.length).toString()
    // puts the cuisine and restrictions into one array
    const selections = this.state.selectedCuisine.concat(this.state.selectedRestriction)
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

  setLocation(zip) {
    this.setState({ zipcode: zip, chooseLocation: false })
  }

  render() {
    return (
      <View style={styles.mainContainer}>
        {/* Title */}
        {this.state.isHost && (
          <View style={styles.titleStyle}>
            <Text
              style={[screenStyles.text, { fontSize: 28, color: 'white', textAlign: 'center' }]}
            >
              Group Settings
            </Text>
          </View>
        )}

        <ScrollView>
          {/* TODO: Update Buttom Label */}
          {/* Majority Rule */}
          {this.state.isHost && (
            <View style={{ marginLeft: '5%', marginRight: '5%', marginTop: '1%' }}>
              <View style={{ flexDirection: 'row' }}>
                <Text style={[screenStyles.text, styles.header]}>Majority</Text>
                <Text style={styles.subtext}>Members needed to get a match</Text>
              </View>
              <DynamicTags
                all={tagsMajority}
                selected={this.state.selectedMajority}
                selectedNum={this.state.majority}
                isExclusive={true}
                onChange={(event) => {
                  if (event[0] === 'Custom: ') {
                    this.setState({ chooseMajority: true })
                  } else if (event[0] === 'All') {
                    this.setState({ majority: this.props.members.length })
                  } else {
                    this.setState({ majority: parseInt(event) })

                    console.log(this.state.majority)
                    console.log(this.state.majority)
                    console.log(this.state.majority)
                    console.log(this.state.majority)
                    console.log(this.state.majority)
                    console.log(this.state.majority)
                    console.log(this.state.majority)
                    console.log(this.state.majority)
                    console.log(this.state.majority)
                    console.log(this.state.majority)
                  }
                  this.setState({ selectedMajority: event })
                  
                }}
              />
            </View>
          )}

          {/* TODO: Update Buttom Label */}
          {/* Round Size */}
          {this.state.isHost && (
            <View style={{ marginLeft: '5%', marginRight: '5%', marginTop: '1%' }}>
              <View style={{ flexDirection: 'row' }}>
                <Text style={[screenStyles.text, styles.header]}>Round Size</Text>
                <Text style={styles.subtext}>Max number of restaurants</Text>
              </View>
              <TagsView
                all={tagsSizes}
                selected={this.state.selectedSize}
                isExclusive={true}
                onChange={(event) => {
                  if (event[0] === 'Custom: ') {
                    this.setState({ chooseSize: true })
                  }
                  this.setState({ selectedSize: event, size: event[0] })
                }}
              />
            </View>
          )}

          {/* DISTANCE */}
          {this.state.isHost && (
            <View style={{ marginLeft: '5%', marginRight: '5%', marginTop: '1%' }}>
              <View style={{ flexDirection: 'row' }}>
                <Text style={[screenStyles.text, styles.header]}>Distance</Text>
                <Text style={styles.subtext}>({this.state.distance} miles)</Text>
                <TouchableHighlight
                  underlayColor={'white'}
                  onPress={() => this.setState({ chooseLocation: true })}
                  style={[
                    styles.subtext,
                    {
                      backgroundColor: BACKGROUND_COLOR,
                      borderRadius: 20,
                      borderWidth: 1,
                      borderColor: BORDER_COLOR,
                    },
                  ]}
                >
                  <Text
                    style={{
                      color: 'white',
                      fontFamily: font,
                      fontSize: 12,
                      paddingLeft: 5,
                      paddingRight: 5,
                      paddingTop: 3,
                      paddingBottom: 3,
                    }}
                  >
                    Choose Location
                  </Text>
                </TouchableHighlight>
                <Switch
                  thumbColor={'white'}
                  trackColor={{ true: '#eba2a8' }}
                  style={{ marginTop: '1%', marginLeft: '3%' }}
                  value={this.state.useLocation}
                  onValueChange={(val) => {
                    this.setState({
                      useLocation: val,
                    })
                  }}
                />
              </View>
              <Slider
                style={{
                  width: '85%',
                  height: 30,
                  alignSelf: 'center',
                }}
                minimumValue={5}
                maximumValue={50}
                value={5}
                step={0.5}
                minimumTrackTintColor={'white'}
                maximumTrackTintColor={'white'}
                thumbTintColor={'white'}
                onValueChange={(value) => this.setState({ distance: value })}
              />
            </View>
          )}

          {/* PRICE */}
          {this.state.isHost && (
            <View style={{ marginLeft: '5%', marginRight: '5%', marginTop: '1%' }}>
              <View style={{ flexDirection: 'row' }}>
                <Text style={[screenStyles.text, styles.header]}>Price</Text>
                <Text style={styles.subtext}>Select all that apply</Text>
              </View>
              <TagsView
                all={tagsPrice}
                selected={this.state.selectedPrice}
                isExclusive={false}
                onChange={(event) => this.setState({ selectedPrice: event })}
              />
            </View>
          )}

          {/* TIME */}
          {this.state.isHost && (
            <View style={{ marginLeft: '5%', marginRight: '5%', marginTop: '1%' }}>
              <View style={{ flexDirection: 'row' }}>
                <Text style={[screenStyles.text, styles.header]}>Time</Text>
                <Text style={styles.subtext}>Select when to eat</Text>
              </View>
              <View style={styles.buttonContainer}>
                <BackgroundButton
                  backgroundColor={BACKGROUND_COLOR}
                  textColor={TEXT_COLOR}
                  borderColor={BORDER_COLOR}
                  onPress={() => {
                    const hr = date.getUTCHours()
                    const min = date.getUTCMinutes()
                    this.setState({ hour: hr, minute: min, asap: true })
                  }}
                  title={'ASAP'}
                />
                <BackgroundButton
                  backgroundColor={this.state.asap ? BACKGROUND_COLOR : BORDER_COLOR}
                  textColor={this.state.asap ? BORDER_COLOR : BACKGROUND_COLOR}
                  borderColor={BORDER_COLOR}
                  onPress={() => this.setState({ chooseTime: true, asap: false })}
                  title={'Set Time'}
                />
                <TouchableHighlight
                  underlayColor={'white'}
                  onPress={() => this.setState({ chooseTime: true, asap: false })}
                  style={[
                    styles.subtext,
                    {
                      backgroundColor: this.state.asap ? hex : 'white',
                      borderRadius: 20,
                      borderWidth: 1,
                      borderColor: 'white',
                    },
                  ]}
                >
                  <Text
                    style={{
                      color: this.state.asap ? 'white' : hex,
                      fontFamily: font,
                      fontSize: 15,
                      paddingLeft: 7,
                      paddingRight: 7,
                      paddingTop: 3,
                      paddingBottom: 3,
                    }}
                  >
                    Set Time
                  </Text>
                </TouchableHighlight>
              </View>
            </View>
          )}

          <View style={styles.smallTitle}>
            <Text
              style={[screenStyles.text, { fontSize: 28, color: 'white', textAlign: 'center' }]}
            >
              Your Filters
            </Text>
          </View>

          {/* CUISINES */}
          <View style={{ marginLeft: '5%', marginRight: '5%', marginTop: '1%' }}>
            <Text style={[screenStyles.text, styles.header]}>Cuisines</Text>
            <TagsView
              all={tagsCuisine}
              selected={this.state.selectedCuisine}
              isExclusive={false}
              onChange={(event) => this.setState({ selectedCuisine: event })}
            />
          </View>

          {/* DIETARY RESTRICTIONS */}
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
        {/* <TouchableHighlight
          underlayColor={hex}
          style={[screenStyles.medButton, styles.touchable]}
          onPress={() => this.evaluateFilters()}
        >
          <Text style={[screenStyles.text, styles.nextTitle]}>
            {this.state.isHost ? "Let's Go" : 'Submit Filters'}
          </Text>
        </TouchableHighlight> */}
        {(this.state.locationAlert ||
          this.state.errorAlert ||
          this.state.chooseFriends ||
          this.state.chooseLocation ||
          this.state.chooseTime) && (
            <BlurView
              blurType="dark"
              blurAmount={10}
              reducedTransparencyFallbackColor="white"
              style={modalStyles.blur}
            />
          )}
        {this.state.locationAlert && (
          <Alert
            title="Location Required"
            body="Your location is required to find nearby restuarants"
            buttonAff="Close"
            height="23%"
            press={() => this.setState({ locationAlert: false })}
            cancel={() => this.setState({ locationAlert: false })}
          />
        )}
        <Location
          visible={this.state.chooseLocation}
          press={(zip) => this.setLocation(zip)}
          cancel={() => this.setState({ chooseLocation: false })}
        />
        {this.state.errorAlert && (
          <Alert
            title="Error, please try again"
            buttonAff="Close"
            height="20%"
            press={() => this.setState({ errorAlert: false })}
            cancel={() => this.setState({ errorAlert: false })}
          />
        )}
        <ChooseFriends
          visible={this.state.chooseFriends}
          members={this.props.members}
          press={() => this.setState({ chooseFriends: false })}
        />
        <Time
          visible={this.state.chooseTime}
          cancel={() => this.setState({ chooseTime: false })}
          press={(hr, min) => this.setState({ hour: hr, minute: min, chooseTime: false })}
        />
        <Size
          max={50}
          title={'Round Size'}
          subtext={'Choose the max number of restaurants to swipe through'}
          visible={this.state.chooseSize}
          cancel={() => this.setState({ chooseSize: false })}
          press={(sz) => this.setState({ size: sz, chooseSize: false })}
        />
        <Size
          max={this.props.members.length}
          title={'Majority'}
          subtext={'Choose the number of members needed to get a match'}
          visible={this.state.chooseMajority}
          cancel={() => this.setState({ chooseMajority: false })}
          press={(sz) => {
            console.log(sz)
            this.setState({ majority: sz, chooseMajority: false })
          }}
        />
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
    backgroundColor: hex,
    justifyContent: 'space-between',
  },
  titleStyle: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: '3%',
    marginBottom: '1%',
  },
  smallTitle: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: '2%',
  },
  titleSub: {
    color: 'white',
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
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    margin: '1%',
  },
  subtext: {
    color: 'white',
    fontFamily: font,
    alignSelf: 'center',
    marginLeft: '4%',
    marginTop: '1%',
  },
  touchable: {
    width: '50%',
    borderColor: 'white',
    justifyContent: 'center',
    margin: '5%',
  },
  nextTitle: {
    color: 'white',
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
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingVertical: 5,
  },
})
