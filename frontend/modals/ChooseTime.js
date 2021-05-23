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
import Icon from 'react-native-vector-icons/AntDesign'
import PropTypes from 'prop-types'
import _ from 'lodash'
import ButtonSwitch from './ButtonSwitch.js'
import colors from '../../styles/colors.js'
import modalStyles from '../../styles/modalStyles.js'
import normalize from '../../styles/normalize.js'
import screenStyles from '../../styles/screenStyles.js'

export default class Time extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      selectedHour: '',
      selectedMinute: '',
      invalidTime: false,
      timeMode: 'AM',
      switch: true,
      pressed: false,
    }
  }

  // function called when main button is pressed
  handlePress(hr, min) {
    this.props.press(hr, min)
  }

  //  function called when 'x' is pressed
  handleCancel() {
    let invalid = this.state.invalidTime
    this.setState({
      selectedHour: '',
      selectedMinute: '',
      invalidTime: false,
    })
    this.props.cancel(invalid)
  }

  evaluateTime() {
    if (this.state.selectedMinute === '' || this.state.selectedHour === '') {
      this.setState({ invalidTime: true })
    }
    var hour = parseInt(this.state.selectedHour)
    var min = parseInt(this.state.selectedMinute)
    if (hour < 0 || hour > 12 || min < 0 || min > 59 || isNaN(hour) || isNaN(min)) {
      this.setState({ invalidTime: true })
    } else {
      if (this.state.timeMode === 'PM') {
        if (hour !== 12) {
          hour = hour + 12
        }
      } else if (this.state.timeMode === 'AM') {
        if (hour === 12) {
          hour = 0
        }
      }
      this.handlePress(hour, min)
    }
  }

  evaluate = _.debounce(this.evaluateTime.bind(this), 200)

  render() {
    return (
      <Modal animationType="fade" transparent visible={this.props.visible}>
        <View style={[styles.mainContainerHeight, modalStyles.mainContainer]}>
          <Icon
            name="closecircleo"
            style={[screenStyles.text, modalStyles.closeIcon]}
            onPress={() => this.handleCancel()}
          />
          <View style={modalStyles.titleContainer}>
            <Text style={[screenStyles.text, modalStyles.titleText]}>Time</Text>
            <Text style={[screenStyles.text, styles.black, styles.setMargin]}>
              Set a time for your group to eat
            </Text>
            <View style={modalStyles.error}>
              <TextInput
                style={[modalStyles.textInput, styles.black]}
                value={this.state.selectedHour}
                placeholder="12"
                placeholderTextColor="#9f9f9f"
                onChangeText={(text) => this.setState({ selectedHour: text, invalidTime: false })}
                keyboardType="numeric"
              />
              <Text style={[screenStyles.text, styles.colon]}>:</Text>
              <TextInput
                style={[modalStyles.textInput, styles.black]}
                value={this.state.selectedMinute}
                placeholder="00"
                placeholderTextColor="#9f9f9f"
                onChangeText={(text) => this.setState({ selectedMinute: text, invalidTime: false })}
                keyboardType="numeric"
              />
              <View style={styles.switchButton}>
                <ButtonSwitch
                  text1="AM"
                  text2="PM"
                  value1="AM"
                  value2="PM"
                  onValueChange={(val) => this.setState({ timeMode: val })}
                />
              </View>
            </View>
            {this.state.invalidTime && (
              <View style={[modalStyles.error, styles.errorMargin]}>
                <Icon name="exclamationcircle" color={colors.hex} style={modalStyles.errorIcon} />
                <Text style={[screenStyles.text, modalStyles.errorText]}>
                  Invalid time. Please try again
                </Text>
              </View>
            )}
            {!this.state.invalidTime && (
              <View style={[modalStyles.error, styles.errorMargin]}>
                <Text style={[screenStyles.text, modalStyles.errorText]}> </Text>
              </View>
            )}
            <TouchableHighlight
              onShowUnderlay={() => this.setState({ pressed: true })}
              onHideUnderlay={() => this.setState({ pressed: false })}
              underlayColor="white"
              style={[modalStyles.doneButton, styles.doneButtonMargin]}
              onPress={() => this.evaluate()}
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
    height: Dimensions.get('window').height * 0.28,
  },
  black: {
    color: 'black',
  },
  colon: {
    fontSize: normalize(20),
    marginRight: '2%',
    marginLeft: '2%',
  },
  switchButton: {
    marginLeft: '4%',
  },
  switchButtonInner: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 0,
    margin: 0,
  },
  switchButtonOuter: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 0,
    margin: 0,
  },
  errorMargin: {
    marginTop: '2%',
  },
  doneButtonMargin: {
    marginTop: '2%',
  },
  setMargin: {
    marginBottom: '2%',
  },
})

Time.propTypes = {
  press: PropTypes.func,
  cancel: PropTypes.func,
  visible: PropTypes.bool,
}
