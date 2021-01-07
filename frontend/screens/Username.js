import React from 'react'
import { StyleSheet, Text, TextInput, TouchableHighlight, View } from 'react-native'
import { NAME, USERNAME, ID, UID, EMAIL, PHOTO } from 'react-native-dotenv'
import AsyncStorage from '@react-native-async-storage/async-storage'
import Alert from '../modals/Alert.js'
import accountsApi from '../apis/accountsApi.js'
import colors from '../../styles/colors.js'
import screenStyles from '../../styles/screenStyles.js'
import PropTypes from 'prop-types'

class Username extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      username: null,
      name: '',
      uid: '',
      id: '',
      email: '',
      photo: '',
      // showing alerts
      errorAlert: false,
      takenAlert: false,
    }
  }

  // closes taken alert
  closeTaken() {
    this.setState({ takenAlert: false })
  }

  // closes error alert
  closeError() {
    this.setState({ errorAlert: false })
  }

  // gets users information once component mounts
  async componentDidMount() {
    this.setState({
      name: await AsyncStorage.getItem(NAME),
      uid: await AsyncStorage.getItem(UID),
      id: await AsyncStorage.getItem(ID),
      email: await AsyncStorage.getItem(EMAIL),
      photo: await AsyncStorage.getItem(PHOTO),
    })
  }

  //  checks whether or not the username can be set
  handleClick() {
    accountsApi
      .checkUsername(this.state.username)
      .then(() => {
        AsyncStorage.setItem(USERNAME, this.state.username)
        return accountsApi
          .createFBUser(
            this.state.name,
            this.state.id,
            this.state.username,
            this.state.email,
            this.state.photo,
          )
          .then(() => {
            this.props.navigation.popToTop()
          })
      })
      .catch((error) => {
        if (error === 404) {
          this.setState({ takenAlert: true })
        } else {
          this.setState({ errorAlert: true })
        }
      })
  }

  render() {
    return (
      <View style={styles.mainContainer}>
        <Text style={[screenStyles.text, screenStyles.title, styles.header]}>
          &aposChews&apos a username!
        </Text>
        <View style={{ marginTop: '35%' }}>
          <TextInput
            style={[screenStyles.text, styles.input]}
            textAlign="left"
            placeholder="Enter a username"
            onChangeText={(username) => {
              this.setState({ username })
            }}
            value={this.state.username}
          />
          <TouchableHighlight
            onShowUnderlay={() => this.setState({ pressed: true })}
            onHideUnderlay={() => this.setState({ pressed: false })}
            activeOpacity={1}
            underlayColor={colors.hex}
            onPress={() => this.handleClick()}
            style={[
              screenStyles.medButton,
              styles.button,
              this.state.pressed ? { borderColor: 'white' } : { borderColor: colors.hex },
            ]}
          >
            <Text
              style={[
                screenStyles.medButtonText,
                this.state.pressed ? { color: 'white' } : { color: colors.hex },
              ]}
            >
              Enter
            </Text>
          </TouchableHighlight>
        </View>
        {this.state.errorAlert && (
          <Alert
            title="Error, please try again"
            buttonAff="Close"
            height="20%"
            press={() => this.setState({ errorAlert: false })}
            cancel={() => this.setState({ errorAlert: false })}
          />
        )}
        {this.state.takenAlert && (
          <Alert
            title="Username taken!"
            buttonAff="Close"
            height="20%"
            press={() => this.closeTaken()}
            cancel={() => this.closeTaken()}
          />
        )}
      </View>
    )
  }
}

Username.propTypes = {
  navigation: PropTypes.object,
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'white',
  },
  header: {
    marginTop: '8%',
    marginLeft: '3%',
  },
  input: {
    fontSize: 25,
    alignSelf: 'center',
    borderBottomColor: colors.hex,
    borderBottomWidth: 2.5,
    margin: '3%',
    width: '70%',
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    width: '70%',
    borderColor: colors.hex,
  },
})

export default Username
