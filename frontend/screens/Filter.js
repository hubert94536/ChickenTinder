/* eslint-disable prettier/prettier */
import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux';
import {
  PermissionsAndroid,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
} from 'react-native'
// import { BlurView } from '@react-native-community/blur'
import Geolocation from 'react-native-geolocation-service'
import { hideError, showError } from '../redux/Actions.js'
import PropTypes from 'prop-types'
import Swiper from 'react-native-swiper'
import Alert from '../modals/Alert.js'
import ChooseFriends from '../modals/ChooseFriends.js'
import Socket from '../apis/socket.js'
import TagsView from '../TagsView.js'
import DynamicTags from '../TagsViewGenerator.js'
import BackgroundButton from '../BackgroundButton.js'
import colors from '../../styles/colors.js'
import global from '../../global.js'
import Location from '../modals/ChooseLocation.js'
import Time from '../modals/ChooseTime.js'
import Size from '../modals/ChooseSize.js'
import Majority from '../modals/ChooseMajority.js'
import screenStyles from '../../styles/screenStyles.js'
// import modalStyles from '../../styles/modalStyles.js'

const font = 'CircularStd-Medium'

const BACKGROUND_COLOR = 'white'
const BORDER_COLOR = colors.hex
const TEXT_COLOR = colors.hex
const ACCENT_COLOR = colors.hex

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

const tagsSizes = [10, 20, 30, 40, 50]

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
      this.props.setBlur(true)
    })
}

const date = new Date()

