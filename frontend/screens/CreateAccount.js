import React from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { bindActionCreators } from 'redux'
import { changeImage, changeName, changeUsername } from '../redux/Actions.js'
import { connect } from 'react-redux'
import { EMAIL, NAME, PHOTO, USERNAME, PHONE, REGISTRATION_TOKEN } from 'react-native-dotenv'
import {
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  TextInput,
  TouchableHighlight,
  View,
} from 'react-native'
import PropTypes from 'prop-types'
import accountsApi from '../apis/accountsApi.js'
import colors from '../../styles/colors.js'
import defImages from '../assets/images/defImages.js'
import notificationsApi from '../apis/notificationsApi.js'
import normalize from '../../styles/normalize.js'
import screenStyles from '../../styles/screenStyles.js'
import socket from '../apis/socket.js'

class createAccount extends React.Component {
  constructor() {
    super()
    this.state = {
      pressed: false,
      alert: false,
      errorAlert: false,
      name: '',
      username: '',
      phone: '',
      email: '',
      photo: defImages[Math.floor(Math.random() * defImages.length)].toString(),
      validNameFormat: true,
      validUsername: true,
      validUsernameFormat: true,
      facebook: false,
    }
    AsyncStorage.multiGet([EMAIL, NAME, PHONE])
      .then((res) => {
        console.log(res[0][1])
        this.setState(
          {
            email: res[0][1],
            name: res[1][1],
            phone: res[2][1],
          },
          () => {
            if (this.state.email) {
              this.setState({
                facebook: true,
              })
            }
          },
        )
      })
      .catch(() => {
        this.setState({ errorAlert: true })
      })
  }

  //  checks whether or not the username can be set
  handleClick = async () => {
    await this.checkUsernameValidity()
    if (
      !this.state.validUsername ||
      !this.state.validNameFormat ||
      !this.state.validUsernameFormat
    ) {
      return
    } else {
      this.props.changeUsername(this.state.username)
      this.props.changeName(this.state.name)
      this.props.changeImage(this.state.photo)
      global.email = this.state.email
      global.phone = this.state.phone
      accountsApi
        .createUser(
          this.state.name,
          this.state.username,
          this.state.email,
          this.state.phone,
          this.state.photo,
        )
        .then(() => AsyncStorage.getItem(REGISTRATION_TOKEN))
        .then((token) => notificationsApi.linkToken(token))
        .then(() => {
          socket.connect()
          this.props.navigation.replace('Home')
        })
        .catch(() => {
          this.setState({ errorAlert: true })
          return
        })
      AsyncStorage.multiSet([
        [USERNAME, this.state.username],
        [PHOTO, this.state.photo],
        [NAME, this.state.name],
      ])
      if (this.state.phone) {
        AsyncStorage.setItem(PHONE, this.state.phone)
      } else {
        AsyncStorage.setItem(EMAIL, this.state.email)
      }
    }
  }

  checkUsernameValidity() {
    if (this.state.username === '') {
      this.setState({ validUsername: false })
    } else {
      accountsApi
        .checkUsername(this.state.username)
        .then(() => {
          this.setState({ validUsername: true })
        })
        .catch(() => {
          this.setState({ validUsername: false })
        })
    }
  }

  checkNameSyntax() {
    /*regex expression: 
    - alphanumeric characters (lowercase or uppercase), dot (.), underscore (_), hyphen(-), space( )
    - must not start or end with space
    - 2-15 characters
    */
    const regex = /^[a-zA-Z0-9._-]([ ._-]|[a-zA-Z0-9]){0,13}[a-zA-Z0-9._-]$/
    if (!regex.test(this.state.name)) {
      this.setState({ validNameFormat: false })
    } else {
      this.setState({ validNameFormat: true })
    }
  }

  checkUsernameSyntax() {
    /*regex expression: 
    - alphanumeric characters (lowercase or uppercase), dot (.), underscore (_), hyphen(-)
    - no spaces
    - 2-15 characters
    */
    const regex = /^[a-zA-Z0-9._-]([._-]|[a-zA-Z0-9]){0,13}[a-zA-Z0-9._-]$/
    if (!regex.test(this.state.username)) {
      this.setState({ validUsernameFormat: false })
    } else {
      this.setState({ validUsernameFormat: true })
    }
  }

