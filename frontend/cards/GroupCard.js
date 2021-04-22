import React from 'react'
import { Dimensions, Image, StyleSheet, Text, View } from 'react-native'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { setDisable, hideDisable } from '../redux/Actions.js'
import Icon from 'react-native-vector-icons/FontAwesome'
import PropTypes from 'prop-types'
import socket from '../apis/socket.js'
import imgStyles from '../../styles/cardImage.js'
import normalize from '../../styles/normalize.js'

const height = Dimensions.get('window').height
const width = Dimensions.get('window').width

const bg = '#FCE5CD'

class GroupCard extends React.Component {
  constructor(props) {
    super(props)
  }
  /* TODO: use lodash */
  removeUser(uid) {
    this.props.setDisable()
    socket.kickUser(uid)
    this.props.hideDisable()
  }

  render() {
    return (
      <View style={styles.card}>
        <View style={[styles.imageWrapper]}>
          <Image
            source={{ uri: Image.resolveAssetSource(this.props.image).uri }}
            style={[styles.image, this.props.filters ? imgStyles.hexBorder : imgStyles.tanBorder]}
          />
          {this.props.filters && (
            <Icon style={[imgStyles.icon, styles.checkIcon]} name="check-circle" />
          )}
        </View>
        <View style={styles.info}>
          <Text style={[imgStyles.font, styles.name]}>{this.props.name}</Text>
          <Text style={[imgStyles.hex, imgStyles.font, styles.username]}>
            {'@' + this.props.username}
          </Text>
        </View>
        <View
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
          }}
        >
          {this.props.uid != this.props.host && this.props.isHost ? (
            <Icon
              name="times-circle"
              style={[imgStyles.icon, styles.removeIcon]}
              onPress={() => this.removeUser(this.props.uid)}
              disabled={this.props.disable}
            />
          ) : null}
        </View>
      </View>
    )
  }
}

const mapStateToProps = (state) => {
  const { disable } = state
  return { disable }
}

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      setDisable,
      hideDisable,
    },
    dispatch,
  )

export default connect(mapStateToProps, mapDispatchToProps)(GroupCard)

GroupCard.propTypes = {
  uid: PropTypes.string,
  image: PropTypes.string,
  filters: PropTypes.bool,
  host: PropTypes.string,
  isHost: PropTypes.bool,
  name: PropTypes.string,
  username: PropTypes.string,
  setDisable: PropTypes.func,
  hideDisable: PropTypes.func,
  disable: PropTypes.bool,
}

const styles = StyleSheet.create({
  checkIcon: {
    position: 'absolute',
    top: 0,
    right: 0,
    fontSize: normalize(15),
  },
  card: {
    backgroundColor: bg,
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
    height: height * 0.1,
    width: height * 0.1,
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
    backgroundColor: bg,
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
  removeIcon: {
    position: 'absolute',
    top: normalize(6),
    right: normalize(6),
    fontSize: normalize(20),
  },
})
