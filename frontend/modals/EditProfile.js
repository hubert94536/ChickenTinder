import React from 'react'
import { Dimensions, Image, Modal, StyleSheet, Text, TextInput, TouchableHighlight, View } from 'react-native'
import modalStyles from '../../styles/modalStyles.js'
import screenStyles from '../../styles/screenStyles.js'
import AntDesign from 'react-native-vector-icons/AntDesign'
import PropTypes from 'prop-types'

const hex = '#F15763'
const height = Dimensions.get('window').height

export default class EditProfile extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      nameValue: this.props.name,
      usernameValue: this.props.username,
      changeName: false,
    }
  }

  changeUser(text) {
    this.setState({ usernameValue: text })
    this.props.userChange(text)
  }

  changeName(text) {
    this.setState({ nameValue: text })
    this.props.nameChange(text)
  }

  render() {
    return (
      <Modal animationType="fade" transparent visible={this.props.visible}>
        <View style= {[modalStyles.mainContainer, styles.mainContainerHeight]}>
          <AntDesign
            name="closecircleo"
            style={[
              screenStyles.text, modalStyles.closeIcon]}
            onPress={() => this.props.dontSave()}
          />
          <View style={styles.modalContent}>
            <Text style={[screenStyles.text, styles.titleText]}>Edit Profile</Text>

            {this.props.image == null && (
              <Image
                source={this.props.defImg}
                style={styles.pfp}
              />
            )}

            {this.props.image != null && (
              <Image
                source={{
                  uri: this.props.image,
                }}
                style={styles.pfp}
              />
            )}

            <View style={styles.pfpActions}>
              <Text
                style={[screenStyles.text, styles.uploadText]}
                onPress={() => this.props.uploadPhoto()}
              >
                Upload
              </Text>
              <Text
                style={[screenStyles.text, screenStyles.black]}
                onPress={() => this.props.removePhoto()}
              >
                Remove
              </Text>
            </View>
            <Text style={[screenStyles.text, screenStyles.black, styles.nameText]}>
              Display name
            </Text>
            <TextInput
              style={[screenStyles.text, screenStyles.input, styles.input]}
              underlineColorAndroid="transparent"
              spellCheck={false}
              autoCorrect={false}
              keyboardType="visible-password"
              value={this.state.nameValue}
              onChangeText={(text) => this.changeName(text)}
              // onSubmitEditing={() => this.makeChanges()}
            />
            <Text style={[screenStyles.text, screenStyles.black, styles.nameText]}>
              Username
            </Text>
            <TextInput
              style={[screenStyles.text, screenStyles.input, styles.input]}
              underlineColorAndroid="transparent"
              spellCheck={false}
              autoCorrect={false}
              keyboardType="visible-password"
              value={this.state.usernameValue}
              onChangeText={(text) => this.changeUser(text)}
              // onSubmitEditing={() => this.makeChanges()}
            />
          </View>
          <TouchableHighlight
            style={[screenStyles.medButton, styles.saveButton]}
            onPress={() => this.props.makeChanges()}
            underlayColor="white"
            // onShowUnderlay={() => this.setState({ changeName: true })}
            // onHideUnderlay={() => this.setState({ changeName: false })}
          >
            <Text
              style={[
                screenStyles.smallButtonText, styles.saveText
                //this.state.changeName ? { color: hex } : { color: 'white' },
              ]}
            >
              Save Changes
            </Text>
          </TouchableHighlight>
        </View>
      </Modal>
    )
  }
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
    fontSize: 16,
  },
  pfp: {
    height: height * 0.13,
    width: height * 0.13,
    borderRadius: 60,
    alignSelf: 'center',
  },
  pfpActions: {
    flexDirection: 'row', 
    justifyContent: 'center', 
    marginBottom: '4%',
  },
  uploadText: {
    marginRight: '10%',
  },
  nameText: {
    marginBottom: '2%',
  },
  input: {
    color: '#7d7d7d',
    fontSize: 15,
    borderBottomWidth: 1,
    marginBottom: '7%',
    borderColor: '#7d7d7d',
  },
  saveButton: {
    backgroundColor: hex, 
    borderColor: hex, 
    margin: '1.5%', 
    width: '50%',
  },
  saveText:{
    padding: '10%', 
    color: 'white',
  }
})

EditProfile.propTypes = {
  name: PropTypes.string,
  username: PropTypes.string,
  image: PropTypes.string,
  defImg: PropTypes.string,
  userChange: PropTypes.func,
  nameChange: PropTypes.func,
  dontSave: PropTypes.func,
  uploadPhoto: PropTypes.func,
  removePhoto: PropTypes.func,
  makeChanges: PropTypes.func,
  visible: PropTypes.bool,
}
