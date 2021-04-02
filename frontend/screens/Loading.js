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
import Icon5 from 'react-native-vector-icons/FontAwesome5'
import colors from '../../styles/colors.js'
import normalize from '../../styles/normalize.js'
import { ProgressBar } from 'react-native-paper'
import screenStyles from '../../styles/screenStyles.js'
import socket from '../apis/socket.js'
import { updateSession, setHost, setMatch, setTop } from '../redux/Actions.js'

const height = Dimensions.get('window').height

class Loading extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      restaurants: this.props.navigation.state.params.restaurants,
      restaurants: res,
      leave: false,
      disabled: false,
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
    this.setState({ disabled: true })
    socket.getSocket().off()
    socket.leave('loading')
    this.setState({ disabled: false })
    this.props.navigation.replace('Home')
    this.props.updateSession({})
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
            onPress={() => this.leave()}
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
          {!this.props.isHost && (
            <TouchableHighlight
              disabled={this.state.disabled}
              style={[styles.leaveButton, screenStyles.medButton]}
              underlayColor="transparent"
              onPress={() => this.leave()}
            >
              <Text style={styles.leaveText}>Waiting...</Text>
            </TouchableHighlight>
          )}
          {this.props.isHost && (
            <TouchableHighlight
              disabled={this.state.disabled}
              style={[styles.leaveButton, screenStyles.medButton]}
              underlayColor="transparent"
              onPress={() => socket.toTop3()}
            >
              <Text style={styles.leaveText}>Continue</Text>
            </TouchableHighlight>
          )}
        </View>
      </ImageBackground>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    session: state.session.session,
    isHost: state.isHost.isHost,
    username: state.username.username,
  }
}

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      updateSession,
      setHost,
      setMatch,
      setTop,
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
}

export default connect(mapStateToProps, mapDispatchToProps)(Loading)

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
