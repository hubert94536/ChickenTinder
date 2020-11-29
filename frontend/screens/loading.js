import React from 'react'
import { Dimensions, Modal, Image, StyleSheet, Text, TextInput, TouchableHighlight, View } from 'react-native'
import { NAME, PHOTO, USERNAME, ID } from 'react-native-dotenv'
import AsyncStorage from '@react-native-community/async-storage'
import socket from '../apis/socket.js'
import screenStyles from '../../styles/screenStyles.js'

const width = Dimensions.get('window').width
const height = Dimensions.get('window').height
const hex = 'white'
const font = 'CircularStd-Medium' // change to avenir normal

export default class Loading extends React.Component {
    constructor(props) {
      super(props)
      this.state = {
        host: this.props.host,
      }
    }
  
    endRound() { // will probably have more complicated code
      // for host
      // socket.leaveRoom(this.props.host)
      this.props.navigation.navigate('Home')
    }
  
    leaveRound() {
        // for member
    }
  
    render() {
      return (
        <View style={styles.container}>
          <Text style={[styles.general, { fontSize: 30, color: '#F15763' }]}>
            Round done!
          </Text>
          <Image source={{ uri: 'https://banner2.cleanpng.com/20181107/fhg/kisspng-computer-icons-location-map-united-states-of-ameri-5be33fd26a48d9.3500512415416196664353.jpg' }} 
          style={{width: 200, height: 200,}}/> 
          <Text style={[styles.general, { color: 'black' }]}>Hang tight while others finish swiping!</Text>
          
          // should change depending on if host or member
          <TouchableHighlight
            style={[screenStyles.medButton]}
            onPress={() => this.endRound()}
          >
            <Text
              style={[styles.endText, screenStyles.medButtonText, { color: '#6A6A6A', padding: '6%' }]}
            >
              End Round
            </Text>
          </TouchableHighlight>
        </View>
      )
    }
  }

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: hex,
      justifyContent: 'space-evenly',
    },
    general: {
      //fontFamily: Avenir,
      //fontStyle: normal,
      fontSize: 15,
      textAlign: 'center',
    }
  })