import React from 'react'
import { bindActionCreators } from 'redux'
import { newNotif, noNotif } from './redux/Actions.js'
import { Dimensions, StyleSheet, TouchableHighlight, View } from 'react-native'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import Icon from 'react-native-vector-icons/FontAwesome'
import colors from '../styles/colors.js'

const height = Dimensions.get('window').height

class TabBar extends React.Component {
  componentDidMount() {
    if (this.props.cur === 'Notifs') {
      this.props.noNotif()
    }
  }

  onGoHome() {
    // var debounce =  _.debounce(this.props.goHome, 200)
    // return debounce()
    if (this.props.cur !== 'Home') {
      this.props.goHome()
    }
  }

  onGoSearch() {
    if (this.props.cur !== 'Search') {
      this.props.goSearch()
    }
  }

  onGoNotifs() {
    if (this.props.cur !== 'Notifs') {
      this.props.goNotifs()
    }
  }

  onGoProfile() {
    if (this.props.cur !== 'Profile') {
      this.props.goProfile()
    }
  }

  render() {
    return (
      <View style={styles.bar}>
        <TouchableHighlight
          onPress={() => this.onGoHome()}
          style={{ width: '10%' }}
          underlayColor="transparent"
        >
          <Icon
            name="location-arrow"
            style={{ color: this.props.cur === 'Home' ? colors.hex : '#8d8d8d', fontSize: 26 }}
          />
        </TouchableHighlight>
        <TouchableHighlight
          onPress={() => this.onGoSearch()}
          style={{ width: '10%' }}
          underlayColor="transparent"
        >
          <Icon
            name="search"
            style={{ color: this.props.cur === 'Search' ? colors.hex : '#8d8d8d', fontSize: 26 }}
          />
        </TouchableHighlight>
        <TouchableHighlight
          onPress={() => this.onGoNotifs()}
          style={{ width: '10%' }}
          underlayColor="transparent"
        >
          <View style={{ flexDirection: 'column' }}>
            <Icon
              name="bullhorn"
              style={{ color: this.props.cur === 'Notifs' ? colors.hex : '#8d8d8d', fontSize: 26 }}
            />

            {this.props.notif && (
              // <Text style={{ color: 'red', fontSize: 26, position: 'absolute', textAlign: 'left', alignSelf: 'flex-end'}}>*</Text>

              <Icon
                name="circle"
                style={{
                  color: colors.hex,
                  fontSize: 14,
                  position: 'absolute',
                  textAlign: 'left',
                  alignSelf: 'flex-end',
                }}
              />
            )}
          </View>
        </TouchableHighlight>
        <TouchableHighlight
          onPress={() => this.onGoProfile()}
          style={{ width: '10%' }}
          underlayColor="transparent"
        >
          <Icon
            name="user"
            style={{ color: this.props.cur === 'Profile' ? colors.hex : '#8d8d8d', fontSize: 26 }}
          />
        </TouchableHighlight>
      </View>
    )
  }
}

const mapStateToProps = (state) => {
  const { notif } = state
  return { notif }
}
//  access this as this.props.notif

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      newNotif,
      noNotif,
    },
    dispatch,
  )

export default connect(mapStateToProps, mapDispatchToProps)(TabBar)

const styles = StyleSheet.create({
  bar: {
    width: '90%',
    marginBottom: '4%',
    alignSelf: 'center',
    height: height * 0.07,
    backgroundColor: '#fff2f2',
    alignItems: 'center',
    borderRadius: 10,
    elevation: 20,
    borderWidth: 0,
    position: 'absolute',
    bottom: 0,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
})

TabBar.propTypes = {
  goHome: PropTypes.func,
  goSearch: PropTypes.func,
  goNotifs: PropTypes.func,
  goProfile: PropTypes.func,
  cur: PropTypes.string,
  noNotif: PropTypes.func,
  notif: PropTypes.bool,
}
