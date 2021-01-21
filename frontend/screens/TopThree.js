import React from 'react'
import {
  Dimensions,
  Image,
  ImageBackground,
  Linking,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
} from 'react-native'
import FA from 'react-native-vector-icons/FontAwesome'
import Ion from 'react-native-vector-icons/Ionicons'
import Icon from 'react-native-vector-icons/AntDesign'
import PropTypes from 'prop-types'
import colors from '../../styles/colors.js'
import getStarPath from '../assets/stars/star.js'
import screenStyles from '../../styles/screenStyles.js'
import socket from '../apis/socket.js'
import getCuisine from '../assets/images/foodImages.js'
import normalize from '../../styles/normalize.js'

const height = Dimensions.get('window').height
const width = Dimensions.get('window').width

const font = 'CircularStd-Book'

export default class TopThree extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      chosen: this.props.navigation.state.params.top.length - 1,
      restaurants: this.props.navigation.state.params.top.reverse(),
    }
    socket.getSocket().once('choose', (ind) => {
      this.props.navigation.replace('Match', {
        restaurant: this.state.restaurants[ind],
        host: global.host,
        code: global.code,
      })
    })
  }
  evaluateCuisines(cuisines) {
    return cuisines.map((item) => item.title).join(', ')
  }

  randomize() {
    var random = Math.floor(Math.random() * this.props.navigation.state.params.top.length)
    console.log(random)
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

  goMatch() {
    socket.choose(global.code, this.state.chosen)
  }

  render() {
    return (
      <View>
        <View style={styles.container}>
          <Text style={[screenStyles.text, styles.title]}>Top 3 Options</Text>
          <Text style={styles.subtitle}>
            Majority was not reached! Chews a restaurant for the group or randomize!
          </Text>
        </View>
        <View style={styles.height}>
          {this.state.restaurants.length > 2 && (
            <TouchableHighlight
              disabled={!global.isHost}
              underlayColor="#F9E2C2"
              style={[
                styles.center,
                this.state.chosen === 2 ? styles.cardSelected : styles.cardUnselected,
              ]}
              onPress={() => this.setState({ chosen: 2 })}
            >
              <View style={styles.card}>
                <ImageBackground
                  source={getCuisine(this.state.restaurants[2].categories)}
                  style={[
                    styles.center,
                    this.state.chosen === 2 ? styles.imageSelected : styles.imageUnselected,
                  ]}
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
                      {this.state.restaurants[2].likes} likes
                    </Text>
                  </View>
                </TouchableHighlight>
                <View style={styles.margin}>
                  <Image
                    source={getStarPath(this.state.restaurants[2].rating)}
                    style={styles.center}
                  />
                  <TouchableHighlight
                    underlayColor="transparent"
                    onPress={() => Linking.openURL(this.state.restaurants[2].url)}
                  >
                    <View style={styles.yelpInfo}>
                      <Text style={styles.yelp}>
                        {this.state.restaurants[2].reviewCount} reviews on yelp
                      </Text>
                      <FA name="yelp" style={styles.red} />
                    </View>
                  </TouchableHighlight>
                  <Text numberOfLines={1} style={[screenStyles.medButtonText, styles.name]}>
                    {this.state.restaurants[2].name}
                  </Text>
                  <Text numberOfLines={1} style={[screenStyles.smallButtonText, styles.categories]}>
                    {this.evaluateCuisines(this.state.restaurants[2].categories)}
                  </Text>
                </View>
              </View>
            </TouchableHighlight>
          )}
          <TouchableHighlight
            disabled={!global.isHost}
            underlayColor="#F9E2C2"
            style={[
              styles.left,
              this.state.chosen === 1 ? styles.cardSelected : styles.cardUnselected,
            ]}
            onPress={() => this.setState({ chosen: 1 })}
          >
            <View style={styles.card}>
              <ImageBackground
                source={getCuisine(this.state.restaurants[1].categories)}
                style={[
                  this.state.chosen === 1 ? styles.imageSelected : styles.imageUnselected,
                  styles.center,
                ]}
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
                    {this.state.restaurants[1].likes} likes
                  </Text>
                </View>
              </TouchableHighlight>
              <View style={styles.margin}>
                <Image
                  source={getStarPath(this.state.restaurants[1].rating)}
                  style={styles.center}
                />
                <TouchableHighlight
                  underlayColor="transparent"
                  onPress={() => Linking.openURL(this.state.restaurants[1].url)}
                >
                  <View style={styles.yelpInfo}>
                    <Text style={styles.yelp}>
                      {this.state.restaurants[1].reviewCount} reviews on yelp
                    </Text>
                    <FA name="yelp" style={styles.red} />
                  </View>
                </TouchableHighlight>
                <Text numberOfLines={1} style={[screenStyles.medButtonText, styles.name]}>
                  {this.state.restaurants[1].name}
                </Text>
                <Text numberOfLines={1} style={[screenStyles.smallButtonText, { fontSize: 15 }]}>
                  {this.evaluateCuisines(this.state.restaurants[1].categories)}
                </Text>
              </View>
            </View>
          </TouchableHighlight>
          <TouchableHighlight
            disabled={!global.isHost}
            underlayColor="#F9E2C2"
            style={[
              styles.right,
              this.state.chosen === 0 ? styles.cardSelected : styles.cardUnselected,
            ]}
            onPress={() => this.setState({ chosen: 0 })}
          >
            <View style={styles.card}>
              <ImageBackground
                source={getCuisine(this.state.restaurants[0].categories)}
                style={[
                  this.state.chosen === 0 ? styles.imageSelected : styles.imageUnselected,
                  styles.center,
                ]}
              />
              <TouchableHighlight
                style={[
                  styles.tinyButtonRight,
                  this.state.chosen === 0 ? styles.chosenBackground : styles.neutralBackground,
                ]}
              >
                <View style={styles.button}>
                  <Icon name="heart" style={[styles.buttonIcon, styles.white]} />
                  <Text style={[screenStyles.text, styles.categories, styles.white]}>
                    {this.state.restaurants[0].likes} likes
                  </Text>
                </View>
              </TouchableHighlight>
              <View style={styles.margin}>
                <Image
                  source={getStarPath(this.state.restaurants[0].rating)}
                  style={styles.center}
                />
                <TouchableHighlight
                  underlayColor="transparent"
                  onPress={() => Linking.openURL(this.state.restaurants[0].url)}
                >
                  <View style={styles.yelpInfo}>
                    <Text style={styles.yelp}>
                      {this.state.restaurants[0].reviewCount} reviews on yelp
                    </Text>
                    <FA name="yelp" style={styles.red} />
                  </View>
                </TouchableHighlight>
                <Text numberOfLines={1} style={[screenStyles.medButtonText, styles.name]}>
                  {this.state.restaurants[0].name}
                </Text>
                <Text numberOfLines={1} style={[screenStyles.smallButtonText, styles.categories]}>
                  {this.evaluateCuisines(this.state.restaurants[0].categories)}
                </Text>
              </View>
            </View>
          </TouchableHighlight>
        </View>
        {global.isHost && (
          <TouchableHighlight underlayColor="transparent" onPress={() => this.randomize()}>
            <View style={styles.randomButton}>
              <Ion name="shuffle" style={styles.randomIcon} />
              <Text style={[screenStyles.text, styles.randomText]}>Randomize for me</Text>
            </View>
          </TouchableHighlight>
        )}
        {global.isHost && (
          <TouchableHighlight
            underlayColor="white"
            onPress={() => this.goMatch()}
            style={[
              screenStyles.bigButton,
              { borderColor: colors.hex, backgroundColor: colors.hex },
            ]}
          >
            <Text style={[screenStyles.medButtonText, styles.submit, styles.white]}>Submit</Text>
          </TouchableHighlight>
        )}
        {!global.isHost && (
          <TouchableHighlight
            disabled={!global.isHost}
            underlayColor="white"
            style={[screenStyles.bigButton, styles.waiting]}
          >
            <Text
              style={[screenStyles.medButtonText, styles.waitingText, styles.white, styles.submit]}
            >
              Waiting for Host...
            </Text>
          </TouchableHighlight>
        )}
      </View>
    )
  }
}

