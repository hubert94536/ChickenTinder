import React from 'react'
import {
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  TextInput,
  TouchableHighlight,
  View,
} from 'react-native'
import { EMAIL, NAME, PHOTO, USERNAME, PHONE, REGISTRATION_TOKEN, UID } from 'react-native-dotenv'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import AsyncStorage from '@react-native-async-storage/async-storage'
import PropTypes from 'prop-types'
import accountsApi from '../apis/accountsApi.js'
import { changeImage, changeName, changeUsername, changeFriends } from '../redux/Actions.js'
import colors from '../../styles/colors.js'
import { foodImages } from '../assets/images/defImages.js'
import global from '../../global.js'
import notificationsApi from '../apis/notificationsApi.js'
import normalize from '../../styles/normalize.js'
import screenStyles from '../../styles/screenStyles.js'
import socket from '../apis/socket.js'
import ChoosePic from '../modals/ChoosePic.js'

class createAccount extends React.Component {
  constructor() {
    super()
    this.state = {
      pressed: false,
      alert: false,
      errorAlert: false,
      name: '',
      username: '',
      photo: foodImages[
        Object.keys(foodImages)[Math.floor(Math.random() * Object.keys(foodImages).length)]
      ].img.toString(),
      validNameFormat: true,
      validUsername: true,
      validUsernameFormat: true,
      disabled: false,
      edit: false,
    }
  }

  //  checks whether or not the username can be set
  handleClick = async () => {
    this.setState({ disabled: true })
    try {
      if (!this.state.validUsernameFormat || !this.state.validNameFormat) {
        this.setState({ disabled: false })
        return
      }
      await this.checkUsernameValidity()
      if (!this.state.validUsername) {
        this.setState({ disabled: false })
        return
      }
      await accountsApi.createUser(
        this.state.name,
        this.state.username,
        global.email,
        global.phone,
        this.state.photo,
      )
      let token = await AsyncStorage.getItem(REGISTRATION_TOKEN)
      await notificationsApi.linkToken(token)
      this.props.changeUsername(this.state.username)
      this.props.changeName(this.state.name)
      this.props.changeImage(this.state.photo)
      this.props.changeFriends([])
      await AsyncStorage.multiSet([
        [USERNAME, this.state.username],
        [PHOTO, this.state.photo],
        [NAME, this.state.name],
        [UID, global.uid],
      ])
      if (global.phone) {
        await AsyncStorage.setItem(PHONE, global.phone)
      } else {
        await AsyncStorage.setItem(EMAIL, global.email)
      }
      socket.connect()
      this.props.navigation.replace('Home')
    } catch (err) {
      this.setState({ errorAlert: true, disabled: false })
      return
    }
  }

  async checkUsernameValidity() {
    if (this.state.username === '') {
      this.setState({ validUsernameFormat: false })
    } else {
      try {
        await accountsApi.checkUsername(this.state.username)
        this.setState({ validUsername: true })
      } catch (err) {
        this.setState({ validUsername: false })
      }
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

  editPic() {
    this.setState({ edit: true })
  }

  dontSave() {
    this.setState({ edit: false })
  }

  makeChanges(pic) {
    this.props.changeImage(pic)
    this.setState({ photo: pic })
    this.setState({ edit: false })
  }

  render() {
    return (
      <ImageBackground
        source={require('../assets/backgrounds/CreateAccount.png')}
        style={screenStyles.screenBackground}
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
        <TouchableHighlight style={styles.select} underlayColor="transparent" onPress = {() => this.setState({ edit: true })}>
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
        {global.phone != '' && global.phone && (
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
              {global.phone}
            </Text>
          </View>
        )}
        {global.email != '' && global.email && (
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
              {global.email}
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
          disabled={this.state.disabled}
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

        {this.state.edit && (
              <ChoosePic
                dontSave={() => this.dontSave()}
                makeChanges={(pic) => this.makeChanges(pic)}
              />
          )}
      </ImageBackground>
    )
  }
}

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      changeName,
      changeUsername,
      changeImage,
      changeFriends,
    },
    dispatch,
  )

export default connect(null, mapDispatchToProps)(createAccount)

createAccount.propTypes = {
  navigation: PropTypes.object,
  changeName: PropTypes.func,
  changeUsername: PropTypes.func,
  changeImage: PropTypes.func,
  changeFriends: PropTypes.func,
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
