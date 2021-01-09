import React from 'react'
import { StyleSheet, Text, TouchableHighlight, View } from 'react-native'
import Icon5 from 'react-native-vector-icons/FontAwesome5'
import Icon from 'react-native-vector-icons/FontAwesome'
import Feather from 'react-native-vector-icons/Feather'
import Swiper from 'react-native-deck-swiper'
import PropTypes from 'prop-types'
import RoundCard from '../cards/RoundCard.js'
import socket from '../apis/socket.js'
import screenStyles from '../../styles/screenStyles.js'
import Tooltip from 'react-native-walkthrough-tooltip'
import normalize from '../../styles/normalize.js'

export default class Round extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      results: this.props.navigation.state.params.results,
      host: this.props.navigation.state.params.host,
      isHost: this.props.navigation.state.params.isHost,
      instr: true,
      index: 1,
    }

    socket.getSocket().on('match', (data) => {
      var res
      for (var i = 0; i < this.state.results.length; i++) {
        if (this.state.results[i].id === data) {
          res = this.state.results[i]
          break
        }
      }
      this.props.navigation.replace('Match', {
        restaurant: res,
        host: this.state.host,
        code: this.props.navigation.state.params.code,
        isHost: this.state.isHost,
      })
    })
  }

  likeRestaurant(resId) {
    socket.likeRestaurant(this.props.navigation.state.params.code, resId)
  }

  componentDidMount() {
    this._isMounted = true
  }

  componentWillUnmount() {
    this._isMounted = false
  }

  leaveGroup() {
    socket.leaveRoom(this.props.navigation.state.params.code)
    this.props.navigation.popToTop()
  }

  render() {
    return (
      <View style={styles.mainContainer}>
        <View style={{ flex: 1 }}>
          <Swiper
            ref={(deck) => (this.deck = deck)}
            cards={this.state.results}
            cardStyle={styles.card}
            cardIndex={0}
            renderCard={(card) => <RoundCard card={card} />}
            stackSize={3}
            disableBottomSwipe
            disableTopSwipe
            onSwiped={() => {
              if (this.state.index !== 10) {
                this.setState({ index: this.state.index + 1 })
              }
            }}
            onSwipedRight={(cardIndex) => {
              this.likeRestaurant(this.state.results[cardIndex].id)
            }}
            onSwipedAll={() => {
              //let backend know you're done
              socket.finishedRound(this.props.navigation.state.params.code)
              //go to the loading page
              this.props.navigation.replace('Loading', {
                restaurant: this.state.results,
                host: this.state.host,
                code: this.props.navigation.state.params.code,
                isHost: this.state.isHost,
              })
            }}
            stackSeparation={0}
            backgroundColor="transparent"
            animateOverlayLabelsOpacity
          >
            <Text
              style={[ screenStyles.text, styles.title, styles.topMargin ]}
            >
              Get chews-ing!
            </Text>
            <TouchableHighlight
              onPress={() => this.leaveGroup()}
              style={[styles.leaveButton, styles.topMargin]}
              underlayColor="transparent"
            >
              <View style={styles.centerAlign}>
                <Icon5
                  name="door-open"
                  style={[screenStyles.text, styles.door]}
                />
                <Text style={([screenStyles.text], styles.black)}>Leave</Text>
              </View>
            </TouchableHighlight>
            <Text
              style={[ screenStyles.text, styles.topMargin, styles.restaurant ]}
            >
              Restaurant {this.state.index}/{this.state.results.length}
            </Text>
          </Swiper>
        </View>
        <View
          style={styles.bottom}
        >
          <View>
            <Tooltip
              isVisible={this.state.instr}
              content={
                <View style={styles.rr}>
                  <Text style={[screenStyles.text, styles.white, styles.left]}>
                    swipe left to dislike
                  </Text>
                  <Feather
                    name="arrow-left"
                    style={[styles.white, styles.leftArrow]}
                  />
                </View>
              }
              placement="top"
              backgroundColor="transparent"
              contentStyle={{ backgroundColor: '#6A6A6A' }}
              onClose={() => this.setState({ instr: false })}
            >
              <Text> </Text>
            </Tooltip>
            <TouchableHighlight
              onPress={() => this.deck.swipeLeft()}
              underlayColor="transparent"
              style={styles.background}
            >
              <Feather name="x" style={[screenStyles.text, styles.x]} />
            </TouchableHighlight>
          </View>
          <View>
            <Tooltip
              isVisible={this.state.instr}
              content={
                <View style={styles.rr}>
                  <Feather
                    name="arrow-right"
                    style={[styles.rightArrow, styles.white]}
                  />
                  <Text style={[screenStyles.text, styles.white, styles.left]}>
                    swipe right to like
                  </Text>
                </View>
              }
              placement="top"
              backgroundColor="transparent"
              contentStyle={{ backgroundColor: '#F15763' }}
              onClose={() => this.setState({ instr: false })}
            >
              <Text> </Text>
            </Tooltip>
            <TouchableHighlight
              onPress={() => this.deck.swipeRight()}
              underlayColor="transparent"
              style={styles.background, styles.swipeRight}
            >
              <Icon name="heart" style={[screenStyles.text, styles.heart]} />
            </TouchableHighlight>
          </View>
        </View>
      </View>
    )
  }
}

Round.propTypes = {
  results: PropTypes.array,
  host: PropTypes.string,
  isHost: PropTypes.bool,
  code: PropTypes.number,
  navigation: PropTypes.object,
}

const styles = StyleSheet.create({
  // Fullscreen
  mainContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
    backgroundColor: 'white',
  },
  card: { justifyContent: 'center' },
  topMargin: { marginTop: '7%' },
  title: { 
    fontSize: normalize(20),
    fontWeight: 'bold',
    textAlign: 'center',
  },
  leaveButton: { position: 'absolute', marginLeft: '5%' },
  centerAlign: { alignItems: 'center' },
  door: { color: 'black', fontSize: normalize(20) },
  black: { color: 'black' },
  restaurant: { textAlign: 'right', fontSize: normalize(15), marginRight: '7%' },
  bottom: {
    flex: 0.05,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginBottom: '7%',
    marginRight: '10%',
    marginLeft: '10%',
  },
  rr: { flexDirection: 'row-reverse' },
  white: { color: 'white' },
  left: { fontSize: normalize(12) },
  leftArrow: { fontSize: normalize(15), marginRight: '1%' },
  background: { backgroundColor: 'transparent' },
  x: { color: '#6A6A6A', fontSize: normalize(45) },
  rightArrow: {fontSize: normalize(15), marginLeft: '1%' },
  swipeRight: { marginTop: '1%' },
  heart: { fontSize: normalize(35) }
})
