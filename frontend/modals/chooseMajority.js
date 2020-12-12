import React from 'react'
import { Dimensions, Modal, Text, TextInput, TouchableHighlight, View } from 'react-native'
import PropTypes from 'prop-types'
import screenStyles from '../../styles/screenStyles.js'
import Icon from 'react-native-vector-icons/AntDesign'

const hex = '#F15763'

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
    f
    this.props.press(size)
  }

  //  function called when 'x' is pressed
  handleCancel() {
    this.props.cancel()
  }

  evaluate() {
    if (this.state.selectedValue === '') {
      this.setState({ invalidValue: true })
    }
    let s = parseInt(this.state.selectedValue)

    console.log(this.props.max)

    // Adjust min/max round lengths
    if (s < 1 || s > this.props.max) {
      this.setState({ invalidValue: true })
    } else {
      this.handlePress(s)
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
            <Text style={[screenStyles.text, { fontSize: 17, marginBottom: '3%' }]}>
              {this.props.title}
            </Text>
            <Text style={[screenStyles.text, { color: 'black' }]}>{this.props.subtext}</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <TextInput
                style={[
                  {
                    fontSize: 17,
                    color: '#9f9f9f',
                    backgroundColor: '#E5E5E5',
                    height: '80%',
                    width: '17%',
                    borderRadius: 7,
                    textAlign: 'center',
                    padding: '3%',
                  },
                ]}
                value={this.state.selectedValue}
                onChangeText={(text) => this.setState({ selectedValue: text, invalidValue: false })}
                keyboardType="numeric"
              />
            </View>
            {this.state.invalidValue && (
              <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: '3%' }}>
                <Icon
                  name="exclamationcircle"
                  color={hex}
                  style={{ fontSize: 15, marginRight: '2%' }}
                />
                <Text style={[screenStyles.text, { fontSize: 12 }]}>
                  Invalid {this.props.title.toLowerCase()}. Please try again
                </Text>
              </View>
            )}
            {!this.state.invalidValue && (
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
              onPress={() => this.evaluate()}
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

Majority.propTypes = {
  title: PropTypes.string,
  subtext: PropTypes.string,
  press: PropTypes.func,
  cancel: PropTypes.func,
  visible: PropTypes.bool,
  max: PropTypes.number,
}
