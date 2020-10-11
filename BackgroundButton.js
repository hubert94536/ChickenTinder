import React from 'react'
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native'
// import R from 'res/R'

export default class BackgroundButton extends React.Component {
  render () {
    const styles = this.makeStyles()
    return (
      <TouchableOpacity style={styles.touchable} onPress={this.props.onPress}>
        <View style={styles.view}>
          <Text style={styles.text}>{this.props.title}</Text>
        </View>
      </TouchableOpacity>
    )
  }
  // makeImageIfAny(styles) {
  //     if (this.props.showImage) {
  //       return <Image style={styles.image} source={R.images.check} />
  //     }
  //   }

  makeStyles () {
    return StyleSheet.create({
      view: {
        flexDirection: 'row',
        // borderRadius: 23,
        borderRadius: 14,
        borderColor: this.props.borderColor,
        borderWidth: 2,
        backgroundColor: this.props.backgroundColor,
        // height: 46,
        height: 28,
        alignItems: 'center',
        justifyContent: 'center',
        // paddingLeft: 16,
        // paddingRight: 16
        paddingHorizontal: 8
      },
      touchable: {
        // marginLeft: 4,
        marginRight: 8,
        marginBottom: 6
        // marginLeft: 3,
        // marginRight: 3,
        // marginBottom: 6
      },
      image: {
        marginRight: 8
      },
      text: {
        // fontSize: 5,
        paddingLeft: '2%',
        paddingRight: '2%',
        textAlign: 'center',
        color: this.props.textColor,
        // fontSize: 16
        fontSize: 15,
        fontFamily: 'CircularStd-Bold'
      }
    })
  }
}
