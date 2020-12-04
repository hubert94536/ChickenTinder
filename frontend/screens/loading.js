import React from 'react'
import { Dimensions, Image, StyleSheet, Text, View } from 'react-native'
import PropTypes from 'prop-types'

const width = Dimensions.get('window').width
const height = Dimensions.get('window').height
const hex = '#F15763'
const font = 'CircularStd-Medium'

export default class Loading extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      restaurant: this.props.navigation.state.params.restaurant,
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.content}>
          <Text style={[styles.general, { fontSize: 30, fontWeight: 'bold', color: '#F15763' }]}>
            Round done!
          </Text>
          <Image
            source={require('../assets/images/logo2.png')}
            style={{ alignSelf: 'center', width: 200, height: 248 }}
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
