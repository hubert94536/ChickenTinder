import React from 'react'
import {
  Dimensions,
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
} from 'react-native'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import Alert from '../modals/Alert.js'
import { BlurView } from '@react-native-community/blur'
import colors from '../../styles/colors.js'
import global from '../../global.js'
import modalStyles from '../../styles/modalStyles.js'
import normalize from '../../styles/normalize.js'
import screenStyles from '../../styles/screenStyles.js'
import socket from '../apis/socket.js'
import { showEnd } from '../redux/Actions.js'

const height = Dimensions.get('window').height

class Loading extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      restaurants: this.props.navigation.state.params.restaurants,
      leave: false,
      disabled: false,
    }
    socket.getSocket().once('match', (data) => {
      socket.getSocket().off()
      var res
      for (var i = 0; i < this.state.restaurants.length; i++) {
        if (this.state.restaurants[i].id === data) {
          res = this.state.restaurants[i]
          break
        }
      }
      this.props.navigation.replace('Match', {
        restaurant: res,
      })
    })
    socket.getSocket().once('top 3', (res) => {
      socket.getSocket().off()
      var restaurants = []
      for (var i = 0; i < 3; i++) {
        for (var j = 0; j < this.state.restaurants.length; j++) {
          if (this.state.restaurants[j].id === res.choices[i]) {
            restaurants[i] = this.state.restaurants[j]
            restaurants[i].likes = res.likes[i]
            break
          }
        }
      }
      this.props.navigation.replace('TopThree', {
        top: restaurants,
      })
    })

    socket.getSocket().once('leave', () => {
      this.leaveGroup(true)
    })
  }

  leaveGroup() {
    if (!this.state.disabled) {
      this.setState({ disabled: true })
      socket.endLeave()
      if (!global.isHost) {
        this.props.showEnd()
      }
      global.code = ''
      global.host = ''
      global.isHost = false
      global.restaurants = []
      this.props.navigation.replace('Home')
      this.setState({ disabled: false })
    }
  }

  endGroup() {
    if (!this.state.disabled) {
      this.setState({ disabled: true })
      socket.endGroup()
    }
    this.setState({ disabled: false })
  }

  render() {
    return (
      <ImageBackground
        source={require('../assets/backgrounds/Loading.png')}
        style={styles.background}
      >
        <View style={[modalStyles.modalContent]}>
          <View style={styles.content}>
            <Text style={[styles.general, styles.title]}>Round done!</Text>
            <Image source={require('../assets/loading.gif')} style={styles.gif} />
            <Text style={styles.general}>
              Hang tight while others finish swiping and a match is found!
            </Text>
          </View>
          {!global.isHost && (
            <TouchableHighlight
              style={[styles.leaveButton, screenStyles.medButton]}
              underlayColor="transparent"
              onPress={() => this.leaveGroup()}
            >
              <Text style={styles.leaveText}>Leave Round</Text>
            </TouchableHighlight>
          )}
          {global.isHost && (
            <TouchableHighlight
              style={[styles.leaveButton, screenStyles.medButton]}
              underlayColor="transparent"
              onPress={() => this.setState({ leave: true })}
            >
              <Text style={styles.leaveText}>End Round</Text>
            </TouchableHighlight>
          )}
          {this.state.leave && (
            <BlurView
              blurType="dark"
              blurAmount={10}
              reducedTransparencyFallbackColor="white"
              style={modalStyles.blur}
            />
          )}
          {this.state.leave && (
            <Alert
              title="Are you sure you want to leave?"
              body="Leaving ends the group for everyone"
              buttonAff="Leave"
              height="30%"
              press={() => socket.endRound()}
              cancel={() => this.setState({ leave: false })}
            />
          )}
        </View>
      </ImageBackground>
    )
  }
}

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      showEnd,
    },
    dispatch,
  )

Loading.propTypes = {
  restaurant: PropTypes.array,
  navigation: PropTypes.object,
  showEnd: PropTypes.func,
}

export default connect(mapDispatchToProps)(Loading)

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  content: {
    width: '70%',
    alignSelf: 'center',
  },
  title: {
    fontSize: normalize(30),
    fontWeight: 'bold',
    color: colors.hex,
    marginTop: '10%',
  },
  gif: {
    alignSelf: 'center',
    width: height * 0.28,
    height: height * 0.35,
  },
  general: {
    fontFamily: screenStyles.book.fontFamily,
    fontSize: normalize(16),
    padding: 30,
    textAlign: 'center',
    marginTop: '20%',
    color: 'white',
  },
  leaveButton: {
    alignSelf: 'center',
    width: '50%',
    borderColor: 'white',
  },
  leaveText: {
    color: 'white',
    textAlign: 'center',
    fontFamily: screenStyles.book.fontFamily,
    fontSize: normalize(18),
    padding: '5%',
  },
})
