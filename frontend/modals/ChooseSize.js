import React from 'react'
import {
  Dimensions,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableHighlight,
  View,
} from 'react-native'
import PropTypes from 'prop-types'
import modalStyles from '../../styles/modalStyles.js'
import screenStyles from '../../styles/screenStyles.js'
import Icon from 'react-native-vector-icons/AntDesign'
import _ from 'lodash'

export default class Size extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      selectedSize: '',
      invalidSize: false,
    }
  }

  // function called when main button is pressed
  handlePress(size) {
    this.props.press(size)
  }

  //  function called when 'x' is pressed
  handleCancel() {
    this.props.cancel()
  }

  evaluate() {
    if (this.state.selectedSize === '') {
      this.setState({ invalidSize: true })
    }
    let s = parseInt(this.state.selectedSize)

    console.log(this.props.max)

    // Adjust min/max round lengths
    if (s < 1 || s > this.props.max) {
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
            <Text style={[screenStyles.text, modalStyles.titleText]}>{this.props.title}</Text>
            <Text style={[screenStyles.text, styles.black]}>{this.props.filterSubtext}</Text>
            <View style={modalStyles.inputContainer}>
              <TextInput
                style={modalStyles.textInput}
                value={this.state.selectedSize}
                onChangeText={(text) => this.setState({ selectedSize: text, invalidSize: false })}
                keyboardType="numeric"
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
                  Invalid {this.props.title.toLowerCase()}. Please try again
                </Text>
              </View>
            )}
            {!this.state.invalidSize && (
              <View style={[modalStyles.error, styles.errorMargin]}>
                <Text style={[screenStyles.text, modalStyles.errorText]}> </Text>
              </View>
            )}
            <TouchableHighlight
              style={[modalStyles.doneButton, styles.doneButtonMargin]}
              onPress={() => this.evaluateSize()}
            >
              <Text style={[screenStyles.text, modalStyles.doneText]}>Done</Text>
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
    marginTop: '3%',
  },
  doneButtonMargin: {
    marginTop: '5%',
  },
  black: {
    color: 'black',
  },
})
Size.propTypes = {
  title: PropTypes.string,
  filterSubtext: PropTypes.string,
  press: PropTypes.func,
  cancel: PropTypes.func,
  visible: PropTypes.bool,
  max: PropTypes.number,
}