TopThree.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
    replace: PropTypes.func,
    state: PropTypes.shape({
      params: PropTypes.shape({
        top: PropTypes.array,
        // host: PropTypes.string,
        // code: PropTypes.number,
        // isHost: PropTypes.bool,
      }),
    }),
  }),
}

const styles = StyleSheet.create({
  container: { margin: '7%' },
  title: {
    fontSize: normalize(33),
    textAlign: 'center',
    marginBottom: '3%',
    fontWeight: 'bold',
  },
  subtitle: {
    fontFamily: font,
    fontSize: normalize(18),
    textAlign: 'center',
    marginLeft: '5%',
    marginRight: '5%',
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
    marginBottom: '15%',
  },
  randomText: { fontSize: normalize(23), fontWeight: 'bold' },
  submit: {
    fontFamily: font,
    padding: '2%',
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
  imageSelected: {
    height: height * 0.18,
    width: width * 0.38,
    position: 'absolute',
    overflow: 'hidden',
    marginTop: '2%',
  },
  button: {
    flexDirection: 'row',
    paddingTop: '3%',
    paddingBottom: '3%',
    paddingRight: '10%',
  },
  imageUnselected: {
    height: height * 0.18,
    width: width * 0.38,
    position: 'absolute',
    overflow: 'hidden',
    marginTop: '2%',
  },
  cardSelected: {
    height: height * 0.3,
    width: width * 0.43,
    position: 'absolute',
    elevation: 1,
    borderRadius: 15,
    borderWidth: 5,
    borderColor: colors.hex,
    backgroundColor: '#F9E2C2',
  },
  cardUnselected: {
    height: height * 0.3,
    width: width * 0.43,
    position: 'absolute',
    elevation: 0,
    borderRadius: 15,
    borderWidth: 5,
    borderColor: '#c4c4c4',
    backgroundColor: '#F9E2C2',
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
    width: '50%',
    alignItems: 'center',
    alignSelf: 'flex-end',
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 7,
    borderTopRightRadius: 10,
  },
})