class FilterSelector extends React.Component {
  constructor(props) {
    super(props)
    const date = new Date()

    this.state = {
      // Filters
      distance: 5,
      location: null,

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
      selectedSize: [ 10 ],
      selectedMajority: ['All'],

      // MODALS
      chooseFriends: false,
      chooseLocation: false,
      chooseMajority: false,
      chooseSize: false,
      chooseTime: false,

      // ALERTS
      locationAlert: false,

      // SWIPER
      swiperIndex: 0,
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
          categories.push('newamerican')
          categories.push('diners')
          break
        case 'European':
          categories.push('french')
          categories.push('british')
          categories.push('spanish')
          categories.push('portuguese')
          categories.push('german')
          categories.push('austrian')
          break
        case 'Latin American':
          categories.push('latin')
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
          categories.push('indpak')
          categories.push('pakistani')
          categories.push('afghan')
          categories.push('bangladeshi')
          categories.push('himalayan')
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
          categories.push('mideastern')
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
    if (categories.length == 0) return null
    else return categories.toString()
  }

  // this will pass the filters to the groups page
  handlePress(setFilters) {
    if (global.isHost) {
      Socket.startSession(setFilters)
    }
  }

  //  formats the filters to call yelp api
  evaluateFilters() {
    const filters = {}
    let unix = null
    //  convert to unix time
    if (this.state.asap) {
      unix = Math.floor(Date.now() / 1000)
    } else {
      const dd = date.getDate()
      const mm = date.getMonth()
      const yyyy = date.getFullYear()
      const timezone = date.getTimezoneOffset()
      unix = Date.UTC(yyyy, mm, dd, this.state.hour, this.state.minute + timezone) / 1000
    }
    filters.open_at = unix
    filters.price = this.state.selectedPrice.map((item) => item.length).sort().toString()
    // puts the cuisine and restrictions into one array
    const selections = this.state.selectedCuisine.concat(this.state.selectedRestriction)
    filters.categories = this.categorize(selections)
    filters.radius = this.state.distance * 1600
    filters.majority = this.state.majority
    filters.groupSize = this.props.members.length
    filters.limit = this.state.selectedSize[0]
    //  making sure we have a valid location

    if (this.state.location === null) {
      this.setState({ locationAlert: true })
      this.props.setBlur(true)
    } else {
      filters.latitude = this.state.location.latitude
      filters.longitude = this.state.location.longitude
      this.handlePress(filters)
    }
  }

  startSession() {
    if (this.state.useCurrentLocation === false && this.state.location === null) {
      // this.props.setBlur(true)
      this.setState({ locationAlert: true })

    } else if (this.state.majority && this.state.distance) {
      this.evaluateFilters()
    }
  }

  submitUserFilters() {
    const filters = {}
    // puts the cuisine and restrictions into one array
    const selections = this.state.selectedCuisine.concat(this.state.selectedRestriction)
    filters.categories = this.categorize(selections)
    console.log('userfilters: ' + JSON.stringify(filters.categories))
    Socket.submitFilters(filters.categories)
    this.props.handleUpdate()
  }

  render() {
    let tagsMajority = []
    let size = this.props.members.length
    let half = Math.ceil(size * 0.5)
    let twoThirds = Math.ceil(size * 0.66)
    tagsMajority.push(half)
    if (twoThirds != half) tagsMajority.push(twoThirds)
    tagsMajority.push('All')
    tagsMajority.push('Custom: ')

    return (
      <View style={styles.mainContainer}>

        {/* Title */}
        {global.isHost && (
          <View style={styles.titles}>
            <View style={styles.titleContainer}>
              <Text
                style={[
                  screenStyles.text,
                  styles.filterHeader,
                  { textAlign: 'center', color: this.state.swiperIndex == 0 ? TEXT_COLOR : 'gainsboro' },
                ]}
              >
                Group Settings
                </Text>
            </View>
            <View style={styles.titleContainer, {}}>
              <Text
                style={[
                  screenStyles.text,
                  styles.filterHeader,
                  { textAlign: 'center', color: this.state.swiperIndex == 1 ? TEXT_COLOR : 'gainsboro' }
                ]}
              >
                Your Filters
              </Text>
            </View>
          </View>
        )}
        {!global.isHost && (
          <View style={
            styles.titleContainer,
            {
              flexDiretion: 'row',
              alignItems: 'center',
              justifyContent: 'center'
            }
          }>
            <Text
              style={[
                screenStyles.text,
                styles.filterHeader,
              ]}
            >
              Your Filters
              </Text>
          </View>
        )}
        <Swiper
          loop={false}
          showsPagination={global.isHost}
          activeDotColor={ACCENT_COLOR}
          paginationStyle={{ bottom: -10 }}
          onIndexChanged={(index) => this.setState({ swiperIndex: index })}
          disableScrollViewPanResponder={true}
        >
          {global.isHost && (
            <View style={styles.swiperContainer}>
              {/* TODO: Update Buttom Label */}
              {/* Majority Rule */}
              <View style={styles.filterGroupContainer}>
                <View style={{ flexDirection: 'row' }}>
                  <Text style={[screenStyles.text, styles.filterTitleText]}>Majority</Text>
                  <Text style={styles.filterSubtext}>Members (out of {this.props.members.length}) needed to get a match</Text>
                </View>
                <DynamicTags
                  all={tagsMajority}
                  selected={this.state.selectedMajority}
                  selectedNum={this.state.majority}
                  isExclusive={true}
                  onChange={(event) => {
                    if (event[0] === 'Custom: ') {
                      this.setState({ chooseMajority: true })
                      this.props.setBlur(true)
                    } else if (event[0] === 'All') {
                      this.setState({ majority: this.props.members.length })
                    } else {
                      this.setState({ majority: parseInt(event[0]) })
                      // console.log(this.state.majority)
                    }
                    this.setState({ selectedMajority: event })
                  }}
                />
              </View>


              {/* TODO: Update Buttom Label */}
              {/* Round Size */}
              <View style={styles.filterGroupContainer}>
                <View style={{ flexDirection: 'row' }}>
                  <Text style={[screenStyles.text, styles.filterTitleText]}>Round Size</Text>
                  <Text style={styles.filterSubtext}>Max number of restaurants</Text>
                </View>
                <TagsView
                  all={tagsSizes}
                  selected={this.state.selectedSize}
                  isExclusive={true}
                  ACCENT_COLOR={ACCENT_COLOR}
                  onChange={(event) => {
                    if (event[0] === 'Custom: ') {
                      this.setState({ chooseSize: true })
                      this.props.setBlur(true)
                    }
                    this.setState({ selectedSize: event, size: event[0] })
                  }}
                />
              </View>

              {/* DISTANCE */}
              <View style={styles.filterGroupContainer}>
                <View style={{ flexDirection: 'row' }}>
                  <Text style={[screenStyles.text, styles.filterTitleText]}>Distance</Text>
                  <Text style={styles.filterSubtext}>({this.state.distance} miles)</Text>
                </View>
                <BackgroundButton
                    backgroundColor={this.state.asap ? BACKGROUND_COLOR : ACCENT_COLOR}
                    textColor={this.state.asap ? ACCENT_COLOR : BACKGROUND_COLOR}
                    borderColor={BORDER_COLOR}
                    onPress={() => {
                      this.setState({ chooseLocation: true })
                      this.props.setBlur(true)
                    }}
                    title={'Choose Location'}
                />
              </View>

              {/* PRICE */}
              <View style={styles.filterGroupContainer}>
                <View style={{ flexDirection: 'row' }}>
                  <Text style={[screenStyles.text, styles.filterTitleText]}>Price</Text>
                  <Text style={styles.filterSubtext}>Select all that apply</Text>
                </View>
                <TagsView
                  ACCENT_COLOR={ACCENT_COLOR}
                  TEXT_COLOR={TEXT_COLOR}
                  all={tagsPrice}
                  selected={this.state.selectedPrice}
                  isExclusive={false}
                  onChange={(event) => this.setState({ selectedPrice: event })}
                />
              </View>

              {/* TIME */}
              <View style={styles.filterGroupContainer}>
                <View style={{ flexDirection: 'row' }}>
                  <Text style={[screenStyles.text, styles.filterTitleText]}>Time</Text>
                  <Text style={styles.filterSubtext}>Select when to eat</Text>
                </View>
                <View style={styles.buttonContainer}>
                  <BackgroundButton
                    backgroundColor={this.state.asap ? ACCENT_COLOR : BACKGROUND_COLOR}
                    textColor={this.state.asap ? BACKGROUND_COLOR : ACCENT_COLOR}
                    borderColor={BORDER_COLOR}
                    onPress={() => {
                      const hr = date.getUTCHours()
                      const min = date.getUTCMinutes()
                      this.setState({ hour: hr, minute: min, asap: true })
                    }}
                    title={'ASAP'}
                  />
                  <BackgroundButton
                    backgroundColor={!this.state.asap ? ACCENT_COLOR : BACKGROUND_COLOR}
                    textColor={!this.state.asap ? BACKGROUND_COLOR : ACCENT_COLOR}
                    borderColor={BORDER_COLOR}
                    onPress={() => {
                      this.setState({ chooseTime: true, asap: false })
                      this.props.setBlur(true)
                    }}
                    title={'Set Time'}
                  />
                </View>
              </View>
            </View>
          )}
          <View style={styles.swiperContainer}>
            {/* CUISINES */}
            <View style={styles.bigFilterGroupContainer}>
              <View style={{ flexDirection: 'row' }}>
                <Text style={[screenStyles.text, styles.filterTitleText]}>Cuisines</Text>
                <Text style={styles.filterSubtext}>Select all that apply</Text>
              </View>
              <TagsView
                ACCENT_COLOR={ACCENT_COLOR}
                all={tagsCuisine}
                selected={this.state.selectedCuisine}
                isExclusive={false}
                onChange={(event) => this.setState({ selectedCuisine: event })}
              />

            </View>

            {/* DIETARY RESTRICTIONS */}
            <View style={styles.filterGroupContainer}>
              <View style={{ flexDirection: 'row' }}>
                <Text style={[screenStyles.text, styles.filterTitleText]}>Dietary Restrictions</Text>
                <Text style={styles.filterSubtext}>Select all that apply</Text>
              </View>
              <TagsView
                ACCENT_COLOR={ACCENT_COLOR}
                all={tagsDiet}
                selected={this.state.selectedRestriction}
                isExclusive={false}
                onChange={(event) => this.setState({ selectedRestriction: event })}
              />
            </View>
          </View>
        </Swiper>
        {/* ------------------------------------------ALERTS------------------------------------------ */}
        {/* {(this.state.chooseFriends ||
          this.state.chooseLocation ||
          this.state.chooseMajority ||
          this.state.chooseSize ||
          this.state.chooseTime) && (
            <BlurView
              blurType="dark"
              blurAmount={10}
              reducedTransparencyFallbackColor="white"
              style={modalStyles.blur}
            />
          )} */}
        {this.state.locationAlert && (
          <Alert
            title="Location Required"
            body="Your location is required to find nearby restuarants"
            buttonAff="Close"
            height="23%"
            press={() => {
              this.setState({ locationAlert: false })
              this.props.setBlur(false)
            }}
            cancel={() => {
              this.setState({ locationAlert: false })
              this.props.setBlur(false)
            }}
            visible={this.state.locationAlert}
          />
        )}
        {this.props.error && (
          <Alert
            title="Error, please try again"
            buttonAff="Close"
            height="20%"
            press={() => {
              this.props.hideError()
              this.props.setBlur(false)
            }}
            cancel={() => {
              this.props.hideError()
              this.props.setBlur(false)
            }}
            visible={this.props.error}
          />
        )}

        {/* ------------------------------------------MODALS------------------------------------------ */}
        <ChooseFriends
          visible={this.state.chooseFriends}
          members={this.props.members}
          press={() => {
            this.setState({ chooseFriends: false })
            this.props.setBlur(false)
          }}
        />
        <Time
          visible={this.state.chooseTime}
          cancel={() => {
            this.setState({ chooseTime: false })
            this.setState({ asap: true })
            this.props.setBlur(false)
          }}
          press={(hr, min) => {
            this.setState({ hour: hr, minute: min, chooseTime: false, asap: false })
            this.props.setBlur(false)
          }}
        />
        <Size
          max={50}
          title={'Round Size'}
          filterSubtext={'Choose the max number of restaurants to swipe through'}
          visible={this.state.chooseSize}
          cancel={() => {
            this.setState({ chooseSize: false })
            this.props.setBlur(false)
          }}
          press={(sz) => {
            this.setState({ size: sz, chooseSize: false })
            this.props.setBlur(false)
          }}
        />
        <Majority
          max={this.props.members.length}
          title={'Majority'}
          filterSubtext={'Choose the number of members needed to get a match'}
          visible={this.state.chooseMajority}
          cancel={() => {
            this.setState({ chooseMajority: false })
            this.props.setBlur(false)
          }}
          press={(sz) => {
            // console.log(sz)
            this.setState({ majority: sz, chooseMajority: false })
            this.props.setBlur(false)
          }}
        />
        <Location
          visible={this.state.chooseLocation}
          update={(dist, loc) => {
            this.setState({ 
              chooseLocation: false,
              distance: dist,
              location: loc,
            })
            this.props.setBlur(false)
          }}
          cancel={() => {
            this.setState({ chooseLocation: false })
            this.props.setBlur(false)
          }}
        />
      </View>
    )
  }
}

const mapStateToProps = (state) => {
  const { error } = state
  return { error }
};

const mapDispatchToProps = dispatch => (
  bindActionCreators({
    showError, hideError
  }, dispatch)
);

export default connect(mapStateToProps, mapDispatchToProps)(FilterSelector);

FilterSelector.propTypes = {
  handleUpdate: PropTypes.func,
  setBlur: PropTypes.func,
  members: PropTypes.array,
  // error: PropTypes.bool,
  showError: PropTypes.func,
  hideError: PropTypes.func
}

const styles = StyleSheet.create({
  // Containers
  mainContainer: {
    flex: 1,
    height: '100%',
    backgroundColor: BACKGROUND_COLOR,
    justifyContent: 'space-between',
  },
  titles: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginLeft: '5%',
    marginRight: '5%',
  },
  titleContainer: {
    marginTop: '3%',
    marginBottom: '1%',
  },
  swiperContainer: {
    // flex: 1,
    height: '100%',
    backgroundColor: BACKGROUND_COLOR,
    justifyContent: 'flex-start',
  },
  filterGroupContainer: {
    marginLeft: '5%',
    marginRight: '5%',
    flex: 1,
    justifyContent: 'flex-start',
  },
  bigFilterGroupContainer: {
    marginLeft: '5%',
    marginRight: '5%',
    flex: 1,
    flexGrow: 2,
    flexDirection: 'column',
    justifyContent: 'flex-start',
  },
  filterHeader: {
    fontSize: 26,
    fontWeight: 'bold',
    color: TEXT_COLOR,
    textAlign: 'center',
  },
  filterTitleText: {
    fontSize: 20,
    color: TEXT_COLOR,
    textAlign: 'center',
  },
  filterSubtext: {
    color: TEXT_COLOR,
    fontSize: 12,
    fontFamily: font,
    fontWeight: '100',
    alignSelf: 'center',
    marginLeft: '4%',
    marginTop: '1%',
  },
  header: {
    textAlign: 'left',
    color: TEXT_COLOR,
    fontSize: 20,
    fontWeight: 'bold',
    margin: '1%',
  },
  touchable: {
    width: '50%',
    borderColor: BORDER_COLOR,
    justifyContent: 'center',
    margin: '5%',
  },
  // nextTitle: {
  //   color: TEXT_COLOR,
  //   textAlign: 'center',
  //   fontSize: 25,
  //   paddingTop: '2%',
  //   paddingBottom: '2%',
  // },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingVertical: 5,
  },
})
