import React from 'react'
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native'
// import R from 'res/R'

export default class BackgroundButton extends React.Component {
  render() {
    const styles = this.makeStyles()
    return (
      <TouchableOpacity style={styles.touchable} onPress={this.props.onPress}>
        <View style={styles.view}>
          <Text style={styles.text}>{this.props.title}</Text>
        </View>
      </TouchableOpacity>
    )
  }

  makeStyles() {
    return StyleSheet.create({
      view: {
        flexDirection: 'row',
        borderRadius: 14,
        borderColor: this.props.borderColor,
        borderWidth: 2,
        backgroundColor: this.props.backgroundColor,
        height: 28,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 8,
      },
      touchable: {
        marginRight: 8,
        marginBottom: 6,
      },
      image: {
        marginRight: 8,
      },
      text: {
        paddingLeft: '2%',
        paddingRight: '2%',
        textAlign: 'center',
        color: this.props.textColor,
        fontSize: 15,
        fontFamily: 'CircularStd-Bold',
      },
    })
  }
}
