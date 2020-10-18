import React, { Component } from 'react'
import { StyleSheet, Text, View, TouchableHighlight, Modal } from 'react-native'
import { BlurView } from '@react-native-community/blur'
import PropTypes from 'prop-types'
import Icon from 'react-native-vector-icons/FontAwesome'

const hex = '#F25763'
const font = 'CircularStd-Medium'

export default class Alert extends Component {
  constructor(props) {
    super(props)
    this.state = { pressed: false }
  }

  // function called when main button is pressed
  handlePress() {
    this.props.press()
  }

  //  function called when 'x' is pressed
  handleCancel() {
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
          style={{ position: 'absolute', top: 0, bottom: 0, left: 0, right: 0 }}
        />
        <Modal transparent animationType="none">
          <View style={styles.modal}>
            <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
              {this.props.button && (
                <Icon name="times-circle" style={styles.icon} onPress={() => this.handleCancel()} />
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
                  style={styles.button}
                >
                  <Text style={this.state.pressed ? styles.textPressed : styles.text}>
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
  icon: {
    fontFamily: font,
    color: hex,
    marginTop: '5%',
    marginRight: '5%',
    fontSize: 30,
  },
  modal: {
    flex: 1,
    width: '80%',
    // margin: '3%',
    backgroundColor: 'white',
    alignSelf: 'center',
    borderRadius: 40,
    elevation: 20,
    margin: '50%',
  },
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
  button: {
    borderColor: hex,
    borderWidth: 2.5,
    borderRadius: 60,
    width: '50%',
    alignSelf: 'center',
    marginBottom: '3%',
  },
  text: {
    fontFamily: font,
    color: hex,
    fontSize: 20,
    paddingTop: '5%',
    paddingBottom: '5%',
    textAlign: 'center',
  },
  textPressed: {
    fontFamily: font,
    color: 'white',
    fontSize: 20,
    paddingTop: '5%',
    paddingBottom: '5%',
    textAlign: 'center',
  },
})
