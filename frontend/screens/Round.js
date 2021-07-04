import React from 'react'
import {
  ActivityIndicator,
  Dimensions,
  Modal,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
} from 'react-native'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { BlurView } from '@react-native-community/blur'
import Feather from 'react-native-vector-icons/Feather'
import Icon5 from 'react-native-vector-icons/FontAwesome5'
import Icon from 'react-native-vector-icons/FontAwesome'
import Swiper from 'react-native-deck-swiper'
import PropTypes from 'prop-types'
import global from '../../global.js'
import Alert from '../modals/Alert.js'
import modalStyles from '../../styles/modalStyles.js'
import RoundCard from '../cards/RoundCard.js'
import socket from '../apis/socket.js'
import screenStyles from '../../styles/screenStyles.js'
import normalize from '../../styles/normalize.js'
import {
  updateSession,
  setHost,
  setMatch,
  setTop,
  setDisable,
  showRefresh,
  hideDisable,
  hideRefresh,
} from '../redux/Actions.js'

const height = Dimensions.get('window').height

class Round extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      instr: true,
      index: 1,
      leave: false,
      count: 0,
    }

    socket.getSocket().once('match', (data) => {
      this.props.showRefresh()
      socket.getSocket().off()
      this.props.setMatch(this.props.session.resInfo.find((x) => x.id === data))
      this.props.navigation.replace('Match')
    })

    socket.getSocket().on('update', (res) => {
      this.props.updateSession(res)
      this.props.setHost(res.members[res.host].username === this.props.username)
    })

    socket.getSocket().once('top 3', (res) => {
      this.props.showRefresh()
      socket.getSocket().off()
      let restaurants = this.props.session.resInfo.filter((x) => res.choices.includes(x.id))
      restaurants.forEach((x) => (x.likes = res.likes[res.choices.indexOf(x.id)]))
      this.props.setTop(restaurants.reverse())
      this.props.navigation.replace('TopThree')
    })
  }

  leave() {
    this.props.setDisable()
    socket.getSocket().off()
    socket.leave()
    this.props.hideDisable()
    this.props.navigation.replace('Home')
  }

  componentDidMount() {
    this.props.hideRefresh()
    if (this.props.session.members[global.uid] !== 'undefined') {
      for (var i = 0; i < this.props.session.resInfo.length; i++) {
        if (this.props.session.resInfo[i].id === this.props.session.members[global.uid].card) {
          this.deck.jumpToCardIndex(i + 1)
          this.setState({ index: i + 2, count: i + 1 })
        }
      }
    }
  }

  render() {
    return (
      <View style={styles.mainContainer}>
        <View style={screenStyles.screenBackground}>
          <Swiper
            ref={(deck) => (this.deck = deck)}
            cards={this.props.session.resInfo}
            cardStyle={styles.card}
            cardIndex={0}
            renderCard={(card) => <RoundCard card={card} />}
            stackSize={3}
            disableBottomSwipe
            disableTopSwipe
            onSwipedAll={() => {
              socket.getSocket().off()
              //let backend know you're done
              socket.finishedRound()
              //go to the loading page
              this.props.navigation.replace('Loading', {
                restaurants: this.props.session.resInfo,
              })
            }}
            onSwiped={() => {
              if (this.state.index !== this.props.session.resInfo.length) {
                this.setState({ index: this.state.index + 1 })
              }
            }}
            onSwipedRight={(cardIndex) => {
              socket.likeRestaurant(this.props.session.resInfo[cardIndex].id)
            }}
            onSwipedLeft={(cardIndex) => {
              socket.dislikeRestaurant(this.props.session.resInfo[cardIndex].id)
            }}
            stackSeparation={0}
            backgroundColor="transparent"
            animateOverlayLabelsOpacity
          >
            <Text style={[screenStyles.text, styles.title, styles.topMargin]}>Get chews-ing!</Text>
            <TouchableHighlight
              disabled={this.props.disable}
              onPress={() => {
                this.setState({ leave: true })
              }}
              style={[styles.leaveButton, styles.topMargin]}
              underlayColor="transparent"
            >
              <View style={styles.centerAlign}>
                <Icon5 name="door-open" style={[screenStyles.text, styles.door]} />
                <Text style={([screenStyles.text], styles.black)}>Leave</Text>
              </View>
            </TouchableHighlight>
            <Text style={[screenStyles.text, styles.topMargin, styles.restaurant]}>
              Restaurant {this.state.index}/{this.props.session.resInfo.length}
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
              disabled={this.state.count > this.props.session.resInfo.length || this.props.disable}
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
              disabled={this.state.count > this.props.session.resInfo.length || this.props.disable}
            >
              <Icon name="heart" style={[screenStyles.text, styles.heart]} />
            </TouchableHighlight>
          </View>
        </View>
        {this.state.leave && (
          <Alert
            title="Leave Round"
            body="Are you sure you want to leave?"
            buttonAff="Leave"
            buttonNeg="Back"
            height="25%"
            twoButton
            disabled={this.props.disable}
            press={() => this.leave()}
            cancel={() => {
              this.setState({ leave: false })
              this.props.hideDisable()
            }}
          />
        )}
        <Modal transparent={true} animationType={'none'} visible={this.props.refresh}>
          <ActivityIndicator
            color="white"
            size={50}
            animating={this.props.refresh}
            style={screenStyles.loading}
          />
        </Modal>
        {(this.props.refresh || this.state.leave) && (
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
    session: state.session.session,
    username: state.username.username,
    disable: state.disable,
    refresh: state.refresh,
  }
}

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      updateSession,
      setHost,
      setMatch,
      setTop,
      setDisable,
      showRefresh,
      hideDisable,
      hideRefresh,
    },
    dispatch,
  )

export default connect(mapStateToProps, mapDispatchToProps)(Round)

Round.propTypes = {
  session: PropTypes.object,
  navigation: PropTypes.object,
  updateSession: PropTypes.func,
  setHost: PropTypes.func,
  username: PropTypes.string,
  setMatch: PropTypes.func,
  setTop: PropTypes.func,
  setDisable: PropTypes.func,
  hideDisable: PropTypes.func,
  disable: PropTypes.bool,
  hideRefresh: PropTypes.func,
  showRefresh: PropTypes.func,
  refresh: PropTypes.bool,
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
  // topMargin: { marginTop: '7%' },
  topMargin: { marginTop: height * 0.035 },
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
  x: { color: '#6A6A6A', fontSize: normalize(45), marginTop: '-6%' },
  rightArrow: { fontSize: normalize(15), marginLeft: '1%' },
  heart: { fontSize: normalize(35), marginTop: '-3%' },
})
