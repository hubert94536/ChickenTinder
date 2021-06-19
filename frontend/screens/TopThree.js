import React from 'react'
import {
  ActivityIndicator,
  Dimensions,
  Image,
  ImageBackground,
  Linking,
  Modal,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
} from 'react-native'
import { BlurView } from '@react-native-community/blur'
import FA from 'react-native-vector-icons/FontAwesome'
import Ion from 'react-native-vector-icons/Ionicons'
import Icon from 'react-native-vector-icons/AntDesign'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import PropTypes from 'prop-types'
import colors from '../../styles/colors.js'
import getCuisine from '../assets/images/foodImages.js'
import getStarPath from '../assets/stars/star.js'
import normalize from '../../styles/normalize.js'
import screenStyles from '../../styles/screenStyles.js'
import modalStyles from '../../styles/modalStyles.js'
import socket from '../apis/socket.js'
import { updateSession, setHost, setMatch, showRefresh, hideRefresh } from '../redux/Actions.js'
import _ from 'lodash'

const width = Dimensions.get('window').width
const height = Dimensions.get('window').height

class TopThree extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      chosen: this.props.top.length - 1,
      pressed: false,
    }
    socket.getSocket().once('choose', (ind) => {
      this.props.hideRefresh()
      socket.getSocket().off()
      this.props.setMatch(this.props.top[ind])
      this.props.navigation.replace('Match')
    })

    socket.getSocket().on('update', (res) => {
      this.props.updateSession(res)
      this.props.setHost(res.members[res.host].username === this.props.username)
    })
  }
  evaluateCuisines(cuisines) {
    return cuisines.join(', ')
  }

  randomize() {
    let random = Math.floor(Math.random() * this.props.top.length)
    switch (random) {
      case 0:
        this.setState({ chosen: 0 })
        break
      case 1:
        this.setState({ chosen: 1 })
        break
      case 2:
        this.setState({ chosen: 2 })
        break
    }
  }

  match() {
    this.props.showRefresh()
    socket.choose(this.state.chosen)
  }

  goMatch = _.debounce(this.match.bind(this), 500)

  componentDidMount() {
    this.props.hideRefresh()
  }

  render() {
    let restaurants = this.props.top
    return (
      <View>
        <View style={styles.container}>
          <Text style={[screenStyles.text, styles.title]}>Top 3 Options</Text>
          <Text style={styles.subtitle}>
            Majority was not reached! Chews a restaurant for the group or randomize!
          </Text>
        </View>
        <View style={styles.height}>
          {restaurants.length > 2 && (
            <TouchableHighlight
              disabled={!this.props.isHost}
              underlayColor={colors.beige}
              style={[
                styles.center,
                styles.cardDefault,
                this.state.chosen === 2 ? styles.cardSelected : styles.cardUnselected,
              ]}
              onPress={() => this.setState({ chosen: 2 })}
            >
              <View style={styles.card}>
                <ImageBackground
                  source={getCuisine(restaurants[2].categories)}
                  style={[styles.center, styles.image]}
                />
                <TouchableHighlight
                  style={[
                    styles.tinyButton,
                    this.state.chosen === 2 ? styles.chosenBackground : styles.neutralBackground,
                  ]}
                >
                  <View style={styles.button}>
                    <Icon name="heart" style={[styles.buttonIcon, styles.white]} />
                    <Text style={[screenStyles.text, styles.categories, styles.white]}>
                      {restaurants[2].likes} likes
                    </Text>
                  </View>
                </TouchableHighlight>
                <View style={styles.margin}>
                  <Image source={getStarPath(restaurants[2].rating)} style={styles.center} />
                  <TouchableHighlight
                    underlayColor="transparent"
                    onPress={() => Linking.openURL(restaurants[2].url)}
                  >
                    <View style={styles.yelpInfo}>
                      <Text style={styles.yelp}>{restaurants[2].reviewCount} reviews on yelp</Text>
                      <FA name="yelp" style={styles.red} />
                    </View>
                  </TouchableHighlight>
                  <Text numberOfLines={1} style={[screenStyles.medButtonText, styles.name]}>
                    {restaurants[2].name}
                  </Text>
                  <Text numberOfLines={1} style={[screenStyles.smallButtonText, styles.categories]}>
                    {this.evaluateCuisines(restaurants[2].categories)}
                  </Text>
                </View>
              </View>
            </TouchableHighlight>
          )}
          <TouchableHighlight
            disabled={!this.props.isHost}
            underlayColor={colors.beige}
            style={[
              styles.left,
              styles.cardDefault,
              this.state.chosen === 1 ? styles.cardSelected : styles.cardUnselected,
            ]}
            onPress={() => this.setState({ chosen: 1 })}
          >
            <View style={styles.card}>
              <ImageBackground
                source={getCuisine(restaurants[1].categories)}
                style={[styles.center, styles.image]}
              />
              <TouchableHighlight
                style={[
                  styles.tinyButton,
                  this.state.chosen === 1 ? styles.chosenBackground : styles.neutralBackground,
                ]}
              >
                <View style={styles.button}>
                  <Icon name="heart" style={[styles.buttonIcon, styles.white]} />
                  <Text style={[screenStyles.text, styles.categories, styles.white]}>
                    {restaurants[1].likes} likes
                  </Text>
                </View>
              </TouchableHighlight>
              <View style={styles.margin}>
                <Image source={getStarPath(restaurants[1].rating)} style={styles.center} />
                <TouchableHighlight
                  underlayColor="transparent"
                  onPress={() => Linking.openURL(restaurants[1].url)}
                >
                  <View style={styles.yelpInfo}>
                    <Text style={styles.yelp}>{restaurants[1].reviewCount} reviews on yelp</Text>
                    <FA name="yelp" style={styles.red} />
                  </View>
                </TouchableHighlight>
                <Text numberOfLines={1} style={[screenStyles.medButtonText, styles.name]}>
                  {restaurants[1].name}
                </Text>
                <Text numberOfLines={1} style={[screenStyles.smallButtonText, { fontSize: 15 }]}>
                  {this.evaluateCuisines(restaurants[1].categories)}
                </Text>
              </View>
            </View>
          </TouchableHighlight>
          <TouchableHighlight
            disabled={!this.props.isHost}
            underlayColor={colors.beige}
            style={[
              styles.right,
              styles.cardDefault,
              this.state.chosen === 0 ? styles.cardSelected : styles.cardUnselected,
            ]}
            onPress={() => this.setState({ chosen: 0 })}
          >
            <View style={styles.card}>
              <ImageBackground
                source={getCuisine(restaurants[0].categories)}
                style={[styles.center, styles.image]}
              />
              <TouchableHighlight
                style={[
                  styles.tinyButton,
                  styles.tinyButtonRight,
                  this.state.chosen === 0 ? styles.chosenBackground : styles.neutralBackground,
                ]}
              >
                <View style={styles.button}>
                  <Icon name="heart" style={[styles.buttonIcon, styles.white]} />
                  <Text style={[screenStyles.text, styles.categories, styles.white]}>
                    {restaurants[0].likes} likes
                  </Text>
                </View>
              </TouchableHighlight>
              <View style={styles.margin}>
                <Image source={getStarPath(restaurants[0].rating)} style={styles.center} />
                <TouchableHighlight
                  underlayColor="transparent"
                  onPress={() => Linking.openURL(restaurants[0].url)}
                >
                  <View style={styles.yelpInfo}>
                    <Text style={styles.yelp}>{restaurants[0].reviewCount} reviews on yelp</Text>
                    <FA name="yelp" style={styles.red} />
                  </View>
                </TouchableHighlight>
                <Text numberOfLines={1} style={[screenStyles.medButtonText, styles.name]}>
                  {restaurants[0].name}
                </Text>
                <Text numberOfLines={1} style={[screenStyles.smallButtonText, styles.categories]}>
                  {this.evaluateCuisines(restaurants[0].categories)}
                </Text>
              </View>
            </View>
          </TouchableHighlight>
        </View>
        {this.props.isHost && (
          <TouchableHighlight underlayColor="transparent" onPress={() => this.randomize()}>
            <View style={styles.randomButton}>
              <Ion name="shuffle" style={styles.randomIcon} />
              <Text style={[screenStyles.text, styles.randomText]}>Randomize for me</Text>
            </View>
          </TouchableHighlight>
        )}
        {this.props.isHost && (
          <TouchableHighlight
            underlayColor="white"
            onShowUnderlay={() => this.setState({ pressed: true })}
            onHideUnderlay={() => this.setState({ pressed: false })}
            onPress={() => this.goMatch()}
            style={[screenStyles.bigButton, styles.submitButton]}
          >
            <Text
              style={[
                screenStyles.medButtonText,
                styles.submit,
                this.state.pressed ? screenStyles.hex : styles.white,
              ]}
            >
              Submit
            </Text>
          </TouchableHighlight>
        )}
        {!this.props.isHost && (
          <TouchableHighlight
            disabled={!this.props.isHost}
            underlayColor="white"
            style={[screenStyles.bigButton, styles.waiting]}
          >
            <Text
              style={[screenStyles.medButtonText, 
                      styles.waitingText, 
                      styles.white, 
                      styles.submit]}
            >
              Waiting for Host...
            </Text>
          </TouchableHighlight>
        )}
        <Modal transparent={true} animationType={'none'} visible={this.props.refresh}>
          <ActivityIndicator
            color="white"
            size={50}
            animating={this.props.refresh}
            style={screenStyles.loading}
          />
        </Modal>
        {this.props.refresh && (
          <BlurView
            pointerEvents="none"
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
    isHost: state.isHost.isHost,
    session: state.session.session,
    username: state.username.username,
    top: state.top.top,
    refresh: state.refresh,
  }
}

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      updateSession,
      setHost,
      setMatch,
      showRefresh,
      hideRefresh,
    },
    dispatch,
  )

