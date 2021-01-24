import React from 'react'
import { Dimensions, Image, StyleSheet, Text, TouchableHighlight, View } from 'react-native'
import PropTypes from 'prop-types'
import colors from '../../styles/colors.js'
import global from '../../global.js'
import modalStyles from '../../styles/modalStyles.js'
import normalize from '../../styles/normalize.js'
import screenStyles from '../../styles/screenStyles.js'
import socket from '../apis/socket.js'

const height = Dimensions.get('window').height

export default class Loading extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      restaurants: this.props.navigation.state.params.restaurants,
    }
    socket.getSocket().once('match', (data) => {
      var res
      for (var i = 0; i < this.state.restaurants.length; i++) {
        if (this.state.restaurants[i].id === data) {
          res = this.state.restaurants[i]
          break
        }
      }
      socket.getSocket().off('top 3')
      this.props.navigation.replace('Match', {
        restaurant: res,
      })
    })
    socket.getSocket().once('top 3', (res) => {
      var restaurants = []
      for (var i = 0; i < 3; i++) {
        for (var j = 0; j < this.state.restaurants.length; j++) {
          if (this.state.restaurants[j].id === res.choices[i]) {
            restaurants[i] = this.state.restaurants[j]
            restaurants[i].likes = res.likes[i]
            break
          }
        }
      }
      socket.getSocket().off()
      this.props.navigation.replace('TopThree', {
        top: restaurants,
      })
    })

    socket.getSocket().once('leave', () => {
      this.leaveGroup()
    })
  }

  leaveGroup() {
    socket.endLeave()
    global.code = ''
    global.host = ''
    global.isHost = false
    global.restaurants = []
    this.props.navigation.replace('Home')
  }

  endGroup() {
    socket.endGroup()
  }

  render() {
    return (
      <View style={[modalStyles.modalContent, styles.container]}>
        <View style={styles.content}>
          <Text style={[styles.general, styles.title]}>Round done!</Text>
          <Image source={require('../assets/loading.gif')} style={styles.gif} />
          <Text style={styles.general}>
            Hang tight while others finish swiping and a match is found!
          </Text>
        </View>
        <TouchableHighlight
          style={styles.leaveButton}
          underlayColor="transparent"
          onPress={() => this.leaveGroup()}
        >
          <Text style={styles.leaveText}>Leave Round</Text>
        </TouchableHighlight>
      </View>
    )
  }
}

Loading.propTypes = {
  restaurant: PropTypes.array,
  navigation: PropTypes.object,
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
  },
  content: {
    width: '70%',
    alignSelf: 'center',
  },
  title: {
    fontSize: normalize(30),
    fontWeight: 'bold',
    color: colors.hex,
  },
  gif: {
    alignSelf: 'center',
    width: height * 0.3,
    height: height * 0.4,
  },
  general: {
    fontFamily: screenStyles.book.fontFamily,
    fontSize: normalize(16),
    padding: 30,
    textAlign: 'center',
  },
  leaveButton: {
    alignSelf: 'center',
    width: '50%',
  },
  leaveText: {
    color: colors.darkGray,
    textAlign: 'center',
    fontFamily: screenStyles.book.fontFamily,
    fontSize: normalize(18),
    padding: '3%',
  },
})