  render() {
    return (
      <ImageBackground
        source={require('../assets/backgrounds/CreateAccount.png')}
        style={styles.main}
      >
        <Text style={[screenStyles.textBold, screenStyles.title, styles.title]}>
          Create Account
        </Text>
        <Text style={[screenStyles.textBook, styles.mediumText]}>Account Verified!</Text>
        <Text style={[screenStyles.textBook, styles.mediumText, styles.instr]}>
          Finish setting up your account
        </Text>
        <Image
          source={{ uri: Image.resolveAssetSource(this.state.photo).uri }}
          style={styles.avatar}
        />
        <TouchableHighlight style={styles.select} underlayColor="transparent">
          <Text style={[styles.selectText, screenStyles.textBold]}>Select a Profile Icon</Text>
        </TouchableHighlight>
        <Text style={[screenStyles.textBook, styles.fieldName, styles.display]}>Display Name</Text>
        <TextInput
          style={[
            screenStyles.textBook,
            styles.fieldText,
            this.state.validNameFormat ? styles.fieldTextMargin : styles.fieldTextMarginWarning,
          ]}
          textAlign="left"
          onChangeText={(name) => {
            this.setState({ name }, () => this.checkNameSyntax())
          }}
          value={this.state.name}
          underlineColorAndroid="transparent"
          spellCheck={false}
          autoCorrect={false}
          keyboardType="visible-password"
          maxLength={15}
        />
        {!this.state.validNameFormat && (
          <Text style={[screenStyles.text, styles.warningText]}>Invalid display name format</Text>
        )}
        <Text style={[screenStyles.textBook, styles.fieldName]}>Username</Text>
        <TextInput
          style={[
            screenStyles.textBook,
            styles.fieldText,
            this.state.validUsername && this.state.validUsernameFormat
              ? styles.fieldTextMargin
              : styles.fieldTextMarginWarning,
          ]}
          textAlign="left"
          onChangeText={(username) => {
            this.setState({ username: username.split(' ').join('_'), validUsername: true }, () => {
              this.checkUsernameSyntax()
            })
          }}
          onSubmitEditing={this.handleClick}
          value={this.state.username}
          underlineColorAndroid="transparent"
          spellCheck={false}
          autoCorrect={false}
          keyboardType="visible-password"
          maxLength={15}
        />

        {!this.state.validUsername && this.state.validUsernameFormat && (
          <Text style={[screenStyles.text, styles.warningText]}>This username is taken</Text>
        )}
        {!this.state.validUsernameFormat && this.state.validUsername && (
          <Text style={[screenStyles.text, styles.warningText]}>Invalid username format</Text>
        )}
        {!this.state.validUsernameFormat && !this.state.validUsername && (
          <Text style={[screenStyles.text, styles.warningText]}>
            Invalid username format and username is taken
          </Text>
        )}
        {!this.state.facebook && (
          <View>
            <Text style={[screenStyles.textBook, styles.fieldName]}>Phone Number</Text>
            <Text
              style={[
                screenStyles.textBook,
                styles.fieldText,
                styles.fieldTextMargin,
                styles.fixedText,
              ]}
              textAlign="left"
            >
              {this.state.phone}
            </Text>
          </View>
        )}
        {this.state.facebook && (
          <View>
            <Text style={[screenStyles.textBook, styles.fieldName]}>Email</Text>

            <Text
              style={[
                screenStyles.textBook,
                styles.fieldText,
                styles.fieldTextMargin,
                styles.fixedText,
              ]}
              textAlign="left"
            >
              {this.state.email}
            </Text>
          </View>
        )}
        <TouchableHighlight
          onShowUnderlay={() => this.setState({ finishPressed: true })}
          onHideUnderlay={() => this.setState({ finishPressed: false })}
          activeOpacity={1}
          underlayColor={'white'}
          onPress={this.handleClick}
          style={[screenStyles.longButton, styles.button]}
        >
          <View style={[screenStyles.contentContainer]}>
            <Text
              style={[
                screenStyles.longButtonText,
                this.state.phonePressed ? { color: colors.hex } : { color: 'white' },
              ]}
            >
              Finish
            </Text>
          </View>
        </TouchableHighlight>
      </ImageBackground>
    )
  }
}

const mapStateToProps = (state) => {
  const { name } = state
  const { username } = state
  const { image } = state
  return { name, username, image }
}

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      changeName,
      changeUsername,
      changeImage,
    },
    dispatch,
  )

export default connect(mapStateToProps, mapDispatchToProps)(createAccount)

createAccount.propTypes = {
  navigation: PropTypes.object,
  // name: PropTypes.object,
  // username: PropTypes.object,
  // image: PropTypes.object,
  changeName: PropTypes.func,
  changeUsername: PropTypes.func,
  changeImage: PropTypes.func,
}
const styles = StyleSheet.create({
  main: {
    flex: 1,
  },
  display: {
    marginTop: '5%',
  },
  instr: {
    marginBottom: '5%',
  },
  title: {
    fontSize: normalize(25),
    color: 'white',
    marginTop: '10%',
    marginBottom: '3%',
  },
  avatar: {
    width: 110,
    height: 110,
    borderRadius: 94.5,
    borderWidth: 4,
    alignSelf: 'center',
  },
  select: {
    alignItems: 'center',
    marginTop: '2%',
    marginBottom: '10%',
  },
  selectText: {
    color: colors.hex,
  },
  button: {
    borderColor: colors.hex,
    backgroundColor: colors.hex,
    // width: '20%',
    marginTop: '7%',
  },
  mediumText: {
    alignSelf: 'center',
    fontSize: normalize(18.5),
    color: 'white',
  },
  fieldText: {
    fontSize: normalize(18),
    color: colors.darkGray,
    borderBottomColor: colors.darkGray,
    borderBottomWidth: 1,
  },
  fieldTextMargin: {
    marginHorizontal: '12%',
    marginBottom: '7%',
    paddingVertical: '1%',
  },
  fieldTextMarginWarning: {
    marginHorizontal: '12%',
    marginBottom: '2%',
    paddingVertical: '1%',
  },
  fixedText: {
    paddingVertical: '2%',
    paddingHorizontal: '2%',
  },
  fieldName: {
    fontSize: normalize(18.5),
    alignSelf: 'flex-start',
    color: 'black',
    marginLeft: '10%',
  },
  warningText: {
    color: colors.hex,
    fontSize: normalize(12),
    marginHorizontal: '12%',
    alignSelf: 'flex-start',
    marginBottom: '1.40%',
  },
})
