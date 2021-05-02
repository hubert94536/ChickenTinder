import React from 'react'
import {
  Dimensions,
  Image,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableHighlight,
  View,
} from 'react-native'
import colors from '../../styles/colors.js'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import modalStyles from '../../styles/modalStyles.js'
import normalize from '../../styles/normalize.js'
import screenStyles from '../../styles/screenStyles.js'
import AntDesign from 'react-native-vector-icons/AntDesign'
import PropTypes from 'prop-types'
import ChoosePic from '../modals/ChoosePic.js'
import { setDisable, hideDisable } from '../redux/Actions.js'

const width = Dimensions.get('window').width
class EditProfile extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      nameValue: this.props.name.name,
      usernameValue: this.props.username.username,
      validNameFormat: true,
      validUsernameFormat: true,
      editPic: false,
      photo: this.props.image.image,
      save: false
    }
  }

  changeUser(text) {
    this.setState({ usernameValue: text }, () => {
      this.validateUsername()
    })
    this.props.userChange(text)
  }

  changeName(text) {
    this.setState({ nameValue: text }, () => {
      this.validateName()
    })
    this.props.nameChange(text)
  }

  finalCheck() {
    this.props.setDisable()
    this.setState({ editPic: false })
    if (!this.state.validNameFormat || !this.state.validUsernameFormat) {
      this.props.hideDisable()
      return
    }
 
    //remove whitespaces before and after name and username
    let trimmedName = this.state.nameValue
    trimmedName = trimmedName.trimStart().trimEnd()

    let trimmedUser = this.state.usernameValue

    this.setState({ nameValue: trimmedName, usernameValue: trimmedUser }, () => {
      this.props.makeChanges()
    })

    this.props.nameChange(trimmedName)
    this.props.userChange(trimmedUser)
    this.props.photoChange(this.state.photo)
    this.props.hideDisable()
  }

  validateName() {
    /*regex expression: 
    - alphanumeric characters (lowercase or uppercase), dot (.), underscore (_), hyphen(-), space( )
    - 2-15 characters
    */
    const regex = /^[ a-zA-Z0-9._-]([ ._-]|[a-zA-Z0-9]){0,13}[ a-zA-Z0-9._-]$/
    if (!regex.test(this.state.nameValue)) {
      this.setState({ validNameFormat: false })
    } else {
      this.setState({ validNameFormat: true })
    }
  }

  validateUsername() {
    /*regex expression: 
    - alphanumeric characters (lowercase or uppercase), dot (.), underscore (_), hyphen(-)
    - must not start or end with space
    - 2-15 characters
    */
    const regex = /^[a-zA-Z0-9._-]([._-]|[a-zA-Z0-9]){0,13}[a-zA-Z0-9._-]$/
    if (!regex.test(this.state.usernameValue)) {
      this.setState({ validUsernameFormat: false })
    } else {
      this.setState({ validUsernameFormat: true })
    }
  }

  editPic() {
    this.setState({ editPic: true })
  }

  dontSavePic() {
    this.setState({ editPic: false })
  }

  changePic(pic) {
    this.setState({ photo: pic, editPic: false })
  }

  render() {
    return (
      <Modal animationType="fade" transparent visible={this.props.visible}>
        {!this.state.editPic && (
          <View style={[modalStyles.mainContainer, styles.mainContainerHeight]}>
            <AntDesign
              name="closecircleo"
              style={[screenStyles.text, modalStyles.closeIcon]}
              onPress={() => this.props.dontSave()}
            />
            <View style={styles.modalContent}>
              <Text style={[screenStyles.text, styles.titleText]}>Edit Profile</Text>
              <Image
                source={{ uri: Image.resolveAssetSource(this.state.photo).uri }}
                style={styles.pfp}
              />
              <TouchableHighlight
                style={styles.select}
                underlayColor="transparent"
                onPress={() => this.setState({ editPic: true })}
              >
                <Text style={[styles.selectText, screenStyles.textBold]}>Change Profile Icon</Text>
              </TouchableHighlight>
              <View style={styles.whiteSpace} />
              <Text style={[screenStyles.text, styles.nameText]}>Display name</Text>
              <TextInput
                style={[
                  screenStyles.text,
                  screenStyles.input,
                  styles.input,
                  this.state.validNameFormat ? styles.inputMargin : styles.inputMarginWarning,
                ]}
                underlineColorAndroid="transparent"
                spellCheck={false}
                autoCorrect={false}
                keyboardType="visible-password"
                maxLength={15}
                value={this.state.nameValue}
                onChangeText={(text) => this.changeName(text)}
              />
              {!this.state.validNameFormat && (
                <Text style={[screenStyles.text, styles.warningText]}>
                  Only letters, numbers, or . - _ are allowed.
                </Text>
              )}
              <Text style={[screenStyles.text, styles.nameText]}>Username</Text>
              <TextInput
                style={[
                  screenStyles.text,
                  screenStyles.input,
                  styles.input,
                  this.state.validUsernameFormat ? styles.inputMargin : styles.inputMarginWarning,
                ]}
                underlineColorAndroid="transparent"
                spellCheck={false}
                autoCorrect={false}
                maxLength={15}
                keyboardType="visible-password"
                value={this.state.usernameValue}
                onChangeText={(text) => this.changeUser(text.split(' ').join('_'))}
              />

              {!this.state.validUsernameFormat && (
                <Text style={[screenStyles.text, styles.warningText]}>
                  Only letters, numbers, or . - _ are allowed.
                </Text>
              )}
            </View>
            <TouchableHighlight
              disabled={this.props.disable}
              style={[screenStyles.medButton, styles.saveButton]}
              onPress={() => {
                this.finalCheck()
              }}
              underlayColor="white"
              onShowUnderlay={() => this.setState({ save: true })}
              onHideUnderlay={() => this.setState({ save: false })}
            >
              <Text style={[screenStyles.smallButtonText, styles.saveText, this.state.save ? screenStyles.hex : styles.white]}>Save Changes</Text>
            </TouchableHighlight>
          </View>
        )}
        {this.state.editPic && (
          <ChoosePic
            photo={this.state.photo}
            dontSave={() => this.dontSavePic()}
            makeChanges={(pic) => this.changePic(pic)}
          />
        )}
      </Modal>
    )
  }
}

