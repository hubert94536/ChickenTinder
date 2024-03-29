import PropTypes from 'prop-types'
import React, { Component } from 'react'
import CodeInput from 'react-native-confirmation-code-input'
import {
  ImageBackground,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native'
import AntDesign from 'react-native-vector-icons/AntDesign'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { BlurView } from '@react-native-community/blur'
import Alert from '../modals/Alert.js'
import { setDisable, hideDisable } from '../redux/Actions.js'
import colors from '../../styles/colors.js'
import loginService from '../apis/loginService.js'
import modalStyles from '../../styles/modalStyles.js'
import normalize from '../../styles/normalize.js'
import screenStyles from '../../styles/screenStyles.js'
import UserInfo from './UserInfo.js'

const font = 'CircularStd-Bold'

class PhoneAuthScreen extends Component {
  constructor(props) {
    super(props)
    this.state = {
      phone: '',
      confirmResult: false,
      verificationCode: '',
      userId: '',
      errorAlert: false,
      invalidNumberAlert: false,
      badCodeAlert: false,
      login: false,
    }
  }

  handleSendCode = async () => {
    this.props.setDisable()
    // Request to send OTP
    try {
      const confirm = await loginService.loginWithPhone('+1' + this.state.phone)
      this.setState({ confirmResult: confirm })
    } catch (err) {
      if (err.message == 'Invalid phone number') this.setState({ invalidNumberAlert: true })
      else this.setState({ errorAlert: true })
    }
    this.props.hideDisable()
  }

  changePhoneNumber = () => {
    this.setState({ confirmResult: null, verificationCode: '' })
  }

  handleVerifyCode = async () => {
    this.props.setDisable()
    // Request for OTP verification
    const { confirmResult, verificationCode } = this.state
    if (verificationCode.length === 6) {
      try {
        // get user's information and set
        let userCredential = await confirmResult.confirm(verificationCode)
        let result = await loginService.loginWithCredential(userCredential)
        if (result === "CreateAccount") {
          this.props.navigation.replace(result)
        }
        else {
            this.setState({ login: true }, () => {
            this.props.navigation.replace(result)
          })
        }
        this.props.hideDisable()
      } catch (error) {
        this.setState({ errorAlert: true })
        this.props.hideDisable()
        console.log(error)
      }
    } else {
      this.setState({ badCodeAlert: true })
      this.props.hideDisable()
    }
  }

  _onFulfill(code) {
    this.setState({ verificationCode: code }, () => {
      console.log(this.state.verificationCode)
    })
  }

  renderConfirmationCodeView() {
    return (
      <View style={styles.verificationView}>
        {/* get user's info upon logging in */}
        {this.state.login && <UserInfo></UserInfo>}
        <View style={styles.codeContainer}>
          <CodeInput
            ref="codeInputRef2"
            className={'border-b'}
            keyboardType="phone-pad"
            codeLength={6}
            size={40}
            containerStyle={{ marginTop: '5%' }}
            codeInputStyle={styles.textInput}
            onFulfill={(code) => this._onFulfill(code)}
            onCodeChange={(code) => {
              this.setState({ verificationCode: code })
            }}
          />
        </View>
        <TouchableOpacity
          disabled={this.props.disable}
          style={[screenStyles.longButton, styles.longButton]}
          onPress={() => this.handleVerifyCode()}
        >
          <Text style={[screenStyles.longButtonText, styles.longButtonText]}>Verify Code</Text>
        </TouchableOpacity>
      </View>
    )
  }

  // Navigate to login
  handleBack = () => {
    this.props.navigation.navigate('Login')
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
              disabled={this.props.disable}
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
                    fontFamily: screenStyles.medium.fontFamily,
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
                    fontFamily: screenStyles.medium.fontFamily,
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
              <View style={[styles.numberContainer]}>
                <Text style={[styles.fixedText]}>+1</Text>
                <TextInput
                  style={[styles.textInput, styles.phoneNumberInput]}
                  placeholder="Phone Number"
                  placeholderTextColor="#6A6A6A"
                  keyboardType="phone-pad"
                  value={this.state.phone}
                  onChangeText={(num) => {
                    this.setState({ phone: num })
                  }}
                  onSubmitEditing={this.handleSendCode}
                  maxLength={15}
                  editable={!this.state.confirmResult}
                />
              </View>
            )}

            {!this.state.confirmResult && (
              <TouchableOpacity
                disabled={this.props.disable}
                style={[screenStyles.longButton, styles.longButton]}
                onPress={this.handleSendCode}
              >
                <Text style={[screenStyles.longButtonText, styles.longButtonText]}>Submit</Text>
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
              title="Uh oh!"
              body="Something went wrong. Please try again!"
              buttonAff="Close"
              height="25%"
              press={() => this.setState({ errorAlert: false })}
              cancel={() => this.setState({ errorAlert: false })}
            />
          )}
          {this.state.invalidNumberAlert && (
            <Alert
              title="Invalid Phone Number"
              body="Please enter only digits!"
              buttonAff="Close"
              height="25%"
              press={() => this.setState({ invalidNumberAlert: false })}
              cancel={() => this.setState({ invalidNumberAlert: false })}
            />
          )}
          {this.state.badCodeAlert && (
            <Alert
              title="Invalid Code"
              body="Please enter your 6 digit code."
              buttonAff="Close"
              height="25%"
              press={() => this.setState({ badCodeAlert: false })}
              cancel={() => this.setState({ badCodeAlert: false })}
            />
          )}
        </SafeAreaView>
      </ImageBackground>
    )
  }
}

const mapStateToProps = (state) => {
  const { disable } = state
  return { disable }
}

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      setDisable,
      hideDisable,
    },
    dispatch,
  )

export default connect(mapStateToProps, mapDispatchToProps)(PhoneAuthScreen)

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  page: {
    flex: 1,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  textInput: {
    fontFamily: screenStyles.book.fontFamily,
    marginTop: 20,
    borderColor: '#A5A5A5',
    borderBottomWidth: 1.5,
    paddingHorizontal: 10,
    color: colors.darkGray,
    fontSize: 20,
  },
  phoneNumberInput: {
    width: '50%'
  },
  fixedText: {
    fontFamily: screenStyles.book.fontFamily,
    marginTop: 20,
    width: '10%',
    borderColor: '#A5A5A5',
    borderBottomWidth: 1.5,
    paddingLeft: 10,
    color: colors.darkGray,
    fontSize: 20,
    height: '54%',
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
  longButton: {
    borderColor: colors.hex,
    backgroundColor: colors.hex,
    marginBottom: '15%',
  },
  longButtonText: {
    color: '#FFFFFF',
  },
  themeButtonTitle: {
    fontFamily: screenStyles.medium.fontFamily,
    fontSize: 24,
    color: '#FFFFFF',
  },
  verificationView: {
    width: '100%',
    alignItems: 'center',
  },
  numberContainer: {
    marginTop: '8%',
    marginBottom: '10%',
    flexDirection: 'row',
    alignItems: 'flex-end',
  },

  codeContainer: {
    height: '1%',
    marginBottom: '50%',
  },
})

PhoneAuthScreen.propTypes = {
  navigation: PropTypes.object,
  setDisable: PropTypes.func,
  hideDisable: PropTypes.func,
  disable: PropTypes.bool,
}
