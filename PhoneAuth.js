import React, { Component } from 'react'
import {
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  View,
  Text,
  TextInput,
  Alert,
} from 'react-native'
import auth from '@react-native-firebase/auth'

class PhoneAuthScreen extends Component {
  constructor(props) {
    super(props)
    this.state = {
      phone: '',
      confirmResult: null,
      verificationCode: '',
      userId: '',
    }
  }

  validatePhoneNumber() {
    var regexp = /1?\W*([2-9][0-8][0-9])\W*([2-9][0-9]{2})\W*([0-9]{4})(\se?x?t?(\d*))?/
    return regexp.test(this.state.phone)
  }

  handleSendCode() {
    // Request to send OTP
    if (this.validatePhoneNumber()) {
      auth()
        .signInWithPhoneNumber(this.state.phone)
        .then((confirmResult) => {
          this.setState({ confirmResult })
        })
        .catch((error) => {
          Alert.alert(error.message)
          console.log(error)
        })
    } else {
      Alert.alert('Invalid Phone Number')
    }
  }

  changePhoneNumber() {
    this.setState({ confirmResult: null, verificationCode: '' })
  }

  handleVerifyCode() {
    // Request for OTP verification
    const { confirmResult, verificationCode } = this.state
    if (verificationCode.length === 6) {
      confirmResult
        .confirm(verificationCode)
        .then((user) => {
          this.setState({ userId: user.uid })
          Alert.alert('Verified!')
        })
        .catch((error) => {
          Alert.alert(error.message)
          console.log(error)
        })
    } else {
      Alert.alert('Please enter a 6 digit OTP code.')
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
          onChangeText={(verificationCode) => {
            this.setState({ verificationCode })
          }}
          maxLength={6}
        />
        <TouchableOpacity
          style={[styles.themeButton, { marginTop: 20 }]}
          onPress={this.handleVerifyCode}
        >
          <Text style={styles.themeButtonTitle}>Verify Code</Text>
        </TouchableOpacity>
      </View>
    )
  }

  render() {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: '#de4a4a' }]}>
        <View style={styles.page}>
          <TextInput
            style={styles.textInput}
            placeholder="Phone Number (+1 xxx xxx xxxx)"
            placeholderTextColor="#eee"
            keyboardType="phone-pad"
            value={this.state.phone}
            onChangeText={(phone) => {
              this.setState({ phone })
            }}
            maxLength={15}
            editable={!this.state.confirmResult}
          />

          <TouchableOpacity
            style={[styles.themeButton, { marginTop: 20 }]}
            onPress={this.state.confirmResult ? this.changePhoneNumber : this.handleSendCode}
          >
            <Text style={styles.themeButtonTitle}>
              {this.state.confirmResult ? 'Change Phone Number' : 'Send Code'}
            </Text>
          </TouchableOpacity>

          {this.state.confirmResult ? this.renderConfirmationCodeView() : null}
        </View>
      </SafeAreaView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#de4a4a',
  },
  page: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textInput: {
    marginTop: 20,
    width: '90%',
    height: 40,
    borderColor: '#fff',
    borderWidth: 2,
    borderRadius: 5,
    paddingLeft: 10,
    color: '#fff',
    fontSize: 16,
  },
  themeButton: {
    width: '90%',
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#de4a4a',
    borderColor: '#fff',
    borderWidth: 2,
    borderRadius: 5,
  },
  themeButtonTitle: {
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

export default PhoneAuthScreen
