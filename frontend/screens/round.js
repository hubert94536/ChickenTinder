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
    }
    socket.getSocket().on('match', (data) => {
      this.props.navigation.navigate('Match', {
        restaurant: data.restaurant,
        host: this.state.host,
      })
    })

    socket.getSocket().on('exception', (error) => {
      console.log(error)
    })
  }

  likeRestaurant(resId) {
    socket.likeRestaurant(this.state.host, resId)
  }

  componentDidMount() {
    this._isMounted = true
  }

  componentWillUnmount() {
    this._isMounted = false
  }

  endGroup() {
    socket.endSession()
    socket.getSocket().on('leave', () => {
      this.props.navigation.navigate('Home')
    })
  }

  leaveGroup() {
    socket.leaveRoom()
    this.props.navigation.navigate('Home')
  }

  render() {
    return (
      <View style={styles.mainContainer}>
        <View style={{ flex: 1 }}>
          <Swiper
            cards={this.state.results}
            cardStyle={{ justifyContent: 'center' }}
            cardIndex={0}
            renderCard={(card) => <RoundCard card={card} />}
            stackSize={3}
            disableBottomSwipe
            disableTopSwipe
            onSwipedRight={(cardIndex) => this.likeRestaurant(this.state.results[cardIndex].id)}
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
              onPress={() => this.endGroup()}
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
              Restaurant 2/20
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
          <Tooltip
            isVisible={this.state.instr}
            content={
              <View style={{ flexDirection: 'row' }}>
                <Feather
                  name="arrow-left"
                  style={{ color: 'white', fontSize: 15, marginRight: '1%' }}
                />
                <Text style={[screenStyles.text, { color: 'white', fontSize: 12 }]}>
                  swipe left to dislike
                </Text>
              </View>
            }
            placement="top"
            backgroundColor="transparent"
            contentStyle={{ backgroundColor: '#6A6A6A' }}
            onClose={() => this.setState({ instr: false })}
          >
            <TouchableHighlight
              onPress={() => console.log('x')}
              underlayColor="transparent"
              style={{ backgroundColor: 'white' }}
            >
              <Feather name="x" style={[screenStyles.text, { color: '#6A6A6A', fontSize: 45 }]} />
            </TouchableHighlight>
          </Tooltip>
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
            <TouchableHighlight
              onPress={() => console.log('heart')}
              underlayColor="transparent"
              style={{ backgroundColor: 'white' }}
            >
              <Icon name="heart" style={[screenStyles.text, { fontSize: 35 }]} />
            </TouchableHighlight>
          </Tooltip>
        </View>
      </View>
    )
  }
}

Round.propTypes = {
  results: PropTypes.array,
  host: PropTypes.string,
  isHost: PropTypes.bool,
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
