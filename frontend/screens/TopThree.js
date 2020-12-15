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
import getStarPath from '../assets/stars/star.js'
import screenStyles from '../../styles/screenStyles.js'
import socket from '../apis/socket.js'

const height = Dimensions.get('window').height
const width = Dimensions.get('window').width

const hex = '#F15763'
const font = 'CircularStd-Book'

export default class TopThree extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      first: true,
      second: false,
      third: false,
      restaurants: this.props.navigation.state.params.top,
      host: this.props.navigation.state.params.host,
      code: this.props.navigation.state.params.code,
      isHost: this.props.navigation.state.params.isHost,
      random: Math.floor(Math.random() * 3),
    }

    socket.getSocket().on('choose', (ind) => {
      this.props.navigation.navigate('Match', {
        restaurant: restaurants[ind],
        host: host,
        code: code,
      })
    })

  }

  evaluateCuisines(cuisines) {
    return cuisines.map((item) => item.title).join(', ')
  }

  randomize() {
    switch (this.state.random) {
      case 0:
        this.setState({ first: true, second: false, third: false })
        break
      case 1:
        this.setState({ first: false, second: true, third: false })
        break
      case 2:
        this.setState({ first: false, second: false, third: true })
        break
    }
  }

  goMatch() {
    var chosen
    if (this.state.first) chosen = 0
    if (this.state.first) chosen = 1
    if (this.state.first) chosen = 2
    socket.choose(this.state.code, chosen)
  }

  render() {
    return (
      <View>
        <View style={{ margin: '7%' }}>
          <Text
            style={[
              screenStyles.text,
              { fontSize: 33, textAlign: 'center', marginBottom: '3%', fontWeight: 'bold' },
            ]}
          >
            Top 3 Options
          </Text>
          <Text
            style={{
              fontFamily: font,
              fontSize: 18,
              textAlign: 'center',
              marginLeft: '5%',
              marginRight: '5%',
            }}
          >
            Majority was not reached! Chews a restaurant for the group or randomize!
          </Text>
        </View>
        <View style={{ height: '50%' }}>
          <TouchableHighlight
            disabled={!this.state.isHost}
            underlayColor="#F9E2C2"
            style={[
              { alignSelf: 'center' },
              this.state.first ? styles.cardSelected : styles.cardUnselected,
            ]}
            onPress={() => this.setState({ first: true, second: false, third: false })}
          >
            <View style={{ flex: 1, justifyContent: 'space-between' }}>
              <ImageBackground
                source={this.state.restaurants[0].topImage}
                style={[
                  this.state.first ? styles.imageSelected : styles.imageUnselected,
                  { alignSelf: 'center' },
                ]}
              />
              <TouchableHighlight
                style={[
                  styles.tinyButton,
                  this.state.first ? { backgroundColor: hex } : { backgroundColor: '#c4c4c4' },
                ]}
              >
                <View
                  style={{
                    flexDirection: 'row',
                    paddingTop: '3%',
                    paddingBottom: '3%',
                    paddingRight: '10%',
                  }}
                >
                  <Icon name="heart" style={{ color: 'white', fontSize: 18, margin: '1%' }} />
                  <Text style={[screenStyles.text, { color: 'white', fontSize: 15 }]}>
                    {this.state.restaurants[0].likes} likes
                  </Text>
                </View>
              </TouchableHighlight>
              <View style={{ margin: '5%' }}>
                <Image
                  source={getStarPath(this.state.restaurants[0].rating)}
                  style={{ alignSelf: 'center' }}
                />
                <TouchableHighlight
                  underlayColor="transparent"
                  onPress={() => Linking.openURL(this.state.restaurants[0].url)}
                >
                  <View
                    style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}
                  >
                    <Text style={{ fontSize: 12 }}>
                      {this.state.restaurants[0].reviewCount} reviews on yelp
                    </Text>
                    <FA name="yelp" style={{ color: 'red' }} />
                  </View>
                </TouchableHighlight>
                <Text
                  numberOfLines={1}
                  style={[screenStyles.medButtonText, { fontSize: 20, fontWeight: 'bold' }]}
                >
                  {this.state.restaurants[0].name}
                </Text>
                <Text numberOfLines={1} style={[screenStyles.smallButtonText, { fontSize: 15 }]}>
                  {this.evaluateCuisines(this.state.restaurants[0].categories)}
                </Text>
              </View>
            </View>
          </TouchableHighlight>
          <TouchableHighlight
            disabled={!this.state.isHost}
            underlayColor="#F9E2C2"
            style={[
              { top: '30%', left: '5%', alignSelf: 'flex-start' },
              this.state.second ? styles.cardSelected : styles.cardUnselected,
            ]}
            onPress={() => this.setState({ first: false, second: true, third: false })}
          >
            <View style={{ flex: 1, justifyContent: 'space-between' }}>
              <ImageBackground
                source={this.state.restaurants[1].topImage}
                style={[
                  this.state.second ? styles.imageSelected : styles.imageUnselected,
                  { alignSelf: 'center' },
                ]}
              />
              <TouchableHighlight
                style={[
                  styles.tinyButton,
                  this.state.second ? { backgroundColor: hex } : { backgroundColor: '#c4c4c4' },
                ]}
              >
                <View
                  style={{
                    flexDirection: 'row',
                    paddingTop: '3%',
                    paddingBottom: '3%',
                    paddingRight: '10%',
                  }}
                >
                  <Icon name="heart" style={{ color: 'white', fontSize: 18, margin: '1%' }} />
                  <Text style={[screenStyles.text, { color: 'white', fontSize: 15 }]}>
                    {this.state.restaurants[1].likes} likes
                  </Text>
                </View>
              </TouchableHighlight>
              <View style={{ margin: '5%' }}>
                <Image
                  source={getStarPath(this.state.restaurants[1].rating)}
                  style={{ alignSelf: 'center' }}
                />
                <TouchableHighlight
                  underlayColor="transparent"
                  onPress={() => Linking.openURL(this.state.restaurants[1].url)}
                >
                  <View
                    style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}
                  >
                    <Text style={{ fontSize: 12 }}>
                      {this.state.restaurants[1].reviewCount} reviews on yelp
                    </Text>
                    <FA name="yelp" style={{ color: 'red' }} />
                  </View>
                </TouchableHighlight>
                <Text
                  numberOfLines={1}
                  style={[screenStyles.medButtonText, { fontSize: 20, fontWeight: 'bold' }]}
                >
                  {this.state.restaurants[1].name}
                </Text>
                <Text numberOfLines={1} style={[screenStyles.smallButtonText, { fontSize: 15 }]}>
                  {this.evaluateCuisines(this.state.restaurants[1].categories)}
                </Text>
              </View>
            </View>
          </TouchableHighlight>
          <TouchableHighlight
            disabled={!this.state.isHost}
            underlayColor="#F9E2C2"
            style={[
              { top: '30%', right: '5%', alignSelf: 'flex-end' },
              this.state.third ? styles.cardSelected : styles.cardUnselected,
            ]}
            onPress={() => this.setState({ first: false, second: false, third: true })}
          >
            <View style={{ flex: 1, justifyContent: 'space-between' }}>
              <ImageBackground
                source={this.state.restaurants[2].topImage}
                style={[
                  this.state.third ? styles.imageSelected : styles.imageUnselected,
                  { alignSelf: 'center' },
                ]}
              />
              <TouchableHighlight
                style={[
                  styles.tinyButtonRight,
                  { alignSelf: 'flex-end' },
                  this.state.third ? { backgroundColor: hex } : { backgroundColor: '#c4c4c4' },
                ]}
              >
                <View
                  style={{
                    flexDirection: 'row',
                    paddingTop: '3%',
                    paddingBottom: '3%',
                    paddingRight: '10%',
                  }}
                >
                  <Icon name="heart" style={{ color: 'white', fontSize: 18, margin: '1%' }} />
                  <Text style={[screenStyles.text, { color: 'white', fontSize: 15 }]}>
                    {this.state.restaurants[2].likes} likes
                  </Text>
                </View>
              </TouchableHighlight>
              <View style={{ margin: '5%' }}>
                <Image
                  source={getStarPath(this.state.restaurants[2].rating)}
                  style={{ alignSelf: 'center' }}
                />
                <TouchableHighlight
                  underlayColor="transparent"
                  onPress={() => Linking.openURL(this.state.restaurants[2].url)}
                >
                  <View
                    style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}
                  >
                    <Text style={{ fontSize: 12 }}>
                      {this.state.restaurants[2].reviewCount} reviews on yelp
                    </Text>
                    <FA name="yelp" style={{ color: 'red' }} />
                  </View>
                </TouchableHighlight>
                <Text
                  numberOfLines={1}
                  style={[screenStyles.medButtonText, { fontSize: 20, fontWeight: 'bold' }]}
                >
                  {this.state.restaurants[2].name}
                </Text>
                <Text numberOfLines={1} style={[screenStyles.smallButtonText, { fontSize: 15 }]}>
                  {this.evaluateCuisines(this.state.restaurants[2].categories)}
                </Text>
              </View>
            </View>
          </TouchableHighlight>
        </View>
        {this.state.isHost && (
          <TouchableHighlight underlayColor="transparent" onPress={() => this.randomize()}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '15%',
              }}
            >
              <Ion name="shuffle" style={{ fontSize: 50, color: hex, marginRight: '2%' }} />
              <Text style={[screenStyles.text, { fontSize: 23, fontWeight: 'bold' }]}>
                Randomize for me
              </Text>
            </View>
          </TouchableHighlight>
        )}
        {this.state.isHost && (
          <TouchableHighlight
            underlayColor="white"
            onPress={() => this.goMatch()}
            style={[screenStyles.bigButton, { borderColor: hex, backgroundColor: hex }]}
          >
            <Text
              style={[
                screenStyles.medButtonText,
                { fontFamily: font, color: 'white', padding: '2%' },
              ]}
            >
              Submit
            </Text>
          </TouchableHighlight>
        )}
        {!this.state.isHost && (
          <TouchableHighlight
            disabled={!this.state.isHost}
            underlayColor="white"
            style={[screenStyles.bigButton, { borderColor: hex, backgroundColor: hex, opacity: 0.8, marginTop:'25%'}]}
          >
            <Text
              style={[
                screenStyles.medButtonText,
                { fontFamily: font, color: 'white', padding: '2%', fontWeight:'bold' },
              ]}
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
    state: PropTypes.shape({
      params: PropTypes.shape({
        top: PropTypes.array,
        random: PropTypes.number,
        host: PropTypes.string,
        code: PropTypes.number,
      }),
    }),
  }),
}

const styles = StyleSheet.create({
  imageSelected: {
    height: height * 0.18,
    width: width * 0.38,
    position: 'absolute',
    overflow: 'hidden',
    marginTop: '2%',
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
    borderColor: hex,
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
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 7,
    borderTopRightRadius: 10,
  },
})
