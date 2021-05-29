import React from 'react'
import { Dimensions, Modal, StyleSheet, Text, TouchableHighlight, View } from 'react-native'
import PropTypes from 'prop-types'
import ButtonSwitch from './ButtonSwitch.js'
import modalStyles from '../../styles/modalStyles.js'
import screenStyles from '../../styles/screenStyles.js'
import Icon from 'react-native-vector-icons/AntDesign'
import _ from 'lodash'

const width = Dimensions.get('window').width

export default class Size extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      selectedSize: 10,
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
    this.setState({
      selectedSize: 10,
      invalidSize: false,
    })
    this.props.cancel()
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
                texts={['10', '20', '30', '40', '50']}
                values={['10', '20', '30', '40', '50']}
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
    height: width * 0.58,
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
