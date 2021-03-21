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
import Icon5 from 'react-native-vector-icons/FontAwesome5'
import colors from '../../styles/colors.js'
import global from '../../global.js'
import modalStyles from '../../styles/modalStyles.js'
import normalize from '../../styles/normalize.js'
import { ProgressBar } from 'react-native-paper'
import screenStyles from '../../styles/screenStyles.js'
import socket from '../apis/socket.js'
import { showEnd } from '../redux/Actions.js'

const height = Dimensions.get('window').height
const res = []

class Loading extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      // restaurants: this.props.navigation.state.params.restaurants,
      restaurants: res,
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
  }

  endGroup() {
    this.setState({ disabled: true })
    socket.endGroup()
  }

  render() {
    return (
      <ImageBackground
        source={require('../assets/backgrounds/Loading.png')}
        style={screenStyles.screenBackground}
      >
        <View style={[styles.top, { flexDirection: 'row', justifyContent: 'space-between' }]}>
          <TouchableHighlight
            disabled={this.state.disabled}
            onPress={() => {
              if (global.isHost) {
                this.setState({ leave: true })
              } else {
                this.leaveGroup(false)
              }
            }}
            style={[styles.leaveIcon]}
            underlayColor="transparent"
          >
            <View style={styles.centerAlign}>
              <Icon5 name="door-open" style={[screenStyles.text, styles.door]} />
              <Text style={([screenStyles.text], styles.gray)}>Leave</Text>
            </View>
          </TouchableHighlight>
          <View>
            <Text style={[screenStyles.text, styles.black, { alignSelf: 'flex-end' }]}>
              5/6 members finished
            </Text>
            <ProgressBar
              progress={0.5}
              color={colors.hex}
              style={{ width: '100%', backgroundColor: '#E0E0E0', alignSelf: 'center' }}
            />
          </View>
        </View>
        <View style={styles.content}>
          <Text style={[styles.general, styles.title]}>Round done!</Text>
          <Image source={require('../assets/loading.gif')} style={styles.gif} />
        </View>
        <View>
          <Text style={styles.general}>
            Hang tight while others finish swiping and a match is found.
          </Text>
          {!global.isHost && (
            <TouchableHighlight
              disabled={this.state.disabled}
              style={[styles.leaveButton, screenStyles.medButton]}
              underlayColor="transparent"
              onPress={() => this.leaveGroup()}
            >
              <Text style={styles.leaveText}>Waiting...</Text>
            </TouchableHighlight>
          )}
          {global.isHost && (
            <TouchableHighlight
              disabled={this.state.disabled}
              style={[styles.leaveButton, screenStyles.medButton]}
              underlayColor="transparent"
              onPress={() => this.setState({ leave: true })}
            >
              <Text style={styles.leaveText}>Continue</Text>
            </TouchableHighlight>
          )}
        </View>
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
  top: { marginTop: '7%', marginLeft: '5%', marginRight: '5%' },
  leaveIcon: { alignSelf: 'flex-start' },
  centerAlign: { alignItems: 'center' },
  door: { color: '#6A6A6A', fontSize: normalize(20) },
  gray: { color: '#6A6A6A' },
  black: { color: 'black' },
  content: {
    width: '70%',
    alignSelf: 'center',
  },
  title: {
    fontSize: normalize(30),
    fontWeight: 'bold',
    color: colors.hex,
    marginTop: '0%',
    width: '90%',
  },
  gif: {
    alignSelf: 'center',
    width: height * 0.28,
    height: height * 0.35,
    marginBottom: '15%',
  },
  general: {
    fontFamily: screenStyles.book.fontFamily,
    fontSize: normalize(16),
    padding: 30,
    textAlign: 'center',
    marginTop: '20%',
    color: 'white',
    width: '80%',
    alignSelf: 'center',
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
