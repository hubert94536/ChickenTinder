import React from 'react'
import { Dimensions, Image, StyleSheet, Text, View } from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome'
import PropTypes from 'prop-types'
import socket from '../apis/socket.js'
import imgStyles from '../../styles/cardImage.js'
import normalize from '../../styles/normalize.js'

const height = Dimensions.get('window').height
const width = Dimensions.get('window').width

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
        <View
          style={[
            styles.imageWrapper,
            this.props.filters ? imgStyles.hexBorder : imgStyles.greyBorder,
          ]}
        >
          <Image
            source={{ uri: Image.resolveAssetSource(this.props.image).uri }}
            style={[
              styles.image,
              this.props.filters ? imgStyles.whiteBorder : imgStyles.greyBorder,
            ]}
          />
        </View>
        <View style={styles.info}>
          <Text style={[imgStyles.font, styles.name]}>{this.props.name}</Text>
          <Text style={[imgStyles.hex, imgStyles.font, styles.username]}>
            {'@' + this.props.username}
          </Text>
        </View>
        {/* <View style={styles.general}>
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
        </View> */}
      </View>
    )
  }
}

GroupCard.propTypes = {
  uid: PropTypes.string,
  image: PropTypes.string,
  filters: PropTypes.bool,
  host: PropTypes.string,
  isHost: PropTypes.bool,
  name: PropTypes.string,
  username: PropTypes.string,
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#F5F5F5',
    borderRadius: 7,
    alignSelf: 'center',
    width: width * 0.4,
    height: height * 0.16,
    margin: '1.5%',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    borderRadius: height * 0.1,
    height: '99%',
    width: '99%',
    borderWidth: height * 0.004,
  },
  imageWrapper: {
    borderRadius: height * 0.1,
    height: height * 0.1,
    width: height * 0.1,
    borderWidth: height * 0.004,
    alignItems: 'center',
    justifyContent: 'center',
  },
  topText: {
    color: '#000',
  },
  icon: {
    fontSize: normalize(20),
    position: 'absolute',
    right: '7%',
    top: '7%',
    backgroundColor: '#F5F5F5',
    borderRadius: 30,
    overflow: 'hidden',
  },
  info: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: height * 0.004,
  },
  name: {
    color: 'black',
    fontWeight: 'normal',
    fontSize: normalize(14),
    alignSelf: 'center',
  },
  username: {
    fontWeight: 'normal',
    fontSize: normalize(10),
    alignSelf: 'center',
  },
  remove: {
    alignSelf: 'center',
    marginLeft: '30%',
  },
  general: { flex: 1, flexDirection: 'row' },
  smallMargin: { marginLeft: '5%' },
})
