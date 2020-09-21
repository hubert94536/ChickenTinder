import React from 'react';
import {Text, View, Image, TouchableHighlight} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const hex = '#F25763';
const font = 'CircularStd-Medium';

export default class Card extends React.Component {
  state = {
    friends: this.props.friends,
    pressed: false,
  };
  render() {
    return (
      <View style={{flexDirection: 'row', flex: 1}}>
        <Image
          source={{
            uri: this.props.image,
          }}
          style={{borderRadius: 63, height: 60, width: 60, margin: '3%'}}
        />
        <View
          style={{
            alignSelf: 'center',
            marginLeft: '1%',
            flex: 1,
          }}>
          <Text style={{fontFamily: font, fontWeight: 'bold', fontSize: 15}}>
            {this.props.name}
          </Text>
          <Text style={{fontFamily: font}}>{this.props.username}</Text>
        </View>
        {this.state.friends && (
          <View
            style={{flexDirection: 'row', flex: 1, justifyContent: 'flex-end'}}>
            <Text
              style={{
                fontFamily: font,
                color: hex,
                fontSize: 15,
                alignSelf: 'center',
              }}>
              Friends
            </Text>
            <Icon
              style={{
                fontFamily: font,
                color: hex,
                fontSize: 35,
                alignSelf: 'center',
                margin: '8%',
              }}
              name="check-circle"
            />
          </View>
        )}
        {!this.state.friends && (
          <View
            style={{flexDirection: 'row', flex: 1, justifyContent: 'flex-end'}}>
            <Text
              style={{
                fontFamily: font,
                color: hex,
                fontSize: 15,
                alignSelf: 'center',
              }}>
              Add
            </Text>
            <Icon
              style={{
                fontFamily: font,
                color: hex,
                fontSize: 35,
                alignSelf: 'center',
                margin: '8%',
              }}
              onPress={() => this.setState({friends: true})}
              name="plus-circle"
            />
          </View>
        )}
      </View>
    );
  }
}
