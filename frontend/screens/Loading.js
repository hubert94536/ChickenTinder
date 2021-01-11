import React from 'react'
import { Dimensions, Image, StyleSheet, Text, TouchableHighlight, View } from 'react-native'
import PropTypes from 'prop-types'
import colors from '../../styles/colors.js'
import modalStyles from '../../styles/modalStyles.js'
import normalize from '../../styles/normalize.js'
import screenStyles from '../../styles/screenStyles.js'
import socket from '../apis/socket.js'

const height = Dimensions.get('window').height

export default class Loading extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      restaurant: this.props.navigation.state.params.restaurant,
      host: this.props.navigation.state.params.host,
      code: this.props.navigation.state.params.code,
      isHost: this.props.navigation.state.params.isHost,
    }
    console.log(this.state.isHost)

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
        code: this.state.code,
      })
    })

    socket.getSocket().on('top 3', (res) => {
      var restaurants = []
      for (var i = 0; i < 3; i++) {
        for (var j = 0; j < this.state.restaurant.length; j++) {
          if (this.state.restaurant[j].id === res.choices[i]) {
            restaurants[i] = this.state.restaurant[j]
            restaurants[i].likes = res.likes[i]
            break
          }
        }
      }
      this.props.navigation.push('TopThree', {
        top: restaurants,
        code: this.state.code,
        host: this.state.host,
        isHost: this.state.isHost,
      })
    })
  }

  leaveGroup() {
    socket.leaveRoom(this.state.code)
    this.props.navigation.popToTop()
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
  code: PropTypes.number,
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
