import React, { Component } from 'react'
import {
  ImageBackground,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native'
import auth from '@react-native-firebase/auth'
import AntDesign from 'react-native-vector-icons/AntDesign'
import PropTypes from 'prop-types'
import Alert from '../modals/Alert.js'
import { BlurView } from '@react-native-community/blur'
import colors from '../../styles/colors.js'
import loginService from '../apis/loginService.js'
import modalStyles from '../../styles/modalStyles.js'
import normalize from '../../styles/normalize.js'
import screenStyles from '../../styles/screenStyles.js'

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
      disabled: false,
    }
  }

  handleSendCode = async () => {
    this.setState({ disabled: true })
    // Request to send OTP
    try {
      const confirm = await loginService.loginWithPhone(this.state.phone)
      this.setState({ confirmResult: confirm })
    } catch (err) {
      if (err.message == 'Invalid phone number') this.setState({ invalidNumberAlert: true })
      else this.setState({ errorAlert: true })
    }
    this.setState({ disabled: false })
  }

  changePhoneNumber = () => {
    this.setState({ confirmResult: null, verificationCode: '' })
  }

  handleVerifyCode = async () => {
    this.setState({ disabled: true })
    // Request for OTP verification
    const { confirmResult, verificationCode } = this.state
    if (verificationCode.length === 6) {
      confirmResult
        .confirm(verificationCode)
        .then((userCredential) => loginService.loginWithCredential(userCredential))
        .then((result) => this.props.navigation.replace(result))
        .catch((error) => {
          this.setState({ errorAlert: true })
          console.log(error)
        })
    } else {
      this.setState({ badCodeAlert: true })
    }
    this.setState({ disabled: false })
  }

  renderConfirmationCodeView() {
    return (
      <View style={styles.verificationView}>
        <TextInput
          style={[styles.textInput, { marginTop: '20%', marginBottom: '30%' }]}
          placeholder="Verification code"
          placeholderTextColor="#6A6A6A"
          value={this.state.verificationCode}
          keyboardType="numeric"
          onChangeText={(code) => {
            this.setState({ verificationCode: code })
          }}
          maxLength={6}
        />
        <TouchableOpacity
          disabled={this.state.disabled}
          style={[screenStyles.longButton, styles.longButton]}
          onPress={() => this.handleVerifyCode()}
        >
          <Text style={[screenStyles.longButtonText, styles.longButtonText]}>Verify Code</Text>
        </TouchableOpacity>
      </View>
    )
  }

  // Navigate to login
  handleBack = async () => {
    this.setState({ disabled: true })
    this.props.navigation.navigate('Login')
    this.setState({ disabled: false })
  }

  render() {
    return (
      <ImageBackground
        source={require('../assets/backgrounds/Login_Input_Phone.png')}
        style={screenStyles.screenBackground}
      >
        <SafeAreaView style={screenStyles.screenBackground}>
          <View style={styles.page}>
            <AntDesign
              disabled={this.state.disabled}
              name="arrowleft"
              style={{
                fontSize: 30,
                color: 'white',
                flexDirection: 'row',
                alignSelf: 'flex-start',
                marginTop: '5%',
                marginLeft: '5%',
              }}
              onPress={() => {
                this.handleBack()
              }}
            />
            {!this.state.confirmResult && (
              <View style={{ width: '70%' }}>
              <Text
                style={{
                  textAlign: 'left',
                  fontFamily: font,
                  fontSize: normalize(30),
                  color: 'white',
                }}
              >
                Enter your number
              </Text>
              <Text
                style={{
                  textAlign: 'left',
                  flexDirection: 'row',
                  fontFamily: screenStyles.book.fontFamily,
                  fontSize: normalize(18),
                  color: 'white',
                  marginTop: '5%',
                  marginBottom: '40%',
                }}
              >
                Enter your phone number for a text message verification code
              </Text>
            </View>
            )}

          {this.state.confirmResult && (
              <View style={{ width: '70%' }}>
              <Text
                style={{
                  textAlign: 'left',
                  fontFamily: font,
                  fontSize: normalize(30),
                  color: 'white',
                }}
              >
                Enter Code
              </Text>
              <Text
                style={{
                  textAlign: 'left',
                  flexDirection: 'row',
                  fontFamily: screenStyles.book.fontFamily,
                  fontSize: normalize(18),
                  color: 'white',
                  marginTop: '5%',
                  marginBottom: '40%',
                }}
              >
                We just texted you a verification code! Enter the code below
              </Text>
            </View>
            )}

            {!this.state.confirmResult && (
              <TextInput
              style={[styles.textInput, { marginTop: '20%', marginBottom: '10%' }]}
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

            )}

            {!this.state.confirmResult && (
              <TouchableOpacity
                disabled={this.state.disabled}
                style={[screenStyles.longButton,styles.longButton ]}
                onPress={() => this.handleSendCode()}
              >
                <Text style={[screenStyles.longButtonText, styles.longButtonText]}>
                Submit
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
      </ImageBackground>
    )
  }
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  textInput: {
    fontFamily: screenStyles.book.fontFamily,
    marginTop: 20,
    width: '80%',
    borderColor: '#A5A5A5',
    borderWidth: 0,
    borderBottomWidth: 1.5,
    paddingLeft: 10,
    color: colors.darkGray,
    fontSize: 20,
  },
  longButton: { 
    borderColor: colors.hex, 
    backgroundColor: colors.hex, 
    marginBottom: '5%' 
  },
  longButtonText: { 
      color: '#FFFFFF',
  },
  verificationView: {
    width: '100%',
    alignItems: 'center',
    // marginTop: 50,
  },
})

PhoneAuthScreen.propTypes = {
  navigation: PropTypes.object,
}

export default PhoneAuthScreen
