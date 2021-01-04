import React from 'react'
<<<<<<< HEAD
import AsyncStorage from '@react-native-community/async-storage'
import { EMAIL, NAME, PHOTO, USERNAME, PHONE, DEFPHOTO } from 'react-native-dotenv'
=======
import AsyncStorage from '@react-native-async-storage/async-storage'
import { EMAIL, NAME, PHOTO, USERNAME, ID, PHONE, DEFPHOTO } from 'react-native-dotenv'
>>>>>>> master
import { Image, StyleSheet, Text, TextInput, TouchableHighlight, View } from 'react-native'
import accountsApi from '../apis/accountsApi.js'
import normalize from '../../styles/normalize.js'
import screenStyles from '../../styles/screenStyles.js'
import PropTypes from 'prop-types'
import ImagePicker from 'react-native-image-crop-picker'
import defImages from '../assets/images/defImages.js'

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
      photo: '',
      defImg: '',
      defImgInd: 0,
      validEmail: false,
      validEmailFormat: false,
      validUsername: false,
    }
  }

  componentDidMount() {
    var index = Math.floor(Math.random() * defImages.length)
    AsyncStorage.multiGet([EMAIL, ID, NAME, PHONE]).then((res) => {
      this.setState(
        {
          email: res[0][1],
          id: res[1][1],
          name: res[2][1],
          phone: res[3][1],
          photo: defImages[index].toString(),
        },
        () => {
          this.checkEmailValidity(this.state.email)
          this.checkUsernameValidity(this.state.username)
          // accountsApi.deleteUser(this.state.id)
        },
      )
    })
    AsyncStorage.setItem(DEFPHOTO, this.state.defImgInd.toString())
  }

  //  checks whether or not the username can be set
  handleClick() {
    accountsApi
      .checkUsername(this.state.username)
      .then(() => {
        AsyncStorage.multiSet([
          [USERNAME, this.state.username],
          [PHOTO, this.state.photo],
          [NAME, this.state.name],
          [EMAIL, this.state.email],
          [PHONE, this.state.phone],
          [DEFPHOTO, this.state.defImgInd.toString()],
        ])
        return accountsApi.createFBUser(
          this.state.name,
          this.state.username,
          this.state.email,
          this.state.photo,
          this.state.phone
        )
      })
      .then(() => {
        AsyncStorage.setItem(PHOTO, this.state.photo)
        this.props.navigation.replace('Home')
      })
      .catch((error) => {
        if (error === 404) {
          this.setState({ takenAlert: true })
        } else {
          this.setState({ errorAlert: true })
        }
      })
  }

  altHandleClick() {
    this.props.navigation.replace('Home')
  }

  // TODO: Change from photo picker from phone gallery to our default photos
  uploadPhoto() {
    ImagePicker.openPicker({
      width: 150,
      height: 150,
      cropping: true,
    })
      .then((image) => {
        this.setState({
          photo: image.path,
          photoData: {
            uri: image.path,
            type: image.mime,
            name: 'avatar',
          },
        })
      })
      .catch((error) => {
        // handle this later on
        console.log(error)
      })
  }

  checkEmailValidity(email) {
    const reg = /^[ ]*([^@\s]+)@((?:[-a-z0-9]+\.)+[a-z]{2,})[ ]*$/i
    if (email !== null && reg.test(email) === false) {
      this.setState({ validEmailFormat: false })
    } else {
      this.setState({ validEmailFormat: true })
    }

    accountsApi
      .checkEmail(email)
      .then(() => {
        this.setState({ validEmail: true })
      })
      .catch((error) => {
        this.setState({ validEmail: false })
      })
  }

  checkUsernameValidity(username) {
    accountsApi
      .checkUsername(username)
      .then(() => {
        this.setState({ validUsername: true })
      })
      .catch((error) => {
        this.setState({ validUsername: false })
      })
  }

  render() {
    return (
      <View style={[screenStyles.mainContainer]}>
        <Text
          style={[screenStyles.textBold, screenStyles.title, styles.title]}
        >
          Create Account
        </Text>
        <Text style={[screenStyles.textBook, styles.mediumText]}>Account Verified!</Text>
        <Text style={[screenStyles.textBook, styles.mediumText]}>Finish setting up your account</Text>

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

        <Text style={[screenStyles.textBook, styles.fieldName , {marginTop: '5%'}]}>Display Name</Text>
        <TextInput
          style={[screenStyles.textBook, styles.fieldText]}
          textAlign="left"
          onChangeText={(name) => {
            this.setState({ name })
          }}
          value={this.state.name}
        />

<Text style={[screenStyles.textBook, styles.fieldName]}>Username</Text>
        <TextInput
          style={[screenStyles.textBook, styles.fieldText, { marginBottom: this.state.validUsername ? '3%' : '0%' }]}
          textAlign="left"
          onChangeText={(username) => {
            this.setState({ username })
            this.checkUsernameValidity(username)
          }}
          value={this.state.username}
          maxLength={15}
        />

        {!this.state.validUsername && (
          <Text style={[screenStyles.text, styles.warningText]}>This username is taken</Text>
        )}

        <Text style={[screenStyles.textBook, styles.fieldName]}>Phone Number</Text>
        <TextInput
          style={[screenStyles.textBook, styles.fieldText]}
          textAlign="left"
          onChangeText={(phone) => {
            this.setState({ phone })
          }}
          value={this.state.phone}
        />

        <Text style={[screenStyles.textBook, styles.fieldName]}>Email</Text>
        <TextInput
          style={[
            screenStyles.textBook, styles.fieldText,
            { marginBottom: this.state.validEmail && this.state.validEmailFormat ? '3%' : '0%' },
          ]}
          textAlign="left"
          onChangeText={(email) => {
            this.setState({ email: email })
            this.checkEmailValidity(email)
          }}
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
  title:
  {
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
