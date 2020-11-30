import React, { Component } from 'react'
import { StyleSheet, Text, View, TouchableHighlight, Modal } from 'react-native'
import { BlurView } from '@react-native-community/blur'
import PropTypes from 'prop-types'
import modalStyles from '../../styles/modalStyles.js'
import AntDesign from 'react-native-vector-icons/AntDesign'

const hex = '#F15763'
const font = 'CircularStd-Medium'

export default class Alert extends Component {
  constructor(props) {
    super(props)
    this.state = {
      affPressed: false,
      negPressed: false,
    }
  }

  // function called when main button is pressed
  handlePress() {
    this.props.press()
  }

  //  function called when 'x' is pressed
  handleCancel() {
    this.props.cancel()
  }

  render() {
    return (
      <View>
        <Text />
        <BlurView
          blurType="light"
          blurAmount={20}
          reducedTransparencyFallbackColor="white"
          style={modalStyles.blur}
        />
        <Modal transparent animationType="none">
          <View style={[modalStyles.modal, { height: this.props.height }]}>
            <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
              <AntDesign
                name="closecircleo"
                style={modalStyles.icon}
                onPress={() => this.handleCancel()}
              />
            </View>
            <View
              style={{
                flexDirection: 'column',
                flex: 1,
                justifyContent: 'space-evenly',
              }}
            >
              <View style={{ marginLeft: '10%', marginRight: '10%' }}>
                <Text style={styles.title}>{this.props.title}</Text>
                <Text style={styles.body}>{this.props.body}</Text>
              </View>
              <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                <TouchableHighlight
                  underlayColor={hex}
                  onHideUnderlay={() => this.setState({ affPressed: false })}
                  onShowUnderlay={() => this.setState({ affPressed: true })}
                  onPress={() => this.handlePress()}
                  style={[modalStyles.button, { marginBottom: '3%' }]}
                >
                  <Text
                    style={[
                      modalStyles.text,
                      this.state.affPressed ? { color: 'white' } : { color: hex },
                    ]}
                  >
                    {this.props.buttonAff}
                  </Text>
                </TouchableHighlight>
                {this.props.twoButton && (
                  <TouchableHighlight
                    underlayColor={'white'}
                    onHideUnderlay={() => this.setState({ negPressed: false })}
                    onShowUnderlay={() => this.setState({ negPressed: true })}
                    onPress={() => this.handleCancel()}
                    style={[modalStyles.button, { marginBottom: '3%', backgroundColor: hex }]}
                  >
                    <Text
                      style={[
                        modalStyles.text,
                        this.state.negPressed ? { color: hex } : { color: 'white' },
                      ]}
                    >
                      {this.props.buttonNeg}
                    </Text>
                  </TouchableHighlight>
                )}
              </View>
            </View>
          </View>
        </Modal>
      </View>
    )
  }
}

Alert.propTypes = {
  press: PropTypes.func,
  cancel: PropTypes.func,
  twoButton: PropTypes.bool,
  title: PropTypes.string,
  body: PropTypes.string,
  height: PropTypes.string,
  buttonAff: PropTypes.string,
  buttonNeg: PropTypes.string,
}

const styles = StyleSheet.create({
  title: {
    fontFamily: font,
    fontWeight: 'bold',
    color: hex,
    fontSize: 20,
    marginBottom: '3%',
  },
  body: {
    fontFamily: font,
    fontSize: 15,
    marginLeft: '2%',
  },
})
