import React from 'react'
import { PermissionsAndroid, StyleSheet, Text, View } from 'react-native'
// import { BlurView } from '@react-native-community/blur'
import Geolocation from 'react-native-geolocation-service'
import PropTypes from 'prop-types'
import Alert from '../modals/Alert.js'
import ChooseFriends from '../modals/ChooseFriends.js'
import Socket from '../apis/socket.js'
import FilterButton from '../FilterButton.js'
import colors from '../../styles/colors.js'
import Location from '../modals/ChooseLocation.js'
import Time from '../modals/ChooseTime.js'
import Price from '../modals/ChoosePrice.js'
import Size from '../modals/ChooseSize.js'
import Majority from '../modals/ChooseMajority.js'
import screenStyles from '../../styles/screenStyles.js'
import { FlatList } from 'react-native-gesture-handler'
import CategoryCard from '../cards/CategoryCard.js'

const font = 'CircularStd-Medium'

const BACKGROUND_COLOR = 'white'
const TEXT_COLOR = colors.hex

const cuisines = [
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

const s_categories = {}

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
    this.state = {
      // Set filters
      s_majority: null,
      s_size: null,
      s_radius: null,
      s_location: null,
      s_time: null,
      s_price: null,

      selectedCuisine: [],
      selectedPrice: [],
      selectedRestriction: [],

      // MODALS
      chooseFriends: false,
      chooseMajority: false,
      chooseSize: false,
      chooseLocation: false,
      chooseTime: false,
      choosePrice: false,

      // ALERTS
      locationAlert: false,

      // SWIPER
      swiperIndex: 0,
    }

    cuisines.forEach((item) => (s_categories[item] = false))
    if (requestLocationPermission()) {
      Geolocation.getCurrentPosition(
        (position) => {
          this.setState({
            defaultLocation: {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            },
          })
        },
        (error) => {
          console.log(error.code, error.message)
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
      )
    } else {
      console.log('filter.js: Failed to get location')
    }
  }

  // asks user for permission and get location as the component mounts
  componentDidMount() {
    if (requestLocationPermission()) {
      Geolocation.getCurrentPosition(
        (position) => {
          this.setState({
            d_location: {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            },
          })
        },
        (error) => {
          console.log(error.code, error.message)
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
      )
    } else {
      console.log('Filter.js: Failed to get location')
      this.setState({
        d_location: {
          latitude: 34.070983,
          longitude: -118.444765,
        },
      })
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

  //  formats the filters to call yelp api
  evaluateFilters(session) {
    const filters = {}
    filters.groupSize = this.props.members.length

    // Default filter settings
    let d_majority = Math.ceil(this.props.members.length * 0.75)
    let d_size = 10
    let d_radius = 5.5 * 1600
    let d_time = Math.floor(Date.now() / 1000)
    let d_price = ''

    filters.majority = this.state.s_majority ? this.state.s_majority : d_majority

    filters.limit = this.state.s_size ? this.state.s_size : d_size

    if (this.state.s_location != null) {
      filters.radius = this.state.s_radius * 1600
      filters.latitude = this.state.s_location.latitude
      filters.longitude = this.state.s_location.longitude
    } else {
      filters.radius = d_radius
      filters.latitude = this.state.d_location.latitude
      filters.longitude = this.state.d_location.longitude
    }

    filters.open_at = this.state.s_time ? this.state.s_time : d_time

    filters.price = this.state.s_price ? this.state.s_price : d_price

    // CATEGORIES
    const selections = []
    for (const [key, value] of Object.entries(s_categories)) {
      if (value) selections.push(key)
    }

    filters.categories = this.categorize(selections)

    if (this.props.isHost) {
      Socket.startSession(filters, session)
    }
    this.props.buttonDisable(false)
  }

  startSession(session) {
    this.props.buttonDisable(true)
    this.evaluateFilters(session)
  }

  submitUserFilters() {
    this.props.buttonDisable(true)
    const filters = {}

    const selections = []
    for (const [key, value] of Object.entries(s_categories)) if (value) selections.push(key)
    filters.categories = this.categorize(selections)

    console.log('userfilters: ' + JSON.stringify(filters.categories))
    Socket.submitFilters(filters.categories)
    this.props.handleUpdate()
    this.props.buttonDisable(false)
  }

  render() {
    return (
      <View style={styles.mainContainer}>
        <View
          style={{
            flexDirection: 'column',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          {this.props.isHost && (
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                paddingTop: '5%',
              }}
            >
              {/* Majority Button */}
              <FilterButton
                active={this.state.s_majority != null}
                onPress={() => {
                  console.log('curr majority: ' + this.state.s_majority)
                  this.setState({ chooseMajority: true })
                  this.props.setBlur(true)
                }}
                title="Majority"
              />

              {/* Round Size Button */}
              <FilterButton
                active={this.state.s_size != null}
                onPress={() => {
                  console.log('curr round size: ' + this.state.s_size)
                  this.setState({ chooseSize: true })
                  this.props.setBlur(true)
                }}
                title="Round Size"
              />

              {/* Location Button */}
              <FilterButton
                active={this.state.s_location != null}
                onPress={() => {
                  console.log('curr location: ' + this.state.s_location)
                  this.setState({ chooseLocation: true })
                  this.props.setBlur(true)
                }}
                title="Location"
              />

              {/* Time */}
              <FilterButton
                active={this.state.s_time != null}
                onPress={() => {
                  console.log('curr time: ' + this.state.s_time)
                  this.setState({ chooseTime: true })
                  this.props.setBlur(true)
                }}
                title="Time"
              />

              {/* Price */}
              <FilterButton
                active={this.state.s_price != null}
                onPress={() => {
                  console.log('prices: ' + this.state.s_price)
                  this.setState({ choosePrice: true })
                  this.props.setBlur(true)
                }}
                title="Price"
              />
            </View>
          )}
          <View style={{ paddingTop: '5%' }}>
            <View style={{ flexDirection: 'row' }}>
              <Text style={[screenStyles.text, styles.filterTitleText]}>Cuisines</Text>
              <Text style={styles.filterSubtext}>Select all that apply</Text>
            </View>
            <FlatList
              data={cuisines}
              columnWrapperStyle={{
                justifyContent: 'center',
              }}
              numColumns={5}
              renderItem={({ item }) => {
                return (
                  <CategoryCard
                    uid={1}
                    category={item}
                    onPress={(sel) => {
                      s_categories[item] = sel
                    }}
                  />
                )
              }}
              keyExtractor={(item, index) => index}
            />
          </View>
        </View>
        {/* ------------------------------------------ALERTS------------------------------------------ */}

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
        {/* {this.props.error && (
          <Alert
            title="Error, please try again"
            buttonAff="Close"
            height="20%"
            blur
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
        )}*/}

        {/* ------------------------------------------MODALS------------------------------------------ */}
        <ChooseFriends
          visible={this.state.chooseFriends}
          members={this.props.members}
          press={() => {
            this.setState({ chooseFriends: false })
            this.props.setBlur(false)
          }}
        />

        <Majority
          max={this.props.members.length}
          title={'Majority'}
          filterSubtext={'Choose the number of members needed to get a match'}
          visible={this.state.chooseMajority}
          cancel={(clear) => {
            this.setState({ chooseMajority: false })
            this.props.setBlur(false)
            if (clear) this.setState({ s_majority: null })
          }}
          press={(value) => {
            console.log(this.state.s_majority)
            this.setState({ s_majority: value, chooseMajority: false })
            this.props.setBlur(false)
          }}
        />

        <Size
          max={50}
          title={'Round Size'}
          filterSubtext={'Choose the max number of restaurants to swipe through'}
          visible={this.state.chooseSize}
          cancel={(clear) => {
            this.setState({ chooseSize: false })
            this.props.setBlur(false)
            if (clear) this.setState({ s_size: null })
          }}
          press={(value) => {
            this.setState({ s_size: value, chooseSize: false })
            this.props.setBlur(false)
          }}
        />

        <Time
          visible={this.state.chooseTime}
          cancel={(clear) => {
            this.setState({ chooseTime: false })
            this.props.setBlur(false)
            if (clear) this.setState({ s_time: null })
          }}
          press={(hr, min) => {
            // TODO: Add checking for dates/times in the past
            let dd = date.getDate()
            let mm = date.getMonth()
            let yy = date.getFullYear()
            let tz = date.getTimezoneOffset()
            let time = Date.UTC(yy, mm, dd, hr, min + tz) / 1000
            this.setState({ s_time: time, chooseTime: false })
            this.props.setBlur(false)
          }}
        />

        <Price
          visible={this.state.choosePrice}
          cancel={(clear) => {
            this.setState({ choosePrice: false })
            this.props.setBlur(false)
            if (clear) this.setState({ s_price: null })
          }}
          press={(prices) => {
            this.setState({ s_price: prices, choosePrice: false })
            this.props.setBlur(false)
          }}
        />

        <Location
          visible={this.state.chooseLocation}
          update={(dist, loc) => {
            this.setState({
              chooseLocation: false,
              s_radius: dist,
              s_location: loc,
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

FilterSelector.propTypes = {
  handleUpdate: PropTypes.func,
  setBlur: PropTypes.func,
  members: PropTypes.array,
  // error: PropTypes.bool,
  showError: PropTypes.func,
  hideError: PropTypes.func,
  buttonDisable: PropTypes.func,
  isHost: PropTypes.bool,
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
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingVertical: 5,
  },
})

export default FilterSelector
