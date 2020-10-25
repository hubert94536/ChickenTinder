import React from 'react'
import { StyleSheet, Text, TouchableHighlight, View } from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome'
import Swiper from 'react-native-deck-swiper'
import PropTypes from 'prop-types'
import RoundCard from '../cards/roundCard.js'
import socket from '../apis/socket.js'
import screenStyles from '../../styles/screenStyles.js'

const hex = '#F25763'
const font = 'CircularStd-Bold'

export default class Round extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      index: 0,
      results: this.props.navigation.state.params.results,
      host: this.props.navigation.state.params.host,
      isHost: this.props.navigation.state.params.isHost,
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

  handleSwiped() {
    // transitionRef.current.animateNextTransition();
    this.setState({ index: this.state.index + 1 })
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
    socket.getSocket().on('leave', (res) => {
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
        <TouchableHighlight onPress={() => this.endGroup()}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Icon
              name="angle-left"
              style={[screenStyles.text, { fontSize: 25, margin: '3%' }]}
            />
            <Text
              style={[screenStyles.text, {fontSize: 20, textAlign: 'left' }]}
            >
              {this.state.isHost ? 'End' : 'Leave'}
            </Text>
          </View>
        </TouchableHighlight>
        <Swiper
          cards={this.state.results}
          cardIndex={this.state.index}
          renderCard={(card) => <RoundCard card={card} />}
          onSwiper={this.handleSwiped}
          stackSize={10}
          disableBottomSwipe
          disableTopSwipe
          onSwipedRight={(cardIndex) => this.likeRestaurant(this.state.results[cardIndex].id)}
          stackSeparation={0}
          backgroundColor="transparent"
          animateOverlayLabelsOpacity
        />
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: '5%',
          }}
        >
          <Icon
            name="chevron-left"
            style={[screenStyles.text, { fontSize: 18, marginRight: '5%' }]}
          />
          <Text
            style={[screenStyles.text, { fontSize: 20 }]}
          >
            Swipe!
          </Text>
          <Icon
            name="chevron-right"
            style={[screenStyles.text, { fontSize: 18, marginLeft: '5%' }]}
          />
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
