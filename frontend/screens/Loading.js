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
import { BlurView } from '@react-native-community/blur'
import PropTypes from 'prop-types'
import Icon5 from 'react-native-vector-icons/FontAwesome5'
import Alert from '../modals/Alert.js'
import colors from '../../styles/colors.js'
import normalize from '../../styles/normalize.js'
import { ProgressBar } from 'react-native-paper'
import modalStyles from '../../styles/modalStyles.js'
import screenStyles from '../../styles/screenStyles.js'
import socket from '../apis/socket.js'
import {
  updateSession,
  setHost,
  setMatch,
  setTop,
  setDisable,
  hideDisable,
  hideRefresh,
} from '../redux/Actions.js'

const width = Dimensions.get('window').width

class Loading extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      leave: false, //leave alert
      continue: false, //continue alert
      pressed: false,
    }
    socket.getSocket().once('match', (data) => {
      socket.getSocket().off()
      this.props.setMatch(this.props.session.resInfo.find((x) => x.id === data))
      this.props.navigation.replace('Match')
    })

    socket.getSocket().once('top 3', (res) => {
      socket.getSocket().off()
      let restaurants = this.props.session.resInfo.filter((x) => res.choices.includes(x.id))
      restaurants.forEach((x) => (x.likes = res.likes[res.choices.indexOf(x.id)]))
      this.props.setTop(restaurants.reverse())
      this.props.navigation.replace('TopThree')
    })

    socket.getSocket().on('update', (res) => {
      this.props.updateSession(res)
      this.props.setHost(res.members[res.host].username === this.props.username)
    })
  }

  leave() {
    this.props.setDisable()
    socket.getSocket().off()
    socket.leave()
    this.props.navigation.replace('Home')
    this.props.hideDisable()
  }

  componentDidMount() {
    this.props.hideRefresh()
    console.log(this.props.session)
  }

  render() {
    return (
      <ImageBackground
        source={require('../assets/backgrounds/Loading.png')}
        style={screenStyles.screenBackground}
      >
        <View style={[styles.top, { flexDirection: 'row', justifyContent: 'space-between' }]}>
          <TouchableHighlight
            disabled={this.props.disable}
            onPress={() => {
              this.setState({ leave: true })
              this.props.setDisable()
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
              {this.props.session.finished.length}/{Object.keys(this.props.session.members).length}{' '}
              members finished
            </Text>
            <ProgressBar
              progress={
                this.props.session.finished.length / Object.keys(this.props.session.members).length
              }
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
          {!this.props.isHost && (
            <View>
              <Text style={styles.general}>
                Hang tight while others finish swiping and a match is found.
              </Text>
              <TouchableHighlight
                disabled={this.props.disable}
                style={[styles.leaveButton, screenStyles.medButton]}
                underlayColor="transparent"
                onPress={() => this.leave()}
              >
                <Text style={styles.leaveText}>Waiting...</Text>
              </TouchableHighlight>
            </View>
          )}
          {this.props.isHost && (
            <View>
              <Text style={styles.general}>
                Hang tight while others finish swiping or continue for the results!
              </Text>
              <TouchableHighlight
                disabled={this.props.disable}
                style={[styles.leaveButton, screenStyles.medButton]}
                underlayColor="white"
                onShowUnderlay={() => this.setState({ pressed: true })}
                onHideUnderlay={() => this.setState({ pressed: false })}
                onPress={() => {
                  this.setState({ continue: true })
                  this.props.setDisable()
                }}
              >
                <Text
                  style={[styles.leaveText, this.state.pressed ? screenStyles.hex : styles.white]}
                >
                  Continue
                </Text>
              </TouchableHighlight>
            </View>
          )}
        </View>
        {this.state.leave && (
          <Alert
            title="Leave Round"
            body="Are you sure you want to leave?"
            buttonAff="Leave"
            buttonNeg="Back"
            height="25%"
            twoButton
            disabled={this.props.disable}
            press={() => this.leave()}
            cancel={() => {
              this.setState({ leave: false })
              this.props.hideDisable()
            }}
          />
        )}
        {this.state.continue && (
          <Alert
            title="Continue Round"
            body="Continue to the top results without waiting for the others? (This will end swiping for everyone)"
            buttonAff="Continue"
            buttonNeg="Back"
            height="29%"
            twoButton
            disabled={this.props.disable}
            press={() => socket.toTop3()}
            cancel={() => {
              this.setState({ continue: false })
              this.props.hideDisable()
            }}
          />
        )}
        {(this.state.leave || this.state.continue) && (
          <BlurView
            blurType="dark"
            blurAmount={10}
            reducedTransparencyFallbackColor="white"
            style={modalStyles.blur}
          />
        )}
      </ImageBackground>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    session: state.session.session,
    isHost: state.isHost.isHost,
    username: state.username.username,
    disable: state.disable,
  }
}

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      updateSession,
      setHost,
      setMatch,
      setTop,
      setDisable,
      hideDisable,
      hideRefresh,
    },
    dispatch,
  )

Loading.propTypes = {
  restaurant: PropTypes.array,
  navigation: PropTypes.object,
  updateSession: PropTypes.func,
  isHost: PropTypes.bool,
  setHost: PropTypes.func,
  username: PropTypes.string,
  session: PropTypes.object,
  setMatch: PropTypes.func,
  setTop: PropTypes.func,
  hideDisable: PropTypes.func,
  setDisable: PropTypes.func,
  disable: PropTypes.bool,
  hideRefresh: PropTypes.func,
}

export default connect(mapStateToProps, mapDispatchToProps)(Loading)

const styles = StyleSheet.create({
  top: { marginTop: '7%', marginLeft: '5%', marginRight: '5%' },
  leaveIcon: { alignSelf: 'flex-start' },
  centerAlign: { alignItems: 'center' },
  door: { color: '#6A6A6A', fontSize: normalize(20) },
  gray: { color: '#6A6A6A' },
  black: { color: 'black' },
  white: { color: 'white' },
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
    width: width * 0.5413,
    height: width * 0.6767,
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
