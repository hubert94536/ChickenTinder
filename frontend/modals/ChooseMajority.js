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
import ButtonSwitch from './ButtonSwitch.js'
import modalStyles from '../../styles/modalStyles.js'
import screenStyles from '../../styles/screenStyles.js'
import Icon from 'react-native-vector-icons/AntDesign'
import _ from 'lodash'
import { ButtonGroup } from 'react-native-elements'

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
    let size = this.props.max
    let half = Math.ceil(size * 0.5).toString()
    let twoThirds = Math.ceil(size * 0.67).toString()
    // if (half == twoThirds) {
    //   twoThirds = undefined
    // }
    return (
      <Modal animationType="fade" transparent visible={this.props.visible}>
        <View style={[modalStyles.mainContainer, styles.mainContainerHeight]}>
          <Icon
            name="closecircleo"
            style={[screenStyles.text, modalStyles.closeIcon]}
            onPress={() => this.handleCancel()}
          />
          <View style={modalStyles.titleContainer}>
            <Text style={[screenStyles.text, modalStyles.titleText]}>Majority</Text>
            <Text style={[styles.black, screenStyles.book]}>
              How many members needed for a match
            </Text>

            <View style={modalStyles.inputContainer}>
              <ButtonSwitch
                text1= {half}
                text2= {twoThirds}
                text3="All"
                value1={half}
                value2={twoThirds}
                value3={this.props.max.toString()}
                onValueChange={(majority)=>
                    this.setState({selectedValue: majority})
                }
              />
              <TextInput
                style={modalStyles.textInput}
                value={this.state.selectedValue}
                onChangeText={(text) => this.setState({ selectedValue: text, invalidValue: false })}
                keyboardType="numeric"
                defaultValue={this.props.max.toString()}
              />
              <Text style={[screenStyles.text, modalStyles.titleText, styles.input]}>
                / {this.props.max}
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
    height: Dimensions.get('window').height * 0.25,
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
  subtext: PropTypes.string,
  press: PropTypes.func,
  cancel: PropTypes.func,
  visible: PropTypes.bool,
  max: PropTypes.number,
}
