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
import AntDesign from 'react-native-vector-icons/AntDesign'
import PropTypes from 'prop-types'
import Alert from '../modals/Alert.js'
import global from '../../global.js'
import modalStyles from '../../styles/modalStyles.js'
import normalize from '../../styles/normalize.js'
import screenStyles from '../../styles/screenStyles.js'

const width = Dimensions.get('window').width

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
        <View style={[modalStyles.mainContainer, styles.modal]}>
          <View style={styles.titleContainer}>
            <Text style={[screenStyles.textBold, styles.titleText]}>Settings</Text>
            <AntDesign
              name="closecircleo"
              style={[screenStyles.text, styles.closeIcon]}
              onPress={() => this.props.close()}
            />
          </View>
          <View style={styles.bodyContainer}>
            <View>
              <Text style={[screenStyles.text, styles.subTitle]}>Email</Text>
              <TextInput
                style={[screenStyles.text, screenStyles.input, styles.textInput]}
                editable={false}
                value={global.email}
              />
            </View>
          </View>
          <View style={[styles.bodyContainer, styles.bodyMargin]}>
            <Text style={[screenStyles.text, styles.subTitle]}>Phone Number</Text>
            <TextInput
              style={[screenStyles.text, screenStyles.input, styles.textInput]}
              editable={false}
              value={global.phone}
            />
          </View>
          <View style={modalStyles.justifyCenter}>
            <Text
              onPress={() => {
                this.props.close()
                this.props.deleteAlert()
              }}
              style={[screenStyles.textBold, styles.deleteText]}
            >
              Delete account...
            </Text>
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
          <View style={modalStyles.justifyCenter}>
            <TouchableHighlight
              style={[screenStyles.medButton, styles.logoutButton]}
              underlayColor="white"
              onShowUnderlay={() => this.setState({ logout: true })}
              onHideUnderlay={() => this.setState({ logout: false })}
              onPress={() => {
                this.setState({ logout: false }, () => {
                  this.props.close()
                  this.props.logoutAlert()
                })
              }}
            >
              <Text
                style={[
                  screenStyles.smallButtonText,
                  styles.logoutText,
                  this.state.logout ? screenStyles.hex : styles.white,
                ]}
              >
                Logout
              </Text>
            </TouchableHighlight>
          </View>
        </View>
      </Modal>
    )
  }
}

const styles = StyleSheet.create({
  modal: {
    height: width * 0.87,
    width: '85%',
    marginTop: '15%',
    borderRadius: 15,
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  titleText: {
    fontSize: normalize(20),
    marginLeft: '10%',
    marginTop: '10%',
    marginBottom: '5%',
    alignSelf: 'center',
  },
  closeIcon: {
    margin: '5%',
    fontSize: normalize(25),
  },
  bodyContainer: {
    justifyContent: 'space-between',
    marginHorizontal: '10%',
  },
  bodyMargin: {
    marginVertical: '5%',
  },
  subTitle: {
    color: 'black',
    fontSize: normalize(18),
  },
  textInput: {
    color: '#B2B2B2',
    fontSize: normalize(17),
    alignSelf: 'stretch',
    backgroundColor: '#F2F2F2',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 5,
    paddingHorizontal: 5,
    paddingVertical: 2,
    marginTop: '3%',
  },
  deleteText: {
    fontSize: normalize(18),
    color: 'black',
    marginRight: '35%',
  },
  logoutButton: {
    backgroundColor: screenStyles.hex.color,
    borderColor: screenStyles.hex.color,
    marginTop: '7%',
    width: '40%',
  },
  logoutText: {
    paddingTop: '5%',
    paddingBottom: '5%',
    fontSize: normalize(19),
  },
  white: {
    color: 'white',
  },
})

Settings.propTypes = {
  delete: PropTypes.func,
  logout: PropTypes.func,
  close: PropTypes.func,
  visible: PropTypes.bool,
  email: PropTypes.string,
  deleteAlert: PropTypes.func,
  logoutAlert: PropTypes.func,
}
