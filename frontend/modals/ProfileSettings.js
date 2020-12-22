import React from 'react'
import {
  Dimensions,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableHighlight,
  View,
} from 'react-native'
import { BlurView } from '@react-native-community/blur'
import Alert from '../modals/Alert.js'
import screenStyles from '../../styles/screenStyles.js'
import AntDesign from 'react-native-vector-icons/AntDesign'
import PropTypes from 'prop-types'

const hex = '#F15763'
const font = 'CircularStd-Medium'
const height = Dimensions.get('window').height

export default class Settings extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      deleteAlert: false,
      errorAlert: false,
      logoutAlert: false,
      logout: false,
    }
  }

  closeError() {
    this.setState({ errorAlert: false })
  }

  handleDelete() {
    this.setState({ deleteAlert: false })
    this.props.delete()
  }

  handleLogout() {
    this.setState({ logoutAlert: false })
    this.props.logout()
  }

  // cancel deleting your account
  cancelDelete() {
    this.setState({ deleteAlert: false })
  }

  render() {
    return (
      <Modal animationType="fade" visible={this.props.visible} transparent>
        <View style={styles.modal}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}
          >
            <Text
              style={[
                screenStyles.textBold,
                {
                  fontSize: 20,
                  marginLeft: '10%',
                  marginTop: '10%',
                  marginBottom: '5%',
                  alignSelf: 'center',
                },
              ]}
            >
              Settings
            </Text>
            <AntDesign
              name="closecircleo"
              style={[screenStyles.text, { margin: '5%', fontSize: 25 }]}
              onPress={() => this.props.close()}
            />
          </View>
          <View
            style={{
              justifyContent: 'space-between',
              marginHorizontal: '10%',
            }}
          >
            <View>
              <Text style={[{ fontFamily: font, fontSize: 18 }]}>Email</Text>
              <TextInput
                style={[
                  screenStyles.text,
                  screenStyles.input,
                  {
                    color: '#B2B2B2',
                    fontSize: 17,
                    alignSelf: 'stretch',
                    backgroundColor: '#F2F2F2',
                    borderWidth: 1,
                    borderColor: '#E0E0E0',
                    borderRadius: 5,
                    paddingHorizontal: 5,
                    paddingVertical: 2,
                    marginTop: '3%',
                  },
                ]}
                editable={false}
                value={this.props.email}
              />
            </View>
          </View>
          <View
            style={{
              justifyContent: 'space-between',
              marginVertical: '5%',
              marginHorizontal: '10%',
            }}
          >
            <Text style={{ fontFamily: font, fontSize: 18 }}>Phone Number</Text>
            <TextInput
              style={[
                screenStyles.text,
                screenStyles.input,
                {
                  color: '#B2B2B2',
                  fontSize: 15,
                  alignSelf: 'stretch',
                  backgroundColor: '#F2F2F2',
                  borderWidth: 1,
                  borderColor: '#E0E0E0',
                  borderRadius: 5,
                  paddingHorizontal: 5,
                  paddingVertical: 2,
                  marginTop: '3%',
                },
              ]}
              editable={false}
              value={'+0 (770) 090-0461'}
            />
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
            }}
          >
            <Text
              onPress={() => this.setState({ deleteAlert: true })}
              style={[screenStyles.textBold, { fontSize: 18, color: 'black', marginRight: '35%' }]}
            >
              Delete account...
            </Text>
            {this.state.deleteAlert && (
              <View>
                <BlurView
                  blurType="dark"
                  blurAmount={10}
                  reducedTransparencyFallbackColor="black"
                />
                ,
                <Alert
                  title="Delete account?"
                  body="By deleting your account, you will lose all of your data"
                  buttonAff="Delete"
                  buttonNeg="Go back"
                  twoButton
                  height="27%"
                  press={() => this.handleDelete()}
                  cancel={() => this.cancelDelete()}
                />
                ,
              </View>
            )}
            {this.state.errorAlert && (
              <Alert
                title="Error, please try again"
                button
                buttonText="Close"
                press={() => this.closeError()}
                cancel={() => this.closeError()}
              />
            )}
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
            }}
          >
            <TouchableHighlight
              style={[
                screenStyles.medButton,
                {
                  backgroundColor: hex,
                  borderColor: hex,
                  marginTop: '7%',
                  width: '40%',
                },
              ]}
              underlayColor="white"
              onShowUnderlay={() => this.setState({ logout: true })}
              onHideUnderlay={() => this.setState({ logout: false })}
              onPress={() => this.setState({ logoutAlert: true })}
            >
              <Text
                style={[
                  screenStyles.smallButtonText,
                  { paddingTop: '5%', paddingBottom: '5%', fontSize: 19 },
                  this.state.logout ? { color: hex } : { color: 'white' },
                ]}
              >
                Logout
              </Text>
            </TouchableHighlight>
            {this.state.logoutAlert && (
              <Alert
                title="Log out"
                body="Are you sure you want to log out?"
                buttonAff="Logout"
                buttonNeg="Go back"
                height="25%"
                twoButton
                press={() => this.handleLogout()}
                cancel={() => this.setState({ logoutAlert: false })}
              />
            )}
          </View>
        </View>
      </Modal>
    )
  }
}

Settings.propTypes = {
  delete: PropTypes.func,
  logout: PropTypes.func,
  close: PropTypes.func,
  visible: PropTypes.bool,
  email: PropTypes.string,
}

const styles = StyleSheet.create({
  modal: {
    height: height * 0.45,
    width: '85%',
    marginTop: '15%',
    backgroundColor: 'white',
    alignSelf: 'center',
    borderRadius: 15,
    elevation: 20,
  },
})
