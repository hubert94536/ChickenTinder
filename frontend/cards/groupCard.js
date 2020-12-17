import React from 'react'
import { Dimensions, Image, StyleSheet, Text, View } from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome'
import PropTypes from 'prop-types'
import socket from '../apis/socket.js'
import imgStyles from '../../styles/cardImage.js'

const hex = '#F15763'
const font = 'CircularStd-Medium'

export default class GroupCard extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      id: this.props.id,
    }
  }

  removeUser(username) {
    socket.kickUser(username)
  }

  render() {
    return (
      <View style={styles.card}>
        <View style={{ flexDirection: 'column', justifyContent: 'center' }}>
        {this.props.image.includes("file") || this.props.image.includes("http") ? (
          <Image
            source={{
              uri: this.props.image,
            }}
            style={imgStyles.button}
          />
          ) : (
            <Image source={this.props.image} style={imgStyles.button}/>
 
            )}   
        </View>
        {this.props.filters ? (
          <Icon
            name="check-circle"
            style={{
              color: hex,
              fontSize: 20,
              position: 'absolute',
              marginLeft: '31%',
              marginTop: '5%',
              backgroundColor: '#F5F5F5',
              borderRadius: 30,
              width: 13,
              height: 13,
              overflow: 'hidden',
            }}
          />
        ) : null}
        <View
          style={{
            marginLeft: '3%',
            width: 200,
            flexDirection: 'column',
            justifyContent: 'center',
            color: 'green',
          }}
        >
          <Text
            style={{
              color: 'black',
              fontWeight: 'normal',
              fontFamily: font,
              fontSize: 14,
              width: 100,
            }}
          >
            {this.props.name}
          </Text>
          <Text
            style={{
              color: hex,
              fontWeight: 'normal',
              fontFamily: font,
              fontSize: 10,
              width: 100,
            }}
          >
            {'@' + this.props.username}
          </Text>
        </View>
        <View style={{ flex: 1, flexDirection: 'row' }}>
          {this.props.username !== this.props.host && this.isHost ? (
            <Text
              style={{
                color: hex,
                alignSelf: 'center',
                fontFamily: font,
                marginLeft: '30%',
              }}
            >
              Remove
            </Text>
          ) : null}
          {this.props.username !== this.props.host && this.isHost ? (
            <Icon
              name="times-circle"
              style={[imgStyles.icon, { marginLeft: '5%' }]}
              onPress={() => this.removeUser(this.props.username)}
            />
          ) : null}
        </View>
      </View>
    )
  }
}

GroupCard.propTypes = {
  id: PropTypes.number,
  image: PropTypes.string,
  filters: PropTypes.bool,
  name: PropTypes.string,
  username: PropTypes.string,
  host: PropTypes.string,
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#F5F5F5',
    borderRadius: 7,
    alignSelf: 'center',
    width: 170,
    height: 70,
    padding: 0,
    margin: 5,
    flexDirection: 'row',
  },
  image: {
    borderRadius: 63,
    height: Dimensions.get('window').height * 0.075,
    width: Dimensions.get('window').height * 0.075,
    borderWidth: 3,
    borderColor: hex,
    alignSelf: 'flex-start',
    marginLeft: 7,
  },
  topText: {
    color: '#000',
  },
})
