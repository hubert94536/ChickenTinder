import React from 'react'
import { Image, Text, View } from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome'

const hex = '#F25763'
const font = 'CircularStd-Medium'

// cards for the search for friends screen
export default class Card extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      // for button display
      requested: this.props.requested,
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
        {this.state.requested === 'Requested' && (
          <View
            style={{ flexDirection: 'row', flex: 1, justifyContent: 'flex-end' }}
          >
            <Text
              style={{
                fontFamily: font,
                color: hex,
                fontSize: 15,
                alignSelf: 'center',
                margin: '1%'
              }}
            >
              Requested
            </Text>
            {/* <Icon
              style={{
                fontFamily: font,
                color: hex,
                fontSize: 35,
                alignSelf: 'center',
                margin: '8%'
              }}
              onPress={() => this.setState({ requested: false })}
              name='times-circle'
            /> */}
          </View>
        )}
        {this.state.requested === 'Add' && (
          <View
            style={{ flexDirection: 'row', flex: 1, justifyContent: 'flex-end' }}
          >
            <Text
              style={{
                fontFamily: font,
                color: hex,
                fontSize: 15,
                alignSelf: 'center'
              }}
            >
              Add
            </Text>
            <Icon
              style={{
                fontFamily: font,
                color: hex,
                fontSize: 35,
                alignSelf: 'center',
                margin: '8%'
              }}
              onPress={() => this.setState({ requested: 'Requested' })}
              name='plus-circle'
            />
          </View>
        )}
         {this.state.requested === 'Accepted' && (
          <View
            style={{ flexDirection: 'row', flex: 1, justifyContent: 'flex-end' }}
          >
            <Text
              style={{
                fontFamily: font,
                color: hex,
                fontSize: 15,
                alignSelf: 'center'
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
                margin: '8%'
              }}
              name='check-circle'
            />
          </View>
        )}
        {this.state.requested === 'Pending Request' && (
          <View
            style={{ flexDirection: 'row', flex: 1, justifyContent: 'flex-end' }}
          >
            <Icon
              style={{
                fontFamily: font,
                color: hex,
                fontSize: 35,
                alignSelf: 'center',
                margin: '3%'
              }}
              name='check-circle'
              onPress={() => this.setState({requested:'Accepted'})}
            />
            <Icon
              style={{
                fontFamily: font,
                color: hex,
                fontSize: 35,
                alignSelf: 'center',
                margin: '3%'
              }}
              name='times-circle'
              onPress={() => this.setState({requested:'Add'})}
            />
          </View>
        )}
      </View>
    )
  }
}
