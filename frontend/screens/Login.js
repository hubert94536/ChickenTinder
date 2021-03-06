import PropTypes from 'prop-types'
import React from 'react'
import { connect } from 'react-redux'
import { Image, ImageBackground, StyleSheet, Text, TouchableHighlight, View } from 'react-native'
import { bindActionCreators } from 'redux'
import Alert from '../modals/Alert.js'
import { BlurView } from '@react-native-community/blur'
import colors from '../../styles/colors.js'
import Icon from 'react-native-vector-icons/FontAwesome'
import { hideError, showError } from '../redux/Actions.js'
import imgStyles from '../../styles/cardImage.js'
import loginService from '../apis/loginService.js'
import modalStyles from '../../styles/modalStyles.js'
import normalize from '../../styles/normalize.js'
import screenStyles from '../../styles/screenStyles.js'
import UserInfo from './UserInfo.js'

class Login extends React.Component {
  constructor() {
    super()
    this.state = {
      pressed: false,
      alert: false,
      disabled: false,
      login: false,
    }
  }

  phoneLogin() {
    this.setState({ disabled: true })
    this.props.navigation.replace('Phone')
  }

  async facebookLogin() {
    if (!this.state.disabled) {
      this.setState({ disabled: true })
      loginService
        .loginWithFacebook()
        .then(async (result) => {
          this.setState({ alert: false, login: true }, () => {
            this.props.navigation.replace(result)
          })
        })
        .catch((err) => {
          console.log(err)
          this.props.showError()
          this.setState({ disabled: false })
        })
    }
  }

  cancelClick() {
    this.setState({ alert: false, disabled: false })
  }

  login() {
    this.setState({ alert: true })
  }

  render() {
    return (
      <ImageBackground source={require('../assets/backgrounds/Login.png')} style={styles.main}>
        {/* get user's info upon logging in */}
        {this.state.login && <UserInfo></UserInfo>}
        <Image source={require('../assets/Icon_White.png')} style={styles.logo} />
        <View style={styles.bottom}>
          <TouchableHighlight
            onShowUnderlay={() => this.setState({ phonePressed: true })}
            onHideUnderlay={() => this.setState({ phonePressed: false })}
            activeOpacity={1}
            underlayColor={'white'}
            onPress={() => this.phoneLogin()}
            style={[screenStyles.longButton, styles.phoneButton]}
          >
            <View style={screenStyles.contentContainer}>
              <Icon style={[imgStyles.icon, styles.buttonIcon]} name="phone" />
              <Text
                style={[
                  screenStyles.longButtonText,
                  this.state.phonePressed ? { color: colors.hex } : { color: 'white' },
                ]}
              >
                Login with Phone
              </Text>
            </View>
          </TouchableHighlight>
          <TouchableHighlight
            onShowUnderlay={() => this.setState({ pressed: true })}
            onHideUnderlay={() => this.setState({ pressed: false })}
            activeOpacity={1}
            underlayColor="white"
            onPress={() => this.login()}
            disabled={this.state.disabled}
            style={[screenStyles.longButton, styles.fbButton]}
          >
            <View style={[screenStyles.contentContainer]}>
              <Icon style={[imgStyles.icon, styles.buttonIcon]} name="facebook-official" />
              <Text
                style={[
                  screenStyles.longButtonText,
                  this.state.pressed ? { color: '#3b5998' } : { color: 'white' },
                ]}
              >
                Login with Facebook
              </Text>
            </View>
          </TouchableHighlight>

          <Text style={[screenStyles.textBook, styles.termsText]}>
            By clicking log in, you agree with our Terms and Conditions. Learn how we process your
            data in our Privacy Policy and Cookies Policy
          </Text>
        </View>
        {(this.state.alert || this.state.error) && (
          <BlurView
            blurType="dark"
            blurAmount={10}
            reducedTransparencyFallbackColor="white"
            style={modalStyles.blur}
          />
        )}
        {this.state.alert && (
          <Alert
            title='Open "Facebook?"'
            body="You will be directed to the Facebook app for account verification"
            twoButton
            buttonAff="Open"
            buttonNeg="Go Back"
            height="25%"
            press={() => this.facebookLogin()}
            cancel={() => this.cancelClick()}
          />
        )}
        {this.props.error && (
          <Alert
            title="Error, please try again"
            buttonAff="Close"
            height="20%"
            disabled={false}
            press={() => this.props.hideError()}
            cancel={() => this.props.hideError()}
          />
        )}
      </ImageBackground>
    )
  }
}

const mapStateToProps = (state) => {
  const { error } = state
  return { error }
}

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      showError,
      hideError,
    },
    dispatch,
  )

export default connect(mapStateToProps, mapDispatchToProps)(Login)

Login.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
    replace: PropTypes.func,
  }).isRequired,
  error: PropTypes.bool,
  showError: PropTypes.func,
  hideError: PropTypes.func,
  changeName: PropTypes.func,
  changeUsername: PropTypes.func,
  changeImage: PropTypes.func,
  changeFriends: PropTypes.func,
}

const styles = StyleSheet.create({
  main: {
    flex: 1,
    justifyContent: 'space-evenly',
  },
  logo: {
    alignSelf: 'center',
    width: normalize(200),
    height: normalize(248),
    marginTop: '5%',
  },
  phoneButton: { borderColor: colors.hex, backgroundColor: colors.hex, marginTop: '5%' },
  buttonIcon: { fontSize: normalize(22), color: 'white', marginRight: '5%' },
  fbButton: { borderColor: '#3b5998', backgroundColor: '#3b5998', marginTop: '5%' },
  termsText: {
    alignSelf: 'center',
    marginHorizontal: '15%',
    marginTop: '5%',
    fontSize: normalize(13),
    textAlign: 'center',
    lineHeight: normalize(17),
  },
  bottom: {
    marginTop: '30%',
  },
})
