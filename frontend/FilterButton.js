import React from 'react'
import { TouchableOpacity, Text, StyleSheet } from 'react-native'
import PropTypes from 'prop-types'
import colors from '../styles/colors.js'
import normalize from '../styles/normalize.js'

export default class FilterButton extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    const backgroundColor = this.props.active ? colors.hex : 'white'
    const textColor = this.props.active ? 'white' : colors.hex
    const styles = this.makeStyles(backgroundColor, textColor)
    return (
      <TouchableOpacity style={styles.view} onPress={this.props.onPress}>
        <Text style={styles.text}>{this.props.title}</Text>
      </TouchableOpacity>
    )
  }

  makeStyles(background, text) {
    return StyleSheet.create({
      view: {
        borderRadius: normalize(15),
        borderColor: colors.hex,
        borderWidth: 1,
        backgroundColor: background,
        height: normalize(28),
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: '1.5%',
        marginRight: '1.5%',
      },
      text: {
        paddingLeft: '2%',
        paddingRight: '2%',
        textAlign: 'center',
        color: text,
        fontSize: normalize(13),
        fontFamily: 'CircularStd-Medium',
      },
    })
  }
}

FilterButton.propTypes = {
  active: PropTypes.bool,
  onPress: PropTypes.func,
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
}
