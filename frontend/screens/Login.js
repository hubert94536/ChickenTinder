import React from 'react'
import { Image, Text, TouchableHighlight, View } from 'react-native'
import Alert from '../modals/Alert.js'
import Icon from 'react-native-vector-icons/FontAwesome'
import imgStyles from '../../styles/cardImage.js'
import facebookService from '../apis/facebookService.js'
import screenStyles from '../../styles/screenStyles.js'
import PropTypes from 'prop-types'

const hex = '#F15763'

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
        this.props.navigation.replace(result)
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
      <View style={[{ backgroundColor: 'white', flex: 1 }]}>
        <Image
          source={require('../assets/images/logo2.png')}
          style={{ alignSelf: 'center', width: 200, height: 248, marginTop: '12%' }}
        />
        <Text
          style={[
            screenStyles.text,
            screenStyles.title,
            {
              fontFamily: 'CircularStd-Bold',
              fontSize: 30,
              marginTop: '2.5%',
              marginBottom: '10%',
              fontWeight: 'bold',
            },
          ]}
        >
          Let&apos;s Get Chews-ing!
        </Text>
        <TouchableHighlight
          onShowUnderlay={() => this.setState({ phonePressed: true })}
          onHideUnderlay={() => this.setState({ phonePressed: false })}
          activeOpacity={1}
          underlayColor={'white'}
          onPress={() => this.props.navigation.replace('Phone')}
          style={[
            screenStyles.longButton,
            { borderColor: hex, backgroundColor: hex, marginTop: '7%' },
          ]}
        >
          <View style={{ flexDirection: 'row', alignSelf: 'center' }}>
            <Icon
              style={[imgStyles.icon, { fontSize: 22, color: 'white', marginRight: '5%' }]}
              name="phone"
            />
            <Text
              style={[
                screenStyles.longButtonText,
                this.state.phonePressed ? { color: hex } : { color: 'white' },
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
          underlayColor="white"
          onPress={() => this.login()}
          style={[
            screenStyles.longButton,
            { borderColor: '#3b5998', backgroundColor: '#3b5998', marginTop: '7%' },
          ]}
        >
          <View style={{ flexDirection: 'row', alignSelf: 'center' }}>
            <Icon
              style={[imgStyles.icon, { fontSize: 22, color: 'white', marginRight: '5%' }]}
              name="facebook-official"
            />
            <Text
              style={[
                screenStyles.longButtonText,
                this.state.pressed ? { color: '#3b5998' } : { color: 'white' },
              ]}
            >
              Login with Facebook
            </Text>
          </View>
        </TouchableHighlight>

        <Text
          style={[
            screenStyles.text,
            {
              fontFamily: 'CircularStd-Book',
              alignSelf: 'center',
              marginHorizontal: '15%',
              marginTop: '7.5%',
              fontSize: 13,
              textAlign: 'center',
              lineHeight: 17,
            },
          ]}
        >
          By clicking log in, you agree with our Terms and Conditions.
        </Text>

        {this.state.alert && (
          <Alert
            title='Open "Facebook?"'
            body="You will be directed to the Facebook app for account verification"
            twoButton
            buttonAff="Open"
            buttonNeg="Go Back"
            height="25%"
            press={() => this.handleClick()}
            cancel={() => this.cancelClick()}
          />
        )}
        {this.state.errorAlert && (
          <Alert
            title="Error, please try again"
            buttonAff="Close"
            height="20%"
            press={() => this.setState({ errorAlert: false })}
            cancel={() => this.setState({ errorAlert: false })}
          />
        )}
      </View>
    )
  }
}

Login.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
    replace: PropTypes.func,
  }).isRequired,
}
