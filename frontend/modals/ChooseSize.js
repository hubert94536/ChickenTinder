import React from 'react'
import { Dimensions, Modal, StyleSheet, Text, TouchableHighlight, View } from 'react-native'
import PropTypes from 'prop-types'
import ButtonSwitch from './ButtonSwitch.js'
import modalStyles from '../../styles/modalStyles.js'
import screenStyles from '../../styles/screenStyles.js'
import Icon from 'react-native-vector-icons/AntDesign'
import _ from 'lodash'

export default class Size extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      selectedSize: this.props.select,
      invalidSize: false,
      pressed: false,
    }
  }

  // function called when main button is pressed
  handlePress(size) {
    this.props.press(size)
  }

  //  function called when 'x' is pressed
  handleCancel() {
    let invalid = this.state.invalidSize
    this.setState({
      selectedSize: '',
      invalidSize: false,
    })
    this.props.cancel(invalid)
  }

  evaluate() {
    let s = parseInt(this.state.selectedSize)

    // Adjust min/max round lengths
    if (isNaN(s) || s < 1 || s > this.props.max) {
      this.setState({ invalidSize: true })
    } else {
      this.handlePress(s)
    }
  }

  evaluateSize = _.debounce(this.evaluate.bind(this), 200)

  render() {
    return (
      <Modal animationType="fade" transparent visible={this.props.visible}>
        <View style={[modalStyles.mainContainer, styles.mainContainerHeight]}>
          <Icon
            name="closecircleo"
            style={[screenStyles.text, modalStyles.closeIcon]}
            onPress={() => this.handleCancel()}
          />
          <View style={modalStyles.titleContainer}>
            <Text style={[screenStyles.text, modalStyles.titleText]}>Round Size</Text>
            <Text style={[screenStyles.text, styles.black, screenStyles.book]}>
              Choose the max number of restaurants to swipe through
            </Text>
            <View style={modalStyles.inputContainer}>
              <ButtonSwitch
                text1="10"
                text2="20"
                text3="30"
                text4="40"
                text5="50"
                value1="10"
                value2="20"
                value3="30"
                value4="40"
                value5="50"
                select={this.state.selectedSize / 10 - 1}
                onValueChange={(size) => {
                  this.setState({ selectedSize: size })
                }}
              />
            </View>
            {this.state.invalidSize && (
              <View style={[modalStyles.error, styles.errorMargin]}>
                <Icon
                  name="exclamationcircle"
                  color={screenStyles.hex.color}
                  style={modalStyles.errorIcon}
                />
                <Text style={[screenStyles.text, modalStyles.errorText]}>
                  Round size must be between 0-50.
                </Text>
              </View>
            )}
            {!this.state.invalidSize && (
              <View style={[modalStyles.error, styles.errorMargin]}>
                <Text style={[screenStyles.text, modalStyles.errorText]}> </Text>
              </View>
            )}
            <TouchableHighlight
              onPress={() => this.evaluate()}
              onShowUnderlay={() => this.setState({ pressed: true })}
              onHideUnderlay={() => this.setState({ pressed: false })}
              underlayColor="white"
              style={modalStyles.doneButton}
              onPress={() => this.evaluateSize()}
            >
              <Text
                style={[
                  screenStyles.text,
                  modalStyles.doneText,
                  this.state.pressed ? screenStyles.hex : screenStyles.white,
                ]}
              >
                Done
              </Text>
            </TouchableHighlight>
          </View>
        </View>
      </Modal>
    )
  }
}

const styles = StyleSheet.create({
  mainContainerHeight: {
    height: Dimensions.get('window').height * 0.3,
  },
  errorMargin: {
    marginTop: '2%',
    marginBottom: '4%',
    marginLeft: '3%',
  },
  black: {
    color: 'black',
  },
})
Size.propTypes = {
  press: PropTypes.func,
  cancel: PropTypes.func,
  visible: PropTypes.bool,
  max: PropTypes.number,
}
