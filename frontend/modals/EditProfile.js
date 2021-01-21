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
import global from '../../global.js'
import modalStyles from '../../styles/modalStyles.js'
import normalize from '../../styles/normalize.js'
import screenStyles from '../../styles/screenStyles.js'
import AntDesign from 'react-native-vector-icons/AntDesign'
import PropTypes from 'prop-types'

const height = Dimensions.get('window').height

export default class EditProfile extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      nameValue: global.name,
      usernameValue: global.username,
      changeName: false,
    }
  }

  changeUser(text) {
    let trimmedText = text
    while(trimmedText.endsWith('_')) {
      trimmedText = trimmedText.slice(0,-1)
    }
    this.setState({ usernameValue: trimmedText })
    this.props.userChange(trimmedText)
  }

  // changeUser(text) {
  //   this.setState({ usernameValue: text })
  //   this.props.userChange(text)
  // }

  changeName(text) {
    this.setState({ nameValue: text })
    this.props.nameChange(text)
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

            {global.photo.includes('file') || global.photo.includes('http') ? (
              <Image
                style={styles.pfp}
                source={{
                  uri: global.photo,
                }}
              />
            ) : (
              <Image source={global.photo} style={styles.pfp} />
            )}
            <View
              style={{ flexDirection: 'row', justifyContent: 'center', marginBottom: '4%' }}
            ></View>
            <Text style={[screenStyles.text, styles.nameText]}>Display name</Text>
            <TextInput
              style={[screenStyles.text, screenStyles.input, styles.input]}
              underlineColorAndroid="transparent"
              spellCheck={false}
              autoCorrect={false}
              keyboardType="visible-password"
              maxLength={15}
              value={this.state.nameValue}
              onChangeText={(text) => this.changeName(text.trimEnd())}
            />
            <Text style={[screenStyles.text, styles.nameText]}>Username</Text>
            <TextInput
              style={[screenStyles.text, screenStyles.input, styles.input]}
              underlineColorAndroid="transparent"
              spellCheck={false}
              autoCorrect={false}
              maxLength={15}
              keyboardType="visible-password"
              value={this.state.usernameValue}
              onChangeText={(text) => this.changeUser(text.split(' ').join('_'))}
            />
          </View>
          <TouchableHighlight
            style={[screenStyles.medButton, styles.saveButton]}
            onPress={() => this.props.makeChanges()}
            underlayColor="white"
          >
            <Text style={[screenStyles.smallButtonText, styles.saveText]}>Save Changes</Text>
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
    fontSize: normalize(16.5),
  },
  pfp: {
    height: height * 0.13,
    width: height * 0.13,
    borderRadius: 60,
    alignSelf: 'center',
  },
  nameText: {
    marginBottom: '2%',
    color: 'black',
  },
  input: {
    color: '#7d7d7d',
    fontSize: normalize(15.5),
    borderBottomWidth: 1,
    marginBottom: '7%',
    borderColor: '#7d7d7d',
  },
  saveButton: {
    backgroundColor: screenStyles.hex.color,
    borderColor: screenStyles.hex.color,
    margin: '1.5%',
    width: '50%',
  },
  saveText: {
    padding: '10%',
    color: 'white',
  },
})

EditProfile.propTypes = {
  dontSave: PropTypes.func,
  userChange: PropTypes.func,
  nameChange: PropTypes.func,
  makeChanges: PropTypes.func,
  visible: PropTypes.bool,
}
