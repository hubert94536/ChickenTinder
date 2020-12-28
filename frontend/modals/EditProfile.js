import React from 'react'
import { Dimensions, Image, Modal, Text, TextInput, TouchableHighlight, View } from 'react-native'
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
        <View
          style={[
            {
              height: Dimensions.get('window').height * 0.5,
              width: '75%',
              marginTop: '15%',
              backgroundColor: 'white',
              elevation: 20,
              alignSelf: 'center',
              borderRadius: 10,
            },
          ]}
        >
          <AntDesign
            name="closecircleo"
            style={[
              screenStyles.text,
              {
                fontSize: 18,
                flexDirection: 'row',
                alignSelf: 'flex-end',
                marginTop: '4%',
                marginRight: '4%',
              },
            ]}
            onPress={() => this.props.dontSave()}
          />
          <View style={{ textAlign: 'center', marginLeft: '10%', marginRight: '10%' }}>
            <Text style={[screenStyles.text, { fontSize: 16 }]}>Edit Profile</Text>

            {this.props.image.includes("file") || this.props.image.includes("http") ? (
              <Image
              style={{
                height: height * 0.13,
                width: height * 0.13,
                borderRadius: 60,
                alignSelf: 'center',
              }}
              source={{
                uri: this.props.image,
              }}
              
            />
            ) : (
              <Image
              source={this.props.image}
                style={{
                  height: height * 0.13,
                  width: height * 0.13,
                  borderRadius: 60,
                  alignSelf: 'center',
                }}
              />
            )}
             

            <View style={{ flexDirection: 'row', justifyContent: 'center', marginBottom: '4%' }}>
              <Text
                style={[screenStyles.text, { marginRight: '5%' }]}
                onPress={() => this.props.uploadPhoto()}
              >
                Upload
              </Text>
              <Text
                style={[screenStyles.text, { color: 'black', marginLeft: '5%' }]}
                onPress={() => this.props.removePhoto()}
              >
                Remove
              </Text>
            </View>
            <Text style={[screenStyles.text, { color: 'black', marginBottom: '2%' }]}>
              Display name
            </Text>
            <TextInput
              style={[
                screenStyles.text,
                screenStyles.input,
                {
                  color: '#7d7d7d',
                  fontSize: 15,
                  borderBottomWidth: 1,
                  marginBottom: '7%',
                  borderColor: '#7d7d7d',
                },
              ]}
              underlineColorAndroid="transparent"
              spellCheck={false}
              autoCorrect={false}
              keyboardType="visible-password"
              value={this.state.nameValue}
              onChangeText={(text) => this.changeName(text)}
              // onSubmitEditing={() => this.makeChanges()}
            />
            <Text style={[screenStyles.text, { color: 'black', marginBottom: '2%' }]}>
              Username
            </Text>
            <TextInput
              style={[
                screenStyles.text,
                screenStyles.input,
                {
                  color: '#7d7d7d',
                  fontSize: 15,
                  borderBottomWidth: 1,
                  borderColor: '#7d7d7d',
                },
              ]}
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
            style={[
              screenStyles.medButton,
              { backgroundColor: hex, borderColor: hex, margin: '7%', width: '50%' },
            ]}
            onPress={() => this.props.makeChanges()}
            underlayColor="white"
            // onShowUnderlay={() => this.setState({ changeName: true })}
            // onHideUnderlay={() => this.setState({ changeName: false })}
          >
            <Text
              style={[
                screenStyles.smallButtonText,
                { padding: '10%', color: 'white' },
                // this.state.changeName ? { color: hex } : { color: 'white' },
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
