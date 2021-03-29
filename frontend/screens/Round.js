import React from 'react'
import { StyleSheet, Text, TouchableHighlight, View } from 'react-native'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import Icon5 from 'react-native-vector-icons/FontAwesome5'
import Icon from 'react-native-vector-icons/FontAwesome'
import Feather from 'react-native-vector-icons/Feather'
import Swiper from 'react-native-deck-swiper'
import PropTypes from 'prop-types'
import global from '../../global.js'
import RoundCard from '../cards/RoundCard.js'
import socket from '../apis/socket.js'
import screenStyles from '../../styles/screenStyles.js'
import normalize from '../../styles/normalize.js'
import { updateSession } from '../redux/Actions.js'

class Round extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      instr: true,
      index: 1,
      leave: false,
      disabled: false,
      count: 0,
    }
    socket.getSocket().once('match', (data) => {
      socket.getSocket().off()
      var res
      for (var i = 0; i < global.restaurants.length; i++) {
        if (global.restaurants[i].id === data) {
          res = global.restaurants[i]
          break
        }
      }
      this.props.navigation.replace('Match', {
        restaurant: res,
      })
    })
  }

  leave() {
    this.setState({ disabled: true })
    socket.getSocket().off()
    socket.leave('round')
    this.props.updateSession({})
    this.setState({ disabled: false })
    this.props.navigation.replace('Home')
  }


  render() {
    return (
      <View style={styles.mainContainer}>
        <View style={screenStyles.screenBackground}>
          <Swiper
            ref={(deck) => (this.deck = deck)}
            cards={global.restaurants}
            cardStyle={styles.card}
            cardIndex={0}
            renderCard={(card) => <RoundCard card={card} />}
            stackSize={3}
            disableBottomSwipe
            disableTopSwipe
            onSwiped={() => {
              if (this.state.index !== global.restaurants.length) {
                this.setState({ index: this.state.index + 1 })
              }
            }}
            onSwipedRight={(cardIndex) => {
              socket.likeRestaurant(global.restaurants[cardIndex].id)
            }}
            onSwipedAll={() => {
              socket.getSocket().off()
              //let backend know you're done
              socket.finishedRound()
              //go to the loading page
              this.props.navigation.replace('Loading', {
                restaurants: global.restaurants,
              })
            }}
            stackSeparation={0}
            backgroundColor="transparent"
            animateOverlayLabelsOpacity
          >
            <Text style={[screenStyles.text, styles.title, styles.topMargin]}>Get chews-ing!</Text>
            <TouchableHighlight
              disabled={this.state.disabled}
              onPress={() => {
                this.leave()
              }}
              style={[styles.leaveButton, styles.topMargin]}
              underlayColor="transparent"
            >
              <View style={styles.centerAlign}>
                <Icon5 name="door-open" style={[screenStyles.text, styles.door]} />
                <Text style={([screenStyles.text], styles.black)}>
                  Leave
                </Text>
              </View>
            </TouchableHighlight>
            <Text style={[screenStyles.text, styles.topMargin, styles.restaurant]}>
              Restaurant {this.state.index}/{global.restaurants.length}
            </Text>
          </Swiper>
        </View>
        <View style={styles.bottom}>
          <View>
            <TouchableHighlight
              onPress={() => {
                this.deck.swipeLeft()
                this.setState({ count: this.state.count + 1 })
              }}
              underlayColor="transparent"
              style={styles.background}
              disabled={this.state.count > global.restaurants.length || this.state.disabled}
            >
              <Feather name="x" style={[screenStyles.text, styles.x]} />
            </TouchableHighlight>
          </View>
          <View>
            <TouchableHighlight
              onPress={() => {
                this.deck.swipeRight()
                this.setState({ count: this.state.count + 1 })
              }}
              underlayColor="transparent"
              style={[styles.background]}
              disabled={this.state.count > global.restaurants.length || this.state.disabled}
            >
              <Icon name="heart" style={[screenStyles.text, styles.heart]} />
            </TouchableHighlight>
          </View>
        </View>
      </View>
    )
  }
}

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      updateSession,
    },
    dispatch,
  )

export default connect(null, mapDispatchToProps)(Round)

Round.propTypes = {
  navigation: PropTypes.object,
  updateSession: PropTypes.func,
}

const styles = StyleSheet.create({
  // Fullscreen
  mainContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    zIndex: 2,
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
  rightArrow: { fontSize: normalize(15), marginLeft: '1%' },
  heart: { fontSize: normalize(35) },
})
