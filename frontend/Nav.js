import React from 'react'
import { Dimensions, StyleSheet, TouchableHighlight, View } from 'react-native'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import Icon from 'react-native-vector-icons/FontAwesome'
import colors from '../styles/colors.js'
import notifsApi from './apis/notificationsApi.js'

const height = Dimensions.get('window').height

class TabBar extends React.Component {
  render() {
    return (
      <View style={styles.bar}>
        <TouchableHighlight
          onPress={() => this.props.goHome()}
          style={{ width: '10%' }}
          underlayColor="transparent"
        >
          <Icon
            name="location-arrow"
            style={{ color: this.props.cur === 'Home' ? colors.hex : '#8d8d8d', fontSize: 26 }}
          />
        </TouchableHighlight>
        <TouchableHighlight
          onPress={() => this.props.goSearch()}
          style={{ width: '10%' }}
          underlayColor="transparent"
        >
          <Icon
            name="search"
            style={{ color: this.props.cur === 'Search' ? colors.hex : '#8d8d8d', fontSize: 26 }}
          />
        </TouchableHighlight>
        <TouchableHighlight
          onPress={() => this.props.goNotifs()}
          style={{ width: '10%' }}
          underlayColor="transparent"
        >
          <View style = {{flexDirection: 'column'}}>

            
          <Icon
            name="bullhorn"
            style={{ color: this.props.cur === 'Notifs' ? colors.hex : '#8d8d8d', fontSize: 26 }}
          />

        {this.state.notif && (
          // <Text style={{ color: 'red', fontSize: 26, position: 'absolute', textAlign: 'left', alignSelf: 'flex-end'}}>*</Text>

          <Icon
            name="circle"
            style={{ color: colors.hex, fontSize: 14, position: 'absolute', textAlign: 'left', alignSelf: 'flex-end'}}
          />
        )}

          
        </View>
        </TouchableHighlight>
        <TouchableHighlight
          onPress={() => this.props.goProfile()}
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

export default connect(mapStateToProps)(TabBar)

const styles = StyleSheet.create({
  bar: {
    width: '95%',
    marginBottom: '2%',
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
}
