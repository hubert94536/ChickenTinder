import PropTypes from 'prop-types'
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
import AntDesign from 'react-native-vector-icons/AntDesign'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { BlurView } from '@react-native-community/blur'
import Alert from '../modals/Alert.js'
import { changeFriends, changeName, changeUsername, changeImage } from '../redux/Actions.js'
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
      confirmResult: null,
      verificationCode: '',
      userId: '',
      errorAlert: false,
      invalidNumberAlert: false,
      badCodeAlert: false,
      disabled: false,
      login: false,
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
      try {
        // get user's information and set
        let userCredential = await confirmResult.confirm(verificationCode)
        let result = await loginService.loginWithCredential(userCredential)
        this.setState({ login: true }, () => {
          this.props.navigation.replace(result)
        })
      } catch (error) {
        this.setState({ errorAlert: true, disabled: false })
        console.log(error)
      }
    } else {
      this.setState({ badCodeAlert: true, disabled: false })
    }
  }

  renderConfirmationCodeView() {
    return (
      <View style={styles.verificationView}>
        {/* get user's info upon logging in */}
        {this.state.login && <UserInfo></UserInfo>}
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
                  style={[styles.textInput]}
                  placeholder="Phone Number"
                  placeholderTextColor="#6A6A6A"
                  keyboardType="phone-pad"
                  value={this.state.phone}
                  onChangeText={(num) => {
                    this.setState({ phone: '+1' + num })
                  }}
                  maxLength={15}
                  editable={!this.state.confirmResult}
                />
              </View>
            )}

            {!this.state.confirmResult && (
              <TouchableOpacity
                disabled={this.state.disabled}
                style={[screenStyles.longButton, styles.longButton]}
                onPress={() => this.handleSendCode()}
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
  fixedText: {
    fontFamily: screenStyles.book.fontFamily,
    marginTop: 20,
    width: '7%',
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
    marginBottom: '5%',
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
    marginTop: '20%',
    marginBottom: '10%',
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
})

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      changeFriends,
      changeName,
      changeUsername,
      changeImage,
    },
    dispatch,
  )

export default connect(null, mapDispatchToProps)(PhoneAuthScreen)

PhoneAuthScreen.propTypes = {
  navigation: PropTypes.object,
}
