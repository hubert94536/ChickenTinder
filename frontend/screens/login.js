import React from 'react'
import {Image, StyleSheet, Text, TouchableHighlight, View } from 'react-native'
import Alert from '../modals/alert.js'
import Icon from 'react-native-vector-icons/FontAwesome'
import imgStyles from '../../styles/cardImage.js'
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
      <View style= {[{backgroundColor: 'white', flex: 1}]}>
        
        <Image source={require('../assets/images/logo2.png')} style = {{alignSelf: 'center', width: 200, height: 248, marginTop: '12%'}}/>
        <Text style={[screenStyles.text, screenStyles.title, { fontFamily: 'CircularStd-Bold', fontSize: 30, marginTop: '2.5%' , marginBottom: '10%', fontWeight: 'bold'}]}>Let's Get Chews-ing!</Text>
        <TouchableHighlight
          onShowUnderlay={() => this.setState({ phonePressed: true })}
          onHideUnderlay={() => this.setState({ phonePressed: false })}
          activeOpacity={1}
          underlayColor={'white'}
          onPress={() => this.props.navigation.navigate('Phone')}
          style={[screenStyles.medButton, styles.button, { borderColor: hex, backgroundColor:hex}]}
        >

          <View style={{ flexDirection: 'row', alignSelf: 'center' }}>
              <Icon style={[imgStyles.icon, { fontSize: 22, color: 'white',  marginRight: '5%' }]} name="phone" />
              <Text
              style={[
                styles.buttonText,
                this.state.phonePressed ? { color: hex} : { color: 'white' },
              ]}
              >
                Login with Phone
                </Text>
          </View>
          

        </TouchableHighlight>
        <TouchableHighlight
          onShowUnderlay={() => this.setState({ pressed: true })}
          onHideUnderlay={() => this.setState({ pressed: false })}
          activeOpacity={1}
          underlayColor='white'
          onPress={() => this.login()}
          style={[screenStyles.medButton, styles.button, {borderColor: '#3b5998', backgroundColor:'#3b5998' }]}
        >
          <View style={{ flexDirection: 'row', alignSelf: 'center' }}>
              <Icon style={[imgStyles.icon, { fontSize: 22, color: 'white',  marginRight: '5%' }]} name="facebook-official" />
              <Text
              style={[
                styles.buttonText,
                this.state.pressed ? { color: '#3b5998' } : { color: 'white'},
              ]}
              >
                Login with Facebook
              </Text>
          </View>
          
        </TouchableHighlight>

        <Text style={[screenStyles.text, { fontFamily: 'CircularStd-Book', alignSelf: 'center', marginHorizontal: '15%', marginTop: '7.5%',fontSize: 13, textAlign: 'center', lineHeight: 17}]}>
          By clicking log in, you agree with our Terms and Conditions.
          </Text>

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
    paddingVertical: 5,
    paddingHorizontal: 12,
    width: '70%',
    marginTop: '7%',
  },
  buttonText: {
    alignSelf: 'center',
    fontFamily: 'CircularStd-Book',
    fontSize: 18,
    fontWeight: 'normal',
  },
})
