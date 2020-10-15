import React from 'react'
import { StyleSheet, Text, TextInput, TouchableHighlight, View } from 'react-native'
import AsyncStorage from '@react-native-community/async-storage'
import Alert from './alert.js'
import accountsApi from './accountsApi.js'
import { NAME, USERNAME, ID, UID, EMAIL, PHOTO } from 'react-native-dotenv'

const hex = '#F25763'
const font = 'CircularStd-Medium'

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

  // adjusting the look of button
  underlayShow() {
    this.setState({ pressed: true })
  }

  // adjusting the look of button
  underlayHide() {
    this.setState({ pressed: false })
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
            this.props.navigation.navigate('Home')
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
        <Text style={styles.header}>'Chews' a username!</Text>
        <View style={{ marginTop: '35%' }}>
          <TextInput
            style={styles.input}
            textAlign="left"
            placeholder="Enter a username"
            onChangeText={(username) => {
              this.setState({ username })
            }}
            value={this.state.username}
          />
          <TouchableHighlight
            onShowUnderlay={this.underlayShow.bind(this)}
            onHideUnderlay={this.underlayHide.bind(this)}
            activeOpacity={1}
            underlayColor={hex}
            onPress={() => this.handleClick()}
            style={styles.button}
          >
            <Text style={this.state.pressed ? styles.yesPress : styles.noPress}>Enter</Text>
          </TouchableHighlight>
        </View>
        {this.state.errorAlert && (
          <Alert
            title="Error, please try again"
            button
            buttonText="Close"
            press={() => this.closeError()}
            cancel={() => this.closeError()}
          />
        )}
        {this.state.takenAlert && (
          <Alert
            title="Username taken!"
            button
            buttonText="Close"
            press={() => this.closeTaken()}
            cancel={() => this.closeTaken()}
          />
        )}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'white',
  },
  header: {
    fontFamily: font,
    color: hex,
    fontSize: 40,
    marginTop: '8%',
    marginLeft: '3%',
    textAlign: 'left',
  },
  input: {
    fontFamily: font,
    color: hex,
    fontSize: 25,
    alignSelf: 'center',
    borderBottomColor: hex,
    borderBottomWidth: 2.5,
    margin: '3%',
    width: '70%',
  },
  button: {
    fontFamily: font,
    borderRadius: 25,
    borderWidth: 2.5,
    borderColor: hex,
    paddingVertical: 10,
    paddingHorizontal: 12,
    width: '70%',
    alignSelf: 'center',
  },
  yesPress: {
    fontFamily: font,
    alignSelf: 'center',
    color: '#fff',
    fontSize: 20,
  },
  noPress: {
    fontFamily: font,
    alignSelf: 'center',
    color: hex,
    fontSize: 20,
  },
})

export default Username
