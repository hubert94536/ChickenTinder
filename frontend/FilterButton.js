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
        borderRadius: 14,
        borderColor: colors.hex,
        borderWidth: 1,
        backgroundColor: background,
        height: 28,
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: '2%',
        marginRight: '2%',
      },
      text: {
        paddingLeft: '2%',
        paddingRight: '2%',
        textAlign: 'center',
        color: text,
        fontSize: normalize(12),
        fontFamily: 'CircularStd-Bold',
      },
    })
  }
}

FilterButton.propTypes = {
  active: PropTypes.bool,
  onPress: PropTypes.func,
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  //   textColor: PropTypes.string,
  //   borderColor: PropTypes.string,
  //   backgroundColor: PropTypes.string,
}
