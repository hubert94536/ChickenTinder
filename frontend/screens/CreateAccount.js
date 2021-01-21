import React from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { EMAIL, NAME, PHOTO, USERNAME, PHONE } from 'react-native-dotenv'
import { Image, KeyboardAvoidingView, StyleSheet, Text, TextInput, TouchableHighlight, View,  } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import PropTypes from 'prop-types'
import accountsApi from '../apis/accountsApi.js'
import normalize from '../../styles/normalize.js'
import screenStyles from '../../styles/screenStyles.js'
import defImages from '../assets/images/defImages.js'
import socket from '../apis/socket.js'

const hex = screenStyles.hex.color
const textColor = '#6A6A6A'

export default class createAccount extends React.Component {
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
      validUsername: true,
    }
    AsyncStorage.multiGet([EMAIL, NAME, PHONE])
      .then((res) => {
        this.setState({
          email: res[0][1],
          name: res[1][1],
          phone: res[2][1],
        })
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
      [EMAIL, this.state.email],
      [PHONE, this.state.phone],
    ])
    return accountsApi
      .createFBUser(
        this.state.name,
        this.state.username,
        this.state.email,
        this.state.photo,
        this.state.phone,
      )
      .then(() => {
        socket.connect()
        this.props.navigation.replace('Home')
      })
      .catch(() => {
        this.setState({ errorAlert: true })
      })
  }

  checkEmailValidity() {
    const reg = /^[ ]*([^@\s]+)@((?:[-a-z0-9]+\.)+[a-z]{2,})[ ]*$/i
    if (this.state.email === '' || reg.test(this.state.email) === false) {
      this.setState({ validEmailFormat: false })
    } else {
      this.setState({ validEmailFormat: true })
      accountsApi
        .checkEmail(this.state.email)
        .then(() => {
          this.setState({ validEmail: true })
        })
        .catch(() => {
          this.setState({ validEmail: false })
        })
    }
  }

  checkUsernameValidity() {
    if (this.state.username === '') {
      this.setState({ validUsername: false })
    } else {
      console.log
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

  render() {
    return (
      <View style={[screenStyles.mainContainer]}
      behavior="padding">
        <Text style={[screenStyles.textBold, screenStyles.title, styles.title]}>
          Create Account
        </Text>
        <Text style={[screenStyles.textBook, styles.mediumText]}>Account Verified!</Text>
        <Text style={[screenStyles.textBook, styles.mediumText]}>
          Finish setting up your account
        </Text>

        {this.state.photo.includes('file') ? (
          <Image
            source={{
              uri: this.state.photo,
            }}
            style={[screenStyles.avatar]}
          />
        ) : (
          <Image source={this.state.photo} style={screenStyles.avatar} />
        )}

        <Text style={[screenStyles.textBook, styles.fieldName, { marginTop: '5%' }]}>
          Display Name
        </Text>
        <TextInput
          style={[screenStyles.textBook, styles.fieldText]}
          underlineColorAndroid="transparent"
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
            { marginBottom: this.state.validUsername ? '3%' : '0%' },
          ]}
          textAlign="left"
          underlineColorAndroid="transparent"
          onChangeText={(username) => {
            this.setState({ username: username.split(' ').join('_') })
          }}
          onBlur={() => this.checkUsernameValidity()}
          value={this.state.username}
          maxLength={15}

        />

        {!this.state.validUsername && (
          <Text style={[screenStyles.text, styles.warningText]}>This username is taken</Text>
        )}

        <Text style={[screenStyles.textBook, styles.fieldName]}>Phone Number</Text>
        <TextInput
          style={[screenStyles.textBook, styles.fieldText]}
          underlineColorAndroid="transparent"
          textAlign="left"
          onChangeText={(phone) => {
            this.setState({ phone })
          }}
          value={this.state.phone}
        />

        

        <Text style={[screenStyles.textBook, styles.fieldName]}>Email</Text>
        <TextInput
          style={[
            screenStyles.textBook,
            styles.fieldText,
            { marginBottom: this.state.validEmail && this.state.validEmailFormat ? '3%' : '0%' },
          ]}
          underlineColorAndroid="transparent"
          textAlign="left"
          onChangeText={(email) => {
            this.setState({ email: email })
          }}
          onBlur={() => this.checkEmailValidity()}
          value={this.state.email}
        />

        {!this.state.validEmail && this.state.validEmailFormat && (
          <Text style={[screenStyles.text, styles.warningText]}>This email is taken</Text>
        )}
        {!this.state.validEmailFormat && (
          <Text style={[screenStyles.text, styles.warningText]}>Input a valid email</Text>
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
                this.state.phonePressed ? { color: hex } : { color: 'white' },
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

createAccount.propTypes = {
  navigation: PropTypes.object,
}
const styles = StyleSheet.create({
  title: {
    fontSize: normalize(25),
    marginTop: '10%',
    marginBottom: '5%',
  },
  button: {
    borderColor: hex,
    backgroundColor: hex,
    width: '20%',
    marginTop: '3%',
  },
  mediumText: {
    alignSelf: 'center',
    fontSize: normalize(18.5),
    color: textColor,
  },
  fieldText: {
    fontSize: normalize(18),
    color: textColor,
    marginHorizontal: '12%',
    marginBottom: '3%',
    paddingVertical: '1%',
    borderBottomColor: textColor,
    borderBottomWidth: 1,
  },
  fieldBorder: {
    marginHorizontal: '12%',
    marginBottom: '3%',
    paddingVertical: '1%',
    borderBottomColor: textColor,
    borderBottomWidth: 1,
  },
  fieldName: {
    fontSize: normalize(18.5),
    alignSelf: 'flex-start',
    color: 'black',
    marginLeft: '10%',
  },
  warningText: {
    color: hex,
    fontSize: normalize(12),
    marginHorizontal: '12%',
    alignSelf: 'flex-start',
  },
})
