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
import { Switch } from 'react-native-switch'
import colors from '../../styles/colors.js'
import modalStyles from '../../styles/modalStyles.js'
import normalize from '../../styles/normalize.js'
import screenStyles from '../../styles/screenStyles.js'
import Icon from 'react-native-vector-icons/AntDesign'
// import SwitchButton from 'switch-button-react-native'

export default class Time extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      selectedHour: '',
      selectedMinute: '',
      invalidTime: false,
      timeMode: 'pm',
      switch: true,
    }
  }

  // function called when main button is pressed
  handlePress(hr, min) {
    this.props.press(hr, min)
  }

  //  function called when 'x' is pressed
  handleCancel() {
    this.props.cancel()
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
      if (this.state.timeMode === 'pm') {
        if (hour !== 12) {
          hour = hour + 12
        }
      } else if (this.state.timeMode === 'am') {
        if (hour === 12) {
          hour = 0
        }
      }
      this.handlePress(hour, min)
    }
  }

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
            <Text style={[screenStyles.text, styles.black]}>Set a time for your group to eat</Text>
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
                <Switch
                  value={this.state.switch}
                  onValueChange={(val) =>
                    this.setState({ timeMode: val, switch: !this.state.switch })
                  }
                  disabled={false}
                  activeText={''}
                  inActiveText={''}
                  circleSize={30}
                  barHeight={30}
                  circleBorderWidth={0}
                  backgroundActive={'grey'}
                  backgroundInactive={'grey'}
                  circleActiveColor={colors.hex}
                  circleInActiveColor={colors.hex}
                  changeValueImmediately={true}
                  renderInsideCircle={() => <Text>{this.state.timeMode}</Text>} // custom component to render inside the Switch circle (Text, Image, etc.)
                  changeValueImmediately={true} // if rendering inside circle, change state immediately or wait for animation to complete
                  innerCircleStyle={styles.switchButtonInner} // style for inner animated circle for what you (may) be rendering inside the circle
                  outerCircleStyle={styles.switchButtonOuter} // style for outer animated circle
                  renderActiveText={true}
                  renderInActiveText={true}
                  switchLeftPx={2} // denominator for logic when sliding to TRUE position. Higher number = more space from RIGHT of the circle to END of the slider
                  switchRightPx={2} // denominator for logic when sliding to FALSE position. Higher number = more space from LEFT of the circle to BEGINNING of the slider
                  switchWidthMultiplier={1.5} // multipled by the `circleSize` prop to calculate total width of the Switch
                  switchBorderRadius={30} // Sets the border Radius of the switch slider. If unset, it remains the circleSize.
                />
                {/* <SwitchButton
                  onValueChange={(val) => this.setState({ timeMode: val })}
                  text1="pm"
                  text2="am"
                  switchWidth={75}
                  switchHeight={30}
                  switchBorderColor={screenStyles.hex.color}
                  btnBorderColor={screenStyles.hex.color}
                  btnBackgroundColor={screenStyles.hex.color}
                  fontColor={screenStyles.hex.color}
                  activeFontColor="white"
                  style={styles.switchButton}
                /> */}
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
              style={[modalStyles.doneButton, styles.doneButtonMargin]}
              onPress={() => this.evaluateTime()}
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
    marginTop: '3%',
  },
  doneButtonMargin: {
    marginTop: '5%',
  },
})

Time.propTypes = {
  press: PropTypes.func,
  cancel: PropTypes.func,
  visible: PropTypes.bool,
}
