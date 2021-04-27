import React from 'react'
import { bindActionCreators } from 'redux'
import { BlurView } from '@react-native-community/blur'
import { connect } from 'react-redux'
import { ActivityIndicator, Dimensions, Linking, Modal, StyleSheet, Text, TouchableHighlight, View } from 'react-native'
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps'
import Icon from 'react-native-vector-icons/FontAwesome'
import PropTypes from 'prop-types'
import colors from '../../styles/colors.js'
import mapStyle from '../../styles/mapStyle.json'
import MatchCard from '../cards/MatchCard.js'
import modalStyles from '../../styles/modalStyles.js'
import normalize from '../../styles/normalize.js'
import screenStyles from '../../styles/screenStyles.js'
import { updateSession, setDisable, showRefresh, hideDisable, hideRefresh } from '../redux/Actions.js'
import socket from '../apis/socket.js'

// the card for the restaurant match
class Match extends React.Component {
  constructor(props) {
    super(props)
  }

  leave() {
    this.props.setDisable()
    socket.getSocket().off()
    socket.leave('match')
    this.props.navigation.replace('Home')
    this.props.hideDisable()
  }

  componentDidMount() {
    this.props.hideRefresh()
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.headerContainer} /*Header for header text and heart icon */>
          <Text style={[screenStyles.textBold, styles.title]}>WeChews you!</Text>
          <Icon name="heart" style={[styles.general, styles.heart]} />
        </View>
        <View style={styles.restaurantCardContainer} /*Restaurant card*/>
          <MatchCard card={this.props.match} />
          <View style={[styles.mapContainer, styles.map]}>
            <MapView
              provider={PROVIDER_GOOGLE}
              customMapStyle={mapStyle}
              style={styles.map}
              region={{
                latitude: this.props.match.latitude,
                longitude: this.props.match.longitude,
                latitudeDelta: 0.015,
                longitudeDelta: 0.015,
              }}
            >
              <Marker
                coordinate={{
                  latitude: this.props.match.latitude,
                  longitude: this.props.match.longitude,
                }}
              />
            </MapView>
          </View>
        </View>
        <TouchableHighlight //Button to open restaurant on yelp
          underlayColor="white"
          style={[screenStyles.bigButton, styles.yelpButton]}
          onPress={() => Linking.openURL(this.props.match.url)}
        >
          <Text style={[screenStyles.bigButtonText, styles.white]}>Open on Yelp</Text>
        </TouchableHighlight>
        {this.props.match.phone !== '' && (
          <TouchableHighlight
            /* Button to call phone # */
            style={[screenStyles.bigButton, styles.callButton]}
            onPress={() => Linking.openURL(`tel:${this.props.match.phone}`)}
          >
            <Text style={[screenStyles.bigButtonText, { color: colors.hex }]}>
              Call: {this.props.match.phone}
            </Text>
          </TouchableHighlight>
        )}
        <Text /* Link to exit round */
          disabled={this.props.disable}
          style={[screenStyles.bigButtonText, styles.exitRoundText]}
          onPress={() => this.leave()}
        >
          Exit Round
        </Text>
          <Modal transparent={true} animationType={'none'} visible={this.props.refresh}>
            <ActivityIndicator
              color="white"
              size={50}
              animating={this.props.refresh}
              style={screenStyles.loading}
            />
        </Modal>
          {(this.props.refresh) && (
            <BlurView
              blurType="dark"
              blurAmount={10}
              reducedTransparencyFallbackColor="white"
              style={modalStyles.blur}
            />
          )}
      </View>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    match: state.match.match,
    disable: state.disable,
    refresh: state.refresh
  }
}

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      updateSession,
      setDisable,
      showRefresh,
      hideDisable,
      hideRefresh,
    },
    dispatch,
  )

export default connect(mapStateToProps, mapDispatchToProps)(Match)

Match.propTypes = {
  //navig should contain navigate fx + state, which contains params which contains the necessary restaurant arr
  navigation: PropTypes.shape({
    replace: PropTypes.func,
  }),
  updateSession: PropTypes.func,
  match: PropTypes.object,
  setDisable: PropTypes.func,
  hideDisable: PropTypes.func,
  disable: PropTypes.bool,
  hideRefresh: PropTypes.func,
  showRefresh: PropTypes.func,
  refresh: PropTypes.bool
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'space-evenly',
  },
  title: { fontSize: normalize(33), marginHorizontal: '3%' },
  heart: { fontSize: normalize(35), paddingVertical: '1%' },
  general: {
    fontFamily: screenStyles.medium.fontFamily,
    color: colors.hex,
    textAlign: 'center',
  },
  /* Alignment for header text and icon on top of screen */
  headerContainer: {
    flexDirection: 'row',
    alignContent: 'center',
    justifyContent: 'center',
    padding: '1%',
    paddingTop: '5%',
  },
  /* Container holding the restaurant details and map */
  restaurantCardContainer: {
    marginHorizontal: '9%',
    padding: '2%',
    borderRadius: 14, //roundness of border
    height: '65%',
    width: '82%',
  },
  //To give the Google Map rounded bottom edges
  mapContainer: {
    borderBottomLeftRadius: 14,
    borderBottomRightRadius: 14,
    overflow: 'hidden', //hides map overflow
  },
  map: {
    alignSelf: 'center',
    justifyContent: 'flex-end',
    height: Dimensions.get('window').height * 0.4,
    width: Dimensions.get('window').width * 0.82,
  },
  //Styling for Google map for restaurant
  /* For "Open on Yelp" button */
  yelpButton: {
    backgroundColor: colors.hex,
    height: '4%',
    justifyContent: 'center',
    alignSelf: 'center',
    borderColor: colors.hex,
    marginTop: '8%',
  },
  /* For "Call number" button */
  callButton: {
    backgroundColor: 'white',
    height: '4%',
    justifyContent: 'center',
    alignSelf: 'center',
    borderColor: colors.hex,
  },
  /* Text for exit round link */
  exitRoundText: {
    color: colors.darkGray,
    justifyContent: 'center',
    alignSelf: 'center',
    width: '65%',
    height: '4%',
    marginBottom: '4%',
  },
  white: { color: 'white' },
})
