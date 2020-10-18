import React from 'react'
import { StyleSheet, Text, TouchableHighlight, View } from 'react-native'
import Alert from './alert.js'
import facebookService from './facebookService.js'

const hex = '#F25763'
const font = 'CircularStd-Medium'

export default class Login extends React.Component {
  constructor() {
    super()
    this.state = {
      pressed: false,
      alert: false,
      errorAlert: false,
    }
  }

  async handleClick() {
    facebookService
      .loginWithFacebook()
      .then((result) => {
        this.setState({ alert: false })
        this.props.navigation.navigate(result)
      })
      .catch(() => {
        this.setState({ errorAlert: true })
      })
  }

  cancelClick() {
    this.setState({ alert: false })
  }

  login() {
    this.setState({ alert: true })
  }

  // changing button appearance
  underlayShow() {
    this.setState({ pressed: true })
  }

  // changing button appearance
  underlayHide() {
    this.setState({ pressed: false })
  }

  render() {
    return (
      <View>
        <Text style={styles.header}>Welcome!</Text>
        <Text style={styles.subheading}>Let's get goin'.</Text>
        <TouchableHighlight
          onShowUnderlay={this.underlayShow.bind(this)}
          onHideUnderlay={this.underlayHide.bind(this)}
          activeOpacity={1}
          underlayColor="#3b5998"
          onPress={() => this.login()}
          style={styles.button}
        >
          <Text style={this.state.pressed ? styles.yesPress : styles.noPress}>
            {/* <Icon name="facebook" style={{fontSize: 20}} /> */}
            Log in with Facebook
          </Text>
        </TouchableHighlight>
        {this.state.alert && (
          <Alert
            title='Open "Facebook?"'
            body="You will be directed to the Facebook app for account verification"
            button
            buttonText="Open"
            press={() => this.handleClick()}
            cancel={() => this.cancelClick()}
          />
        )}
        {this.state.errorAlert && (
          <Alert
            title="Error, please try again"
            button
            buttonText="Close"
            press={() => this.setState({ errorAlert: false })}
            cancel={() => this.setState({ errorAlert: false })}
          />
        )}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  header: {
    fontSize: 50,
    color: hex,
    alignSelf: 'center',
    fontFamily: font,
    fontWeight: 'bold',
    marginTop: '40%',
  },
  subheading: {
    fontFamily: font,
    alignSelf: 'center',
    color: hex,
    fontSize: 30,
  },
  button: {
    borderRadius: 25,
    borderWidth: 2.5,
    borderColor: '#3b5998',
    paddingVertical: 10,
    paddingHorizontal: 12,
    width: '70%',
    alignSelf: 'center',
    marginTop: '10%',
  },
  yesPress: {
    alignSelf: 'center',
    color: '#fff',
    fontFamily: font,
    fontSize: 17,
    fontWeight: 'bold',
  },
  noPress: {
    alignSelf: 'center',
    color: '#3b5998',
    fontFamily: font,
    fontSize: 17,
    fontWeight: 'bold',
  },
})
