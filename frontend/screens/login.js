import React from 'react'
import { StyleSheet, Text, TouchableHighlight, View } from 'react-native'
import Alert from '../modals/alert.js'
import facebookService from '../apis/facebookService.js'
import screenStyles from '../../styles/screenStyles.js'

const hex = '#F15763'
const font = 'CircularStd-Bold'

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

  render() {
    return (
      <View>
        <Text style={[screenStyles.text, screenStyles.title, { marginTop: '40%' }]}>Welcome!</Text>
        <Text style={[screenStyles.text, screenStyles.medButtonText]}>Let's get goin'.</Text>
        <TouchableHighlight
          onShowUnderlay={() => this.setState({ phonePressed: true })}
          onHideUnderlay={() => this.setState({ phonePressed: false })}
          activeOpacity={1}
          underlayColor={hex}
          onPress={() => this.props.navigation.navigate('Phone')}
          style={[screenStyles.medButton, styles.button, { borderColor: hex }]}
        >
          <Text
            style={[
              styles.buttonText,
              this.state.phonePressed ? { color: 'white' } : { color: hex },
            ]}
          >
            Phone Number Login
          </Text>
        </TouchableHighlight>
        <TouchableHighlight
          onShowUnderlay={() => this.setState({ pressed: true })}
          onHideUnderlay={() => this.setState({ pressed: false })}
          activeOpacity={1}
          underlayColor="#3b5998"
          onPress={() => this.login()}
          style={[screenStyles.medButton, styles.button]}
        >
          <Text
            style={[
              styles.buttonText,
              this.state.pressed ? { color: 'white' } : { color: '#3b5998' },
            ]}
          >
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
  button: {
    borderColor: '#3b5998',
    paddingVertical: 10,
    paddingHorizontal: 12,
    width: '70%',
    marginTop: '10%',
  },
  buttonText: {
    alignSelf: 'center',
    fontFamily: font,
    fontSize: 17,
    fontWeight: 'bold',
  },
})
