import React, { Component } from 'react'
import { SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import auth from '@react-native-firebase/auth'
import PropTypes from 'prop-types'
import Alert from '../modals/alert.js'

const hex = '#F15763'
const font = 'CircularStd-Bold'

class PhoneAuthScreen extends Component {
  constructor(props) {
    super(props)
    this.state = {
      phone: '',
      confirmResult: null,
      verificationCode: '',
      userId: '',
      errorAlert: false,
      invalidNumberAlert: false,
      badCodeAlert: false,
    }
  }

  validatePhoneNumber() {
    var regexp = /1?\W*([2-9][0-8][0-9])\W*([2-9][0-9]{2})\W*([0-9]{4})(\se?x?t?(\d*))?/
    return regexp.test(this.state.phone)
  }

  async handleSendCode() {
    // Request to send OTP
    if (this.validatePhoneNumber()) {
      auth()
        .signInWithPhoneNumber(this.state.phone)
        .then((res) => {
          this.setState({ confirmResult: res })
        })
        .catch((error) => {
          this.setState({ errorAlert: true })
          console.log(error)
        })
    } else {
      this.setState({ invalidNumberAlert: true })
    }
  }

  changePhoneNumber() {
    this.setState({ confirmResult: null, verificationCode: '' })
  }

  async handleVerifyCode() {
    // Request for OTP verification
    const { confirmResult, verificationCode } = this.state
    if (verificationCode.length === 6) {
      confirmResult
        .confirm(verificationCode)
        .then((user) => {
          console.log(user)
          this.setState({ userId: user.uid })
          this.props.navigation.navigate('Username')
        })
        .catch((error) => {
          this.setState({ errorAlert: true })
          console.log(error)
        })
    } else {
      this.setState({ badCodeAlert: true })
    }
  }

  renderConfirmationCodeView() {
    return (
      <View style={styles.verificationView}>
        <TextInput
          style={styles.textInput}
          placeholder="Verification code"
          placeholderTextColor="#eee"
          value={this.state.verificationCode}
          keyboardType="numeric"
          onChangeText={(code) => {
            this.setState({ verificationCode: code })
          }}
          maxLength={6}
        />
        <TouchableOpacity
          style={[styles.themeButton, { marginTop: 20 }]}
          onPress={() => this.handleVerifyCode()}
        >
          <Text style={styles.themeButtonTitle}>Verify Code</Text>
        </TouchableOpacity>
      </View>
    )
  }

  render() {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: hex }]}>
        <View style={styles.page}>
          <TextInput
            style={styles.textInput}
            placeholder="Phone Number (+1 xxx xxx xxxx)"
            placeholderTextColor="#eee"
            keyboardType="phone-pad"
            value={this.state.phone}
            onChangeText={(num) => {
              this.setState({ phone: num })
            }}
            maxLength={15}
            editable={!this.state.confirmResult}
          />

          {this.state.confirmResult && (
            <TouchableOpacity
              style={[styles.themeButton, { marginTop: 20 }]}
              onPress={() => this.changePhoneNumber()}
            >
              <Text style={styles.themeButtonTitle}>
                {this.state.confirmResult ? 'Change Phone Number' : 'Send Code'}
              </Text>
            </TouchableOpacity>
          )}

          {!this.state.confirmResult && (
            <TouchableOpacity
              style={[styles.themeButton, { marginTop: 20 }]}
              onPress={() => this.handleSendCode()}
            >
              <Text style={styles.themeButtonTitle}>
                {this.state.confirmResult ? 'Change Phone Number' : 'Send Code'}
              </Text>
            </TouchableOpacity>
          )}

          {this.state.confirmResult ? this.renderConfirmationCodeView() : null}
        </View>
        {this.state.errorAlert && (
          <Alert
            title="Error, please try again"
            button
            buttonText="Close"
            press={() => this.setState({ errorAlert: false })}
            cancel={() => this.setState({ errorAlert: false })}
          />
        )}
        {this.state.invalidNumberAlert && (
          <Alert
            title="Invalid Phone Number"
            button
            buttonText="Close"
            press={() => this.setState({ invalidNumberAlert: false })}
            cancel={() => this.setState({ invalidNumberAlert: false })}
          />
        )}
        {this.state.badCodeAlert && (
          <Alert
            title="Please enter a 6 digit OTP code."
            button
            buttonText="Close"
            press={() => this.setState({ badCodeAlert: false })}
            cancel={() => this.setState({ badCodeAlert: false })}
          />
        )}
      </SafeAreaView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: hex,
  },
  page: {
    flex: 1,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textInput: {
    fontFamily: font,
    marginTop: 20,
    width: '90%',
    borderColor: '#fff',
    borderWidth: 2,
<<<<<<< HEAD
=======
    borderWidth: 0,
>>>>>>> 4ce2aa88b10804c5dccb45b6d8d843d1916b1416
    borderBottomWidth: 2,
    paddingLeft: 10,
    color: '#fff',
    fontSize: 20,
  },
  themeButton: {
    width: '90%',
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: hex,
    borderColor: '#fff',
    borderWidth: 2,
    borderRadius: 30,
  },
  themeButtonTitle: {
    fontFamily: font,
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  verificationView: {
    width: '100%',
    alignItems: 'center',
    marginTop: 50,
  },
})

<<<<<<< HEAD
// PhoneAuthScreen.propTypes = {
//   navigation: PropTypes.bool,
// }
=======
PhoneAuthScreen.propTypes = {
  navigation: PropTypes.object,
}
>>>>>>> 4ce2aa88b10804c5dccb45b6d8d843d1916b1416

export default PhoneAuthScreen
