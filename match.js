import React from 'react'
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableHighlight,
  Linking
} from 'react-native'
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps'
import Icon from 'react-native-vector-icons/FontAwesome'

const hex = '#F25763'
const font = 'CircularStd-Medium'

export default class Match extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      endRound: false,
      goToYelp: false,
      restaurant: this.props.navigation.state.params.match
    }
  }

  render () {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>It's A Match!</Text>
        <Icon name='thumbs-up' style={styles.thumbIcon} />
        <Text
          style={{
            fontFamily: font,
            color: 'white',
            textAlign: 'center',
            fontSize: 20
          }}
        >
          Your group has selected:
        </Text>
        <Text
          style={{
            fontFamily: font,
            color: 'white',
            textAlign: 'center',
            fontSize: 30,
            fontWeight: 'bold'
          }}
        >
          {this.state.restaurant.name}
        </Text>
        <MapView
          provider={PROVIDER_GOOGLE}
          style={styles.map}
          region={{
            latitude: this.state.restaurant.latitude,
            longitude: this.state.restaurant.longitude,
            latitudeDelta: 0.015,
            longitudeDelta: 0.015
          }}
        >
          <Marker
            coordinate={{ latitude: this.state.restaurant.latitude, longitude: this.state.restaurant.longitude }}
          />
        </MapView>
        <TouchableHighlight
          underlayColor='white'
          onShowUnderlay={() => this.setState({ endRound: true })}
          onHideUnderlay={() => this.setState({ endRound: false })}
          style={{
            borderColor: 'white',
            borderWidth: 2.5,
            borderRadius: 30,
            alignSelf: 'center',
            width: '45%'
          }}
        >
          <Text
            style={{
              fontFamily: font,
              color: this.state.endRound ? hex : 'white',
              fontSize: 20,
              textAlign: 'center',
              padding: '6%',
              fontWeight: 'bold'
            }}
          >
            End Round
          </Text>
        </TouchableHighlight>
        <TouchableHighlight
          style={{
            backgroundColor: 'white',
            width: '30%',
            height: '5%',
            borderWidth: 2.5,
            borderColor: 'white',
            borderRadius: 30,
            alignSelf: 'center'
          }}

          onPress={() => Linking.openURL(this.state.restaurant.url)}
        >
          <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
            <Icon
              name='yelp'
              style={{ color: 'red', fontSize: 20, alignSelf: 'center' }}
            />
            <Text
              style={{
                fontFamily: font,
                textAlign: 'center',
                padding: '5%'
              }}
            >
              Go To Yelp
            </Text>
          </View>
        </TouchableHighlight>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: hex,
    justifyContent: 'space-evenly'
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
  thumbIcon: {
    color: 'white',
    textAlign: 'center',
    fontFamily: font,
    fontSize: 50
  },
  map: {
    alignSelf: 'center',
    height: Dimensions.get('window').width * 0.55,
    width: Dimensions.get('window').width * 0.55
  }
})
