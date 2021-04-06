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
import { changeImage, setDisable, hideDisable } from '../redux/Actions.js'

const height = Dimensions.get('window').height

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
    }
  }

  componentDidMount() {
    this.setState({ photo: this.props.image.image })
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

  //remove whitespaces before and after name and username
  finalCheck() {
    this.props.setDisable()
    this.setState({ editPic: false })
    if (this.state.photo != this.props.image.image) {
      this.props.changeImage(this.state.photo)
    }
    if (!this.state.validNameFormat || !this.state.validUsernameFormat) {
      return
    }

    let trimmedName = this.state.nameValue
    trimmedName = trimmedName.trimStart().trimEnd()

    let trimmedUser = this.state.usernameValue

    this.setState({ nameValue: trimmedName, usernameValue: trimmedUser }, () => {
      this.props.makeChanges() //must use callback in setState or states won't update properly
    })

    this.props.nameChange(trimmedName)
    this.props.userChange(trimmedUser)
    this.props.hideDisable()
  }

  validateName() {
    /*regex expression: 
    - alphanumeric characters (lowercase or uppercase), dot (.), underscore (_), hyphen(-), space( )
    - must not start or end with space
    - 2-15 characters
    */
    const regex = /^[a-zA-Z0-9._-]([ ._-]|[a-zA-Z0-9]){0,13}[a-zA-Z0-9._-]$/
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
    this.setState({ photo: pic })
    this.setState({ editPic: false })
  }

  render() {
    return (
      <Modal animationType="fade" transparent visible={this.props.visible}>
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
          {this.state.editPic && (
            <ChoosePic
              dontSave={() => this.dontSavePic()}
              makeChanges={(pic) => this.changePic(pic)}
            />
          )}
          <TouchableHighlight
            disabled={this.props.disable}
            style={[screenStyles.medButton, styles.saveButton]}
            onPress={() => {
              this.finalCheck()
            }}
            underlayColor="white"
          >
            <Text style={[screenStyles.smallButtonText, styles.saveText]}>Save Changes</Text>
          </TouchableHighlight>
        </View>
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
      changeImage,
      setDisable,
      hideDisable
    },
    dispatch,
  )
export default connect(mapStateToProps, mapDispatchToProps)(EditProfile)

EditProfile.propTypes = {
  dontSave: PropTypes.func,
  userChange: PropTypes.func,
  nameChange: PropTypes.func,
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
    height: height * 0.5,
    marginTop: '15%',
  },
  modalContent: {
    textAlign: 'center',
    marginLeft: '10%',
    marginRight: '10%',
  },
  titleText: {
    fontSize: normalize(16.5),
  },
  pfp: {
    height: height * 0.13,
    width: height * 0.13,
    borderRadius: 60,
    alignSelf: 'center',
  },
  whiteSpace: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: '4%',
  },
  nameText: {
    marginBottom: '2%',
    color: 'black',
  },
  input: {
    color: '#7d7d7d',
    fontSize: normalize(15.5),
    borderBottomWidth: 1,
    borderColor: '#7d7d7d',
  },
  saveButton: {
    backgroundColor: screenStyles.hex.color,
    borderColor: screenStyles.hex.color,
    margin: '5%',
    width: '50%',
  },
  saveText: {
    padding: '10%',
    color: 'white',
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
  },
})
