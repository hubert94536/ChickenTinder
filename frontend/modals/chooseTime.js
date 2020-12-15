import React from 'react'
import { Dimensions, Modal, Text, TextInput, TouchableHighlight, View } from 'react-native'
import PropTypes from 'prop-types'
import screenStyles from '../../styles/screenStyles.js'
import Icon from 'react-native-vector-icons/AntDesign'
import SwitchButton from 'switch-button-react-native'

const hex = '#F15763'

export default class Time extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      selectedHour: '',
      selectedMinute: '',
      invalidTime: false,
      timeMode: 'pm',
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
        <View
          style={[
            {
              height: Dimensions.get('window').height * 0.3,
              width: '75%',
              marginTop: '50%',
              backgroundColor: 'white',
              elevation: 20,
              alignSelf: 'center',
              borderRadius: 10,
            },
          ]}
        >
          <Icon
            name="closecircleo"
            style={[
              screenStyles.text,
              {
                fontSize: 18,
                flexDirection: 'row',
                alignSelf: 'flex-end',
                marginTop: '4%',
                marginRight: '4%',
              },
            ]}
            onPress={() => this.handleCancel()}
          />
          <View style={{ marginLeft: '5%' }}>
            <Text style={[screenStyles.text, { fontSize: 17, marginBottom: '3%' }]}>Time</Text>
            <Text style={[screenStyles.text, { color: 'black' }]}>
              Set a time for your group to eat
            </Text>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <TextInput
                style={[
                  {
                    fontSize: 17,
                    color: 'black',
                    backgroundColor: '#E5E5E5',
                    height: '80%',
                    width: '17%',
                    borderRadius: 7,
                    textAlign: 'center',
                    padding: '3%',
                  },
                ]}
                value={this.state.selectedHour}
                placeholder="12"
                placeholderTextColor="#9f9f9f"
                onChangeText={(text) => this.setState({ selectedHour: text, invalidTime: false })}
                keyboardType="numeric"
              />
              <Text
                style={[screenStyles.text, { fontSize: 20, marginRight: '2%', marginLeft: '2%' }]}
              >
                :
              </Text>
              <TextInput
                style={[
                  {
                    fontSize: 17,
                    color: 'black',
                    backgroundColor: '#E5E5E5',
                    height: '80%',
                    width: '17%',
                    borderRadius: 7,
                    textAlign: 'center',
                    padding: '3%',
                    marginRight: '4%',
                  },
                ]}
                value={this.state.selectedMinute}
                placeholder="00"
                placeholderTextColor="#9f9f9f"
                onChangeText={(text) => this.setState({ selectedMinute: text, invalidTime: false })}
                keyboardType="numeric"
              />
              <SwitchButton
                onValueChange={(val) => this.setState({ timeMode: val })}
                text1="pm"
                text2="am"
                switchWidth={75}
                switchHeight={30}
                switchBorderColor={hex}
                btnBorderColor={hex}
                btnBackgroundColor={hex}
                fontColor={hex}
                activeFontColor="white"
              />
            </View>
            {this.state.invalidTime && (
              <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: '3%' }}>
                <Icon
                  name="exclamationcircle"
                  color={hex}
                  style={{ fontSize: 15, marginRight: '2%' }}
                />
                <Text style={[screenStyles.text, { fontSize: 12 }]}>
                  Invalid time. Please try again
                </Text>
              </View>
            )}
            {!this.state.invalidTime && (
              <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: '3%' }}>
                <Text style={[screenStyles.text, { fontSize: 12 }]}> </Text>
              </View>
            )}
            <TouchableHighlight
              style={{
                backgroundColor: hex,
                borderRadius: 30,
                alignSelf: 'center',
                width: '40%',
                marginTop: '5%',
              }}
              onPress={() => this.evaluateTime()}
            >
              <Text
                style={[
                  screenStyles.text,
                  {
                    color: 'white',
                    textAlign: 'center',
                    paddingTop: '5%',
                    paddingBottom: '5%',
                    fontSize: 20,
                  },
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

Time.propTypes = {
  press: PropTypes.func,
  cancel: PropTypes.func,
  visible: PropTypes.bool,
}
