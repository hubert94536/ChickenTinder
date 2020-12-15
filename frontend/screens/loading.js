import React from 'react'
import { Dimensions, Image, StyleSheet, Text, TouchableHighlight, View } from 'react-native'
import PropTypes from 'prop-types'
import socket from '../apis/socket.js'

const hex = '#F15763'
const font = 'CircularStd-Book'
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

    socket.getSocket().on('match', (data) => {
      var res
      for (var i = 0; i < this.state.results.length; i++) {
        if (this.state.results[i].id === data) {
          res = this.state.results[i]
          break
        }
      }
      this.props.navigation.navigate('Match', {
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
      this.props.navigation.navigate('TopThree', {
        top: restaurants,
        code: this.state.code,
        host: this.state.host,
        isHost: this.state.isHost
      })
    })
  }

  leaveGroup() {
    socket.leaveRoom(this.state.code)
    this.props.navigation.navigate('Home')
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.content}>
          <Text style={[styles.general, { fontSize: 30, fontWeight: 'bold', color: hex }]}>
            Round done!
          </Text>
          <Image
            source={require('../assets/loading.gif')}
            style={{ alignSelf: 'center', width: height * 0.3, height: height * 0.4 }}
          />
          <Text style={[styles.general, { color: 'black' }]}>
            Hang tight while others finish swiping and a match is found!
          </Text>
        </View>
        <TouchableHighlight
          style={{ alignSelf: 'center', width: '50%' }}
          underlayColor="transparent"
          onPress={() => this.leaveGroup()}
        >
          <Text
            style={[
              {
                color: '#6A6A6A',
                textAlign: 'center',
                fontFamily: font,
                fontSize: 18,
                padding: '3%',
              },
            ]}
          >
            Leave Round
          </Text>
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
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'space-evenly',
  },
  content: {
    width: '70%',
    alignSelf: 'center',
  },
  general: {
    fontFamily: font,
    fontSize: 15,
    padding: 30,
    textAlign: 'center',
  },
})
