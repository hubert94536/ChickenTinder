import React, { Component } from 'react'
import { StyleSheet, Text, View, TouchableHighlight, Modal } from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome'
import { BlurView } from '@react-native-community/blur'
import PropTypes from 'prop-types'
import modalStyles from '../../styles/modalStyles.js'

const hex = '#F25763'
const font = 'CircularStd-Medium'

export default class Alert extends Component {
  constructor(props) {
    super(props)
    this.state = { pressed: false }
  }

  // function called when main button is pressed
  handlePress () {
    this.props.press()
  }

  //  function called when 'x' is pressed
  handleCancel () {
    this.props.cancel()
  }

  render() {
    return (
      <View>
        <Text />
        <BlurView
          blurType="light"
          blurAmount={20}
          reducedTransparencyFallbackColor="white"
          style={modalStyles.blur}
        />
        <Modal transparent animationType="none">
          <View style={modalStyles.modal}>
            <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
              {this.props.button && (
                <Icon name="times-circle" style={modalStyles.icon} onPress={() => this.handleCancel()} />
              )}
            </View>
            <View
              style={{
                flexDirection: 'column',
                flex: 1,
                justifyContent: 'space-evenly',
              }}
            >
              <View>
                <Text style={styles.title}>{this.props.title}</Text>
                <Text style={styles.body}>{this.props.body}</Text>
              </View>
              {this.props.button && (
                <TouchableHighlight
                  underlayColor={hex}
                  onHideUnderlay={() => this.setState({ pressed: false })}
                  onShowUnderlay={() => this.setState({ pressed: true })}
                  onPress={() => this.handlePress()}
                  style={[modalStyles.button, {marginBottom: '3%'}]}
                >
                  <Text style={[modalStyles.text, this.state.pressed ? {color: 'white'} : {color: hex}]}>
                    {this.props.buttonText}
                  </Text>
                </TouchableHighlight>
              )}
            </View>
          </View>
        </Modal>
      </View>
    )
  }
}

Alert.propTypes = {
  press: PropTypes.func,
  cancel: PropTypes.func,
  button: PropTypes.bool,
  title: PropTypes.string,
  body: PropTypes.string,
}

const styles = StyleSheet.create({
  title: {
    fontFamily: font,
    color: hex,
    fontSize: 30,
    marginBottom: '3%',
    textAlign: 'center',
    marginRight: '2%',
    marginLeft: '2%',
  },
  body: {
    fontFamily: font,
    color: hex,
    fontSize: 17,
    marginBottom: '5%',
    textAlign: 'center',
  },
})