export default connect(mapStateToProps, mapDispatchToProps)(TopThree)

TopThree.propTypes = {
  navigation: PropTypes.shape({
    replace: PropTypes.func,
    session: PropTypes.object,
    updateSession: PropTypes.func,
    setHost: PropTypes.func,
    username: PropTypes.string,
    isHost: PropTypes.bool,
    top: PropTypes.array,
    setMatch: PropTypes.func,
  }),
  isHost: PropTypes.bool,
  session: PropTypes.object,
  username: PropTypes.string,
  top: PropTypes.array,
  setMatch: PropTypes.func,
  updateSession: PropTypes.func,
  setHost: PropTypes.func,
  hideRefresh: PropTypes.func,
  showRefresh: PropTypes.func,
  refresh: PropTypes.bool,
}

const styles = StyleSheet.create({
  container: { margin: '7%' },
  title: {
    fontSize: normalize(33),
    textAlign: 'center',
    marginBottom: '5%',
    fontWeight: 'bold',
  },
  subtitle: {
    fontFamily: screenStyles.book.fontFamily,
    fontSize: normalize(18),
    textAlign: 'center',
    marginLeft: '5%',
    marginRight: '5%',
    marginBottom: '3%',
  },
  height: { height: '50%' },
  center: { alignSelf: 'center' },
  card: { flex: 1, justifyContent: 'space-between' },
  white: { color: 'white' },
  chosenBackground: { backgroundColor: colors.hex },
  neutralBackground: { backgroundColor: '#c4c4c4' },
  buttonIcon: {
    fontSize: normalize(18),
    margin: '1%',
    marginRight: '3%',
  },
  margin: { margin: '5%' },
  yelpInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  yelp: { fontSize: normalize(12) },
  red: { color: 'red' },
  name: {
    fontSize: normalize(20),
    fontWeight: 'bold',
  },
  categories: { fontSize: normalize(15) },
  left: {
    top: '20%',
    left: '5%',
    alignSelf: 'flex-start',
  },
  right: {
    top: '20%',
    right: '5%',
    alignSelf: 'flex-end',
  },
  randomIcon: {
    fontSize: normalize(50),
    color: colors.hex,
    marginRight: '2%',
  },
  randomButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: height * 0.05,
  },
  randomText: { fontSize: normalize(23), fontWeight: 'bold' },
  submit: {
    fontFamily: screenStyles.book.fontFamily,
    padding: '5%',
    fontSize: normalize(19),
  },
  submitButton: {
    width: '45%',
    borderColor: colors.hex,
    backgroundColor: colors.hex,
    marginBottom:'-15%'
  },
  waiting: {
    borderColor: colors.hex,
    backgroundColor: colors.hex,
    opacity: 0.8,
    marginTop: '25%',
  },
  waitingText: {
    fontWeight: 'bold',
  },
  button: {
    flexDirection: 'row',
    paddingTop: '3%',
    paddingBottom: '3%',
    paddingRight: '10%',
  },
  image: {
    height: width * 0.348,
    width: width * 0.38,
    position: 'absolute',
    overflow: 'hidden',
    marginTop: '2%',
  },
  cardDefault: {
    height: width * 0.58,
    width: width * 0.43,
    position: 'absolute',
    elevation: 1,
    borderRadius: 15,
    borderWidth: 5,
    borderColor: colors.hex,
    backgroundColor: colors.beige,
  },
  cardSelected: {
    elevation: 1,
    borderColor: colors.hex,
  },
  cardUnselected: {
    elevation: 0,
    borderColor: '#c4c4c4',
  },
  tinyButton: {
    width: '50%',
    alignItems: 'center',
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
    borderBottomLeftRadius: 7,
    borderTopLeftRadius: 10,
  },
  tinyButtonRight: {
    alignSelf: 'flex-end',
  },
})
