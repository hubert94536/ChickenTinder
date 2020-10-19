import React from 'react'
import { Dimensions, Image, StyleSheet, Text, View } from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome'
import PropTypes from 'prop-types'
import socket from '../apis/socket.js'

const hex = '#F25763'
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
      <View>
        <View style={styles.card}>
          <Image
            source={{ uri: this.props.image }}
            style={this.props.filters ? styles.image : styles.imageFalse}
          />
          {this.props.filters ? (
            <Icon
              name="check-circle"
              style={{
                color: hex,
                fontSize: 20,
                position: 'absolute',
                marginLeft: '14%',
                marginTop: '1%',
              }}
            />
          ) : null}
          <View
            style={{
              alignSelf: 'center',
              marginLeft: '3%',
              flex: 1,
            }}
          >
            <Text
              style={{
                color: hex,
                fontWeight: 'bold',
                fontFamily: font,
              }}
            >
              {this.props.name}
            </Text>
            <Text
              style={{
                color: hex,
                fontFamily: font,
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
                style={{
                  color: hex,
                  fontSize: 35,
                  alignSelf: 'center',
                  marginLeft: '5%',
                }}
                onPress={() => this.removeUser(this.props.username)}
              />
            ) : null}
          </View>
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
    backgroundColor: '#fff',
    borderRadius: 20,
    alignSelf: 'center',
    width: '94%',
    height: 90,
    padding: 0,
    margin: 0,
    marginTop: '3%',
    flexDirection: 'row',
    flex: 1,
  },
  image: {
    borderRadius: 63,
    height: Dimensions.get('window').height * 0.09,
    width: Dimensions.get('window').height * 0.09,
    borderWidth: 3,
    borderColor: hex,
    alignSelf: 'flex-start',
    marginTop: '3.5%',
    marginLeft: '2.5%',
  },
  imageFalse: {
    borderRadius: 63,
    height: Dimensions.get('window').height * 0.09,
    width: Dimensions.get('window').height * 0.09,
    borderWidth: 3,
    alignSelf: 'flex-start',
    marginTop: '3.5%',
    marginBottom: '3.5%',
    marginLeft: '2.5%',
  },
})
