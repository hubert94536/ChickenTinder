import React from 'react'
import { Dimensions, Image, StyleSheet, Text, View } from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome'
import PropTypes from 'prop-types'
import socket from '../apis/socket.js'
import imgStyles from '../../styles/cardImage.js'
import normalize from '../../styles/normalize.js'

const height = Dimensions.get('window').height

export default class GroupCard extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      uid: this.props.uid,
    }
  }

  removeUser(uid) {
    socket.kickUser(uid)
  }

  render() {
    return (
      <View style={styles.card}>
        <View style={{ flexDirection: 'column', justifyContent: 'center' }}>
          <Image
            source={{ uri: Image.resolveAssetSource(this.props.image).uri }}
            style={[
              styles.image,
              this.props.filters ? imgStyles.hexBorder : imgStyles.greyBorder,
            ]}
          />
        </View>
        {this.props.filters ? (
          <Icon name="check-circle" style={[imgStyles.hex, styles.icon]} />
        ) : null}
        <View style={styles.none}>
          <Text style={[imgStyles.font, styles.name]}>{this.props.name}</Text>
          <Text style={[imgStyles.hex, imgStyles.font, styles.username]}>
            {'@' + this.props.username}
          </Text>
        </View>
        <View style={styles.general}>
          {this.props.username !== this.props.host && this.isHost ? (
            <Text style={[imgStyles.hex, imgStyles.font, styles.remove]}>Remove</Text>
          ) : null}
          {this.props.username !== this.props.host && this.isHost ? (
            <Icon
              name="times-circle"
              style={[imgStyles.icon, styles.smallMargin]}
              onPress={() => this.removeUser(this.props.username)}
            />
          ) : null}
        </View>
      </View>
    )
  }
}

GroupCard.propTypes = {
  uid: PropTypes.string,
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
    width: height * 0.22,
    height: height * 0.09,
    padding: 0,
    margin: '3%',
    flexDirection: 'row',
  },
  image: {
    borderRadius: 63,
    height: height * 0.075,
    width: height * 0.075,
    borderWidth: height * 0.004,
    alignSelf: 'flex-start',
    marginLeft: '7%',
  },
  topText: {
    color: '#000',
  },
  icon: {
    fontSize: normalize(20),
    position: 'absolute',
    marginLeft: '31%',
    marginTop: '5%',
    backgroundColor: '#F5F5F5',
    borderRadius: 30,
    overflow: 'hidden',
  },
  none: {
    marginLeft: '3%',
    width: height * 0.26,
    flexDirection: 'column',
    justifyContent: 'center',
    color: 'green',
  },
  name: {
    color: 'black',
    fontWeight: 'normal',
    fontSize: normalize(14),
    width: height * 0.13,
  },
  username: {
    fontWeight: 'normal',
    fontSize: normalize(10),
    width: height * 0.13,
  },
  remove: {
    alignSelf: 'center',
    marginLeft: '30%',
  },
  general: { flex: 1, flexDirection: 'row' },
  smallMargin: { marginLeft: '5%' },
})
