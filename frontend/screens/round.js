import React from 'react'
import { StyleSheet, Text, TouchableHighlight, View } from 'react-native'
import Icon5 from 'react-native-vector-icons/FontAwesome5'
import Icon from 'react-native-vector-icons/FontAwesome'
import Feather from 'react-native-vector-icons/Feather'
import Swiper from 'react-native-deck-swiper'
import PropTypes from 'prop-types'
import RoundCard from '../cards/roundCard.js'
import socket from '../apis/socket.js'
import screenStyles from '../../styles/screenStyles.js'
import Tooltip from 'react-native-walkthrough-tooltip'

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
    // console.log('round.js: ' + JSON.stringify(this.props.navigation.state.params.code))
    // console.log('round.js ' + JSON.stringify(this.state.results))
  }

  componentWillUnmount() {
    this._isMounted = false
  }

  // endGroup() {
  //   socket.endSession()
  //   socket.getSocket().on('leave', () => {
  //     this.props.navigation.navigate('Home')
  //   })
  // }

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
            cardStyle={{ justifyContent: 'center' }}
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
              style={[
                screenStyles.text,
                { fontSize: 20, fontWeight: 'bold', textAlign: 'center', marginTop: '7%' },
              ]}
            >
              Get chews-ing!
            </Text>
            <TouchableHighlight
              onPress={() => this.leaveGroup()}
              style={{ position: 'absolute', marginLeft: '5%', marginTop: '7%' }}
              underlayColor="transparent"
            >
              <View style={{ alignItems: 'center' }}>
                <Icon5
                  name="door-open"
                  style={[screenStyles.text, { color: 'black', fontSize: 20 }]}
                />
                <Text style={([screenStyles.text], { color: 'black' })}>Leave</Text>
              </View>
            </TouchableHighlight>
            <Text
              style={[
                screenStyles.text,
                { textAlign: 'right', fontSize: 15, marginRight: '7%', marginTop: '7%' },
              ]}
            >
              Restaurant {this.state.index}/{this.state.results.length}
            </Text>
          </Swiper>
        </View>
        <View
          style={{
            flex: 0.05,
            flexDirection: 'row',
            justifyContent: 'space-around',
            alignItems: 'center',
            marginBottom: '7%',
            marginRight: '10%',
            marginLeft: '10%',
          }}
        >
          <View>
            <Tooltip
              isVisible={this.state.instr}
              content={
                <View style={{ flexDirection: 'row-reverse' }}>
                  <Text style={[screenStyles.text, { color: 'white', fontSize: 12 }]}>
                    swipe left to dislike
                  </Text>
                  <Feather
                    name="arrow-left"
                    style={{ color: 'white', fontSize: 15, marginRight: '1%' }}
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
              style={{ backgroundColor: 'transparent' }}
            >
              <Feather name="x" style={[screenStyles.text, { color: '#6A6A6A', fontSize: 45 }]} />
            </TouchableHighlight>
          </View>
          <View>
            <Tooltip
              isVisible={this.state.instr}
              content={
                <View style={{ flexDirection: 'row' }}>
                  <Text style={[screenStyles.text, { color: 'white', fontSize: 12 }]}>
                    swipe right to like
                  </Text>
                  <Feather
                    name="arrow-right"
                    style={{ color: 'white', fontSize: 15, marginLeft: '1%' }}
                  />
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
              style={{ backgroundColor: 'transparent', marginTop: '1%' }}
            >
              <Icon name="heart" style={[screenStyles.text, { fontSize: 35 }]} />
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
})
