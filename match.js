import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { HelperText } from 'react-native-paper'
import Icon from 'react-native-vector-icons/FontAwesome'

const hex = '#F25763'
const font = 'CircularStd-Medium'

export default class Match extends React.Component {
  render () {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>It's A Match!</Text>
        <Icon name='thumbs-up' style={styles.icon} />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: hex,
    flexDirection: 'column',
    justifyContent: 'center'
  },
  text: {
    fontFamily: font,
    color: 'white',
    fontSize: 65,
    textAlign: 'center',
    fontWeight: 'bold',
    marginRight: '10%',
    marginLeft: '10%'
  },
  icon: {
    color: 'white',
    textAlign: 'center',
    fontFamily: font,
    fontSize: 50
  }
})
