import React from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { bindActionCreators } from 'redux'
import { changeImage, changeName, changeUsername } from '../redux/Actions.js'
import { connect } from 'react-redux'
import { EMAIL, NAME, PHOTO, USERNAME, PHONE, REGISTRATION_TOKEN } from 'react-native-dotenv'
import { Image, StyleSheet, Text, TextInput, TouchableHighlight, View } from 'react-native'
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
      validEmail: true,
      validEmailFormat: true,
      validNameFormat: true,
      validUsername: true,
      validUsernameFormat: true,
      facebook: false,
    }
    AsyncStorage.multiGet([EMAIL, NAME, PHONE])
      .then((res) => {
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
  handleClick() {
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
    changeUsername(this.state.username)
    changeName(this.state.name)
    changeImage(this.state.photo)
    global.email = this.state.email
    global.phone = this.state.phone
    return accountsApi
      .createFBUser(this.state.name, this.state.username, this.state.email, this.state.photo)
      .then(() => AsyncStorage.getItem(REGISTRATION_TOKEN))
      .then((token) => notificationsApi.linkToken(token))
      .then(() => {
        socket.connect()
        this.props.navigation.replace('Home')
      })
      .catch(() => {
        this.setState({ errorAlert: true })
      })
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
    const regex = /^[a-zA-Z0-9._\-]([ ._\-]|[a-zA-Z0-9]){0,13}[a-zA-Z0-9._\-]$/
    if (!regex.test(this.state.name)) {
      this.setState({ validNameFormat: false })
    } else {
      this.setState({ validNameFormat: true })
    }
  }

  checkUsernameSyntax() {
    const regex = /^[a-zA-Z0-9]([._-]|[a-zA-Z0-9]){0,13}[a-zA-Z0-9]$/
    if (!regex.test(this.state.username)) {
      this.setState({ validUsernameFormat: false })
    } else {
      this.setState({ validUsernameFormat: true })
    }
  }

  render() {
    return (
      <View style={[screenStyles.mainContainer]}>
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
        <Text style={[screenStyles.textBook, styles.fieldName, styles.display]}>Display Name</Text>
        <TextInput
          style={[screenStyles.textBook, styles.fieldText]}
          textAlign="left"
          onChangeText={(name) => {
            this.setState({ name })
          }}
          value={this.state.name}
          maxLength={15}
        />
        <Text style={[screenStyles.textBook, styles.fieldName]}>Username</Text>
        <TextInput
          style={[
            screenStyles.textBook,
            styles.fieldText,
            {
              marginBottom:
                this.state.validUsername && this.state.validUsernameFormat ? '7%' : '0%',
            },
          ]}
          textAlign="left"
          onChangeText={(username) => {
            this.setState({ username: username.split(' ').join('_') }, () => {
              this.checkUsernameSyntax()
            })
          }}
          onBlur={() => this.checkUsernameValidity()}
          value={this.state.username}
          maxLength={15}
        />

        {!this.state.validUsername && (
          <Text style={[screenStyles.text, styles.warningText]}>This username is taken</Text>
        )}
        {!this.state.validUsernameFormat && (
          <Text style={[screenStyles.text, styles.warningText]}>Invalid username format</Text>
        )}
        {!this.state.facebook && (
          <View>
            <Text style={[screenStyles.textBook, styles.fieldName]}>Phone Number</Text>
            <Text
              style={[screenStyles.textBook, styles.fieldText, styles.fixedText]}
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
              style={[screenStyles.textBook, styles.fieldText, styles.fixedText]}
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
          onPress={() => this.handleClick()}
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
      </View>
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
  changeImagee: PropTypes.func,
}
const styles = StyleSheet.create({
  display: {
    marginTop: '5%',
  },
  instr: {
    marginBottom: '5%',
  },
  title: {
    fontSize: normalize(25),
    marginTop: '10%',
    marginBottom: '5%',
  },
  avatar: {
    width: 150,
    height: 150,
    borderRadius: 94.5,
    borderWidth: 4,
    alignSelf: 'center',
    margin: '1.5%',
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
    color: colors.darkGray,
  },
  fieldText: {
    fontSize: normalize(18),
    color: colors.darkGray,
    marginHorizontal: '12%',
    marginBottom: '7%',
    paddingVertical: '1%',
    borderBottomColor: colors.darkGray,
    borderBottomWidth: 1,
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
  },
})
