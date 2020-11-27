import React from 'react'
import { Dimensions, StyleSheet, TouchableHighlight, View } from 'react-native'
import PropTypes from 'prop-types'
import Icon from 'react-native-vector-icons/FontAwesome'

const height = Dimensions.get('window').height

const hex = '#F15763'

export default class TabBar extends React.Component {
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
            style={{ color: this.props.cur === 'Home' ? hex : '#8d8d8d', fontSize: 26 }}
          />
        </TouchableHighlight>
        <TouchableHighlight
          onPress={() => this.props.goSearch()}
          style={{ width: '10%' }}
          underlayColor="transparent"
        >
          <Icon
            name="search"
            style={{ color: this.props.cur === 'Search' ? hex : '#8d8d8d', fontSize: 26 }}
          />
        </TouchableHighlight>
        <TouchableHighlight
          onPress={() => this.props.goNotifs()}
          style={{ width: '10%' }}
          underlayColor="transparent"
        >
          <Icon
            name="bullhorn"
            style={{ color: this.props.cur === 'Notifs' ? hex : '#8d8d8d', fontSize: 26 }}
          />
        </TouchableHighlight>
        <TouchableHighlight
          onPress={() => this.props.goProfile()}
          style={{ width: '10%' }}
          underlayColor="transparent"
        >
          <Icon
            name="user"
            style={{ color: this.props.cur === 'Profile' ? hex : '#8d8d8d', fontSize: 26 }}
          />
        </TouchableHighlight>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  bar: {
    width: '95%',
    marginBottom: '2%',
    alignSelf: 'center',
    height: height * 0.07,
    backgroundColor: '#fff2f2',
    justifyContent: 'center',
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
