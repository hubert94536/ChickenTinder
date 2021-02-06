import React, { Component } from 'react'
import { SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import AntDesign from 'react-native-vector-icons/AntDesign'
import PropTypes from 'prop-types'
import Alert from '../modals/Alert.js'
import { BlurView } from '@react-native-community/blur'
import colors from '../../styles/colors.js'
import loginService from '../apis/loginService.js'
import modalStyles from '../../styles/modalStyles.js'

const font = 'CircularStd-Bold'
const fontMed = 'CirularStd-Medium'

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

  handleSendCode = async () => {
    // Request to send OTP
    try {
      const confirm = await loginService.loginWithPhone(this.state.phone);
      this.setState({ confirmResult: confirm })
    } catch (err) {
      if (err.message == "Invalid phone number") this.setState({ invalidNumberAlert: true });
      else this.setState({ errorAlert: true });
    }
  }

  changePhoneNumber = () => {
    this.setState({ confirmResult: null, verificationCode: '' })
  }

  handleVerifyCode = async() => {
    // Request for OTP verification
    const { confirmResult, verificationCode } = this.state
    if (verificationCode.length === 6) {
      confirmResult
        .confirm(verificationCode)
        .then((userCredential) => 
        loginService.loginWithCredential(userCredential)
        )
        .then((result) => this.props.navigation.replace(result))
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

  // Navigate to login
  handleBack = async () => {
    this.props.navigation.navigate('Login')
  }

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.page}>
          <AntDesign
            name="arrowleft"
            style={{
              fontSize: 30,
              color: colors.hex,
              flexDirection: 'row',
              alignSelf: 'flex-start',
              marginTop: '5%',
              marginLeft: '5%',
            }}
            onPress={() => {
              this.handleBack()
            }}
          />
          <View alignItems="center">
            <Text style={{ fontFamily: font, fontSize: 30, color: colors.hex }}>
              Enter your number
            </Text>
            <Text
              style={{
                textAlign: 'center',
                flexDirection: 'row',
                fontFamily: fontMed,
                fontSize: 20,
                color: '#6A6A6A',
                marginTop: '5%',
                marginBottom: '40%',
              }}
            >
              Enter your phone number for a text message verification code
            </Text>
          </View>
          <TextInput
            style={[styles.textInput, { marginTop: '0%', marginBottom: '50%' }]}
            placeholder="Phone Number (+1 xxx xxx xxxx)"
            placeholderTextColor="#6A6A6A"
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
              style={[styles.themeButton, { marginTop: 0, marginBottom: '10%' }]}
              onPress={() => this.handleSendCode()}
            >
              <Text style={styles.themeButtonTitle}>
                {this.state.confirmResult ? 'Change Phone Number' : 'Submit'}
              </Text>
            </TouchableOpacity>
          )}

          {this.state.confirmResult ? this.renderConfirmationCodeView() : null}
        </View>
        {(this.state.errorAlert || this.state.invalidNumberAlert || this.state.badCodeAlert) && (
          <BlurView
            blurType="dark"
            blurAmount={10}
            reducedTransparencyFallbackColor="white"
            style={modalStyles.blur}
          />
        )}
        {this.state.errorAlert && (
          <Alert
            title="Error, please try again"
            buttonAff="Close"
            height="20%"
            press={() => this.setState({ errorAlert: false })}
            cancel={() => this.setState({ errorAlert: false })}
          />
        )}
        {this.state.invalidNumberAlert && (
          <Alert
            title="Invalid Phone Number"
            buttonAff="Close"
            height="20%"
            press={() => this.setState({ invalidNumberAlert: false })}
            cancel={() => this.setState({ invalidNumberAlert: false })}
          />
        )}
        {this.state.badCodeAlert && (
          <Alert
            title="Please enter a 6 digit OTP code."
            buttonAff="Close"
            height="20%"
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
    backgroundColor: '#FFFFFF',
  },
  page: {
    flex: 1,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  textInput: {
    fontFamily: fontMed,
    marginTop: 20,
    width: '90%',
    borderColor: '#A5A5A5',
    borderWidth: 0,
    borderBottomWidth: 2,
    paddingLeft: 10,
    color: '#6A6A6A',
    fontSize: 20,
  },
  themeButton: {
    width: '90%',
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.hex,
    borderColor: '#FFFFFF',
    borderWidth: 2,
    borderRadius: 30,
  },
  themeButtonTitle: {
    fontFamily: fontMed,
    fontSize: 24,
    color: '#FFFFFF',
  },
  verificationView: {
    width: '100%',
    alignItems: 'center',
    marginTop: 50,
  },
})

PhoneAuthScreen.propTypes = {
  navigation: PropTypes.object,
}

export default PhoneAuthScreen