const mapStateToProps = (state) => {
  const { error } = state
  const { name } = state
  const { username } = state
  const { image } = state
  const { disable } = state
  return { error, name, username, image, disable }
}

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      setDisable,
      hideDisable,
    },
    dispatch,
  )
export default connect(mapStateToProps, mapDispatchToProps)(EditProfile)

EditProfile.propTypes = {
  dontSave: PropTypes.func,
  userChange: PropTypes.func,
  nameChange: PropTypes.func,
  photoChange: PropTypes.func,
  makeChanges: PropTypes.func,
  visible: PropTypes.bool,
  error: PropTypes.bool,
  name: PropTypes.object,
  username: PropTypes.object,
  image: PropTypes.object,
  setDisable: PropTypes.func,
  changeImage: PropTypes.func,
  hideDisable: PropTypes.func,
  disable: PropTypes.bool,
}

const styles = StyleSheet.create({
  mainContainerHeight: {
    height: width * 1.05,
    marginTop: '30%',
  },
  modalContent: {
    textAlign: 'center',
    marginLeft: '10%',
    marginRight: '10%',
  },
  titleText: {
    fontSize: normalize(18),
    marginBottom: '2%'
  },
  pfp: {
    height: width * 0.28,
    width: width * 0.28,
    borderRadius: 60,
    alignSelf: 'center',
  },
  whiteSpace: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: '2%',
  },
  nameText: {
    marginBottom: '3%',
    color: 'black',
    fontSize: normalize(17)
  },
  input: {
    color: '#7d7d7d',
    fontSize: normalize(17),
    borderBottomWidth: 1,
    borderColor: '#7d7d7d',
  },
  saveButton: {
    backgroundColor: screenStyles.hex.color,
    borderColor: screenStyles.hex.color,
    width: '55%',
  },
  saveText: {
    paddingTop: '3%',
    paddingBottom: '3%',
    marginTop: '1%',
    fontSize: normalize(19),
    color: 'white'
  },
  warningText: {
    color: colors.hex,
    fontSize: normalize(12),
  },
  inputMargin: {
    marginBottom: '7%',
  },
  inputMarginWarning: {
    marginBottom: '1%',
  },
  select: {
    alignItems: 'center',
    marginTop: '2%',
  },
  selectText: {
    color: colors.hex,
    marginTop: '3%',
    fontSize: normalize(16)
  },
})
