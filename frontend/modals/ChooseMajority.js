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

export default class Majority extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      selectedValue: '',
      invalidValue: false,
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

  evaluateSize() {
    if (this.state.selectedValue === '') {
      this.setState({ invalidValue: true })
    }
    let s = parseInt(this.state.selectedValue)

    // Adjust min/max round lengths
    if (s < 1 || s > this.props.max || isNaN(s)) {
      this.setState({ invalidValue: true })
    } else {
      this.handlePress(s)
    }
  }

  evaluate = _.debounce(this.evaluateSize.bind(this), 100)

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
            <Text style={[screenStyles.text, styles.black]}>
              Members (out of {this.props.max}) needed to get a match
            </Text>
            <View style={modalStyles.inputContainer}>
              <TextInput
                style={modalStyles.textInput}
                value={this.state.selectedValue}
                onChangeText={(text) => this.setState({ selectedValue: text, invalidValue: false })}
                keyboardType="numeric"
                defaultValue={this.props.max.toString()}
              />
              <Text style={[screenStyles.text, modalStyles.titleText, styles.input]}>
                / {this.props.max} members
              </Text>
            </View>
            {this.state.invalidValue && (
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
            {!this.state.invalidValue && (
              <View style={[modalStyles.error, styles.errorMargin]}>
                <Text style={[screenStyles.text, modalStyles.errorText]}> </Text>
              </View>
            )}
            <TouchableHighlight
              style={[modalStyles.doneButton, styles.doneButtonMargin]}
              onPress={() => this.evaluate()}
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
  input: {
    alignSelf: 'center',
    marginTop: '3%',
    marginLeft: '2%',
  },
  errorMargin: {
    marginBottom: '1%',
  },
  doneButtonMargin: {
    marginTop: '3%',
  },
  black: {
    color: 'black',
  },
})

Majority.propTypes = {
  title: PropTypes.string,
  subtext: PropTypes.string,
  press: PropTypes.func,
  cancel: PropTypes.func,
  visible: PropTypes.bool,
  max: PropTypes.number,
}
