import React from 'react'
import { Dimensions, Image, StyleSheet, Text, View } from 'react-native'
import PropTypes from 'prop-types'
import socket from '../apis/socket.js'

const hex = '#F15763'
const height = Dimensions.get('window').height

export default class Loading extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      restaurant: this.props.navigation.state.params.restaurant,
      host: this.props.navigation.state.params.host,
    }
    socket.getSocket().on('top3', (res) => {
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
      this.props.navigation.navigate('TopThree', { top: restaurants, random: res.random, host: this.state.host })
    })
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
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'space-evenly',
  },
  content: {
    width: '70%',
    alignSelf: 'center',
  },
  general: {
    fontSize: 15,
    padding: 30,
    textAlign: 'center',
  },
})
