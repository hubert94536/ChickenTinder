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

const width = Dimensions.get('window').width

export default class Majority extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      selectedValue: Math.ceil(this.props.max * 0.5),
      invalidValue: false,
      pressed: false,
      selected: this.setSelected(Math.ceil(this.props.max * 0.5)),
    }
  }

  //  function called when 'x' is pressed
  handleCancel() {
    let half = Math.ceil(this.props.max * 0.5)
    this.setState({ selectedValue: half, selected: this.setSelected(half) })
    this.props.cancel()
  }

  evaluateSize() {
    if (this.state.selectedValue === '') {
      this.setState({ invalidValue: true })
    } else {
      let s = parseInt(this.state.selectedValue)

      // Adjust min/max round lengths
      if (s < 1 || s > this.props.max || isNaN(s)) {
        this.setState({ invalidValue: true })
      } else {
        this.props.press(s)
      }
    }
  }

  setSelected(majority) {
    let size = this.props.max
    let half = Math.ceil(size * 0.5).toString()
    let twoThirds = Math.ceil(size * 0.67).toString()
    if (majority == half) return 0
    else if (majority == twoThirds) return 1
    else if (majority == size) return 2
    return -1
  }

  evaluate = _.debounce(this.evaluateSize.bind(this), 100)

  render() {
    let size = this.props.max
    let half = Math.ceil(size * 0.5).toString()
    let twoThirds = Math.ceil(size * 0.67).toString()
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
            <View style={[modalStyles.inputContainer, styles.inputContainer]}>
              {
                // Three buttons if group size is larger than 3
                size > 3 && (
                  <ButtonSwitch
                    texts={[half, twoThirds, 'All']}
                    values={[half, twoThirds, this.props.max.toString()]}
                    select={this.state.selected}
                    onValueChange={(majority) =>
                      this.setState({
                        selectedValue: majority,
                        selected: this.setSelected(majority),
                      })
                    }
                  />
                )
              }
              {
                // Two buttons if group size is less than or equal to 3
                (size == 2 || size == 3) && (
                  <ButtonSwitch
                    select={this.state.selected}
                    texts={[half, 'All']}
                    values={[half, this.props.max.toString()]}
                    onValueChange={(majority) =>
                      this.setState({
                        selectedValue: majority,
                        selected: this.setSelected(majority),
                      })
                    }
                  />
                )
              }
              {
                // Two buttons if group size is less than or equal to 3
                size == 1 && (
                  <ButtonSwitch
                    texts={['All']}
                    values={[this.props.max.toString()]}
                    select={this.state.selected}
                    onValueChange={(majority) =>
                      this.setState({
                        selectedValue: majority,
                        selected: this.setSelected(majority),
                      })
                    }
                  />
                )
              }
              <TextInput
                style={modalStyles.textInput}
                value={this.state.selectedValue.toString()}
                onChangeText={(text) =>
                  this.setState({
                    selectedValue: text,
                    invalidValue: false,
                    selected: this.setSelected(text),
                  })
                }
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
              style={modalStyles.doneButton}
              onPress={() => this.evaluate()}
              onShowUnderlay={() => this.setState({ pressed: true })}
              onHideUnderlay={() => this.setState({ pressed: false })}
              underlayColor="white"
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
    height: width * 0.4833,
  },
  inputContainer: {
    marginLeft: '0%',
  },
  input: {
    alignSelf: 'center',
    marginTop: '5%',
    marginLeft: '2%',
  },
  errorMargin: {
    marginTop: '2%',
    marginBottom: '4%',
    marginLeft: '3%',
  },
  black: {
    color: 'black',
  },
  white: {
    color: 'white',
  },
})

Majority.propTypes = {
  subtext: PropTypes.string,
  title: PropTypes.string,
  press: PropTypes.func,
  cancel: PropTypes.func,
  visible: PropTypes.bool,
  max: PropTypes.number,
}
