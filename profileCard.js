import React from 'react'
import { Text, View, Image, TouchableHighlight } from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome'

const hex = '#F25763'
const font = 'CircularStd-Medium'

export default class Card extends React.Component {
  constructor (props) {
    super(props)
    state = {
      friends: this.props.friends,
      pressed: false
    }
  }

  render () {
    return (
      <View style={{ flexDirection: 'row', flex: 1 }}>
        <Image
          source={{
            uri: this.props.image
          }}
          style={{ borderRadius: 63, height: 60, width: 60, margin: '3%' }}
        />
        <View
          style={{
            alignSelf: 'center',
            marginLeft: '1%',
            flex: 1
          }}
        >
          <Text style={{ fontFamily: font, fontWeight: 'bold', fontSize: 15 }}>
            {this.props.name}
          </Text>
          <Text style={{ fontFamily: font }}>{this.props.username}</Text>
        </View>
        {this.state.friends && (
          <View style={{ flexDirection: 'row', flex: 1 }}>
            <Text
              style={{
                fontFamily: font,
                color: hex,
                fontSize: 15,
                alignSelf: 'center',
                marginLeft: '25%'
              }}
            >
              Friends
            </Text>
            <Icon
              style={{
                fontFamily: font,
                color: hex,
                fontSize: 35,
                alignSelf: 'center',
                marginLeft: '5%'
              }}
              name='check-circle'
            />
          </View>
        )}
        {!this.state.friends && (
          <View style={{ flex: 1, flexDirection: 'row' }}>
            <TouchableHighlight
              underlayColor='black'
              onHideUnderlay={() => this.setState({ pressed: false })}
              onShowUnderlay={() => this.setState({ pressed: true })}
              onPress={() => this.setState({ friends: true })}
              style={{
                borderColor: 'black',
                borderRadius: 30,
                borderWidth: 2,
                height: '30%',
                width: '50%',
                marginLeft: '25%',
                alignSelf: 'center'
              }}
            >
              <Text
                style={{
                  fontFamily: font,
                  fontSize: 15,
                  textAlign: 'center',
                  color: this.state.pressed ? 'white' : 'black'
                }}
              >
                Accept
              </Text>
            </TouchableHighlight>
            <Icon
              style={{
                fontFamily: font,
                fontSize: 30,
                alignSelf: 'center',
                margin: '5%'
              }}
              name='times-circle'
            />
          </View>
        )}
      </View>
    )
  }
}
