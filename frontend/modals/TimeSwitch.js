import React, { Component } from 'react'
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native'
import PropTypes from 'prop-types'

export default class TimeSwitch extends Component {
  static propTypes = {
    onValueChange: PropTypes.func,
  }

  static defaultProps = {
    onValueChange: () => null,
  }

  constructor() {
    super()

    this.state = {
      activeSwitch: 1,
      sbWidth: 100,
      sbHeight: 44,
      direction: 'ltr',
      offsetX: new Animated.Value(0),
    }

    this._switchDirection = this._switchDirection.bind(this)
  }

  _switchDirection(direction) {
    let dir = 'row'

    if (direction === 'rtl') {
      dir = 'row-reverse'
    } else {
      dir = 'row'
    }
    return dir
  }

  _switchThump(direction) {
    const { onValueChange } = this.props
    let dirsign = 1
    if (direction === 'rtl') {
      dirsign = -1
    } else {
      dirsign = 1
    }

    if (this.state.activeSwitch === 1) {
      this.setState({ activeSwitch: 2 }, () => onValueChange(this.state.activeSwitch))

      Animated.timing(this.state.offsetX, {
        toValue: ((this.props.switchWidth || this.state.sbWidth) / 2) * dirsign,
        duration: this.props.switchSpeedChange || 100,
        useNativeDriver: false,
      }).start()
    } else {
      this.setState({ activeSwitch: 1 }, () => onValueChange(this.state.activeSwitch))
      Animated.timing(this.state.offsetX, {
        toValue: 0,
        duration: this.props.switchSpeedChange || 100,
        useNativeDriver: false,
      }).start()
    }
  }

  render() {
    return (
      <View>
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => {
            if (!this.props.disabled)
              this._switchThump(this.props.switchdirection || this.state.direction)
          }}
        >
          <View
            style={[
              {
                width: this.props.switchWidth || this.state.sbWidth,
                height: this.props.switchHeight || this.state.sbHeight,
                borderRadius:
                  this.props.switchBorderRadius !== undefined
                    ? this.props.switchBorderRadius
                    : this.state.sbHeight / 2,
                borderWidth: 1,
                borderColor: this.props.switchBorderColor || '#d4d4d4',
                backgroundColor: this.props.switchBackgroundColor || '#fff',
              },
            ]}
          >
            <View
              style={[
                {
                  flexDirection: this._switchDirection(
                    this.props.switchdirection || this.state.direction,
                  ),
                },
              ]}
            >
              <Animated.View style={{ transform: [{ translateX: this.state.offsetX }] }}>
                <View
                  style={[
                    switchStyles.wayBtnActive,
                    {
                      width: this.props.switchWidth / 2 || this.state.sbWidth / 2,
                      height: this.props.switchHeight - 1 || this.state.sbHeight - 1,
                      borderRadius:
                        this.props.switchBorderRadius !== undefined
                          ? this.props.switchBorderRadius
                          : this.state.sbHeight / 2,
                      borderColor: this.props.btnBorderColor || '#00a4b9',
                      backgroundColor: this.props.btnBackgroundColor || '#00bcd4',
                    },
                  ]}
                />
              </Animated.View>

              <View
                style={[
                  switchStyles.textPos,
                  {
                    width: this.props.switchWidth / 2 || this.state.sbWidth / 2,
                    height: this.props.switchHeight - 6 || this.state.sbHeight - 6,
                    left: 0,
                  },
                ]}
              >
                <Text
                  style={[
                    this.state.activeSwitch === 1
                      ? { color: this.props.activeFontColor || '#fff' }
                      : { color: this.props.fontColor || '#b1b1b1' },
                  ]}
                >
                  {this.props.text1 || 'ON'}
                </Text>
              </View>

              <View
                style={[
                  switchStyles.textPos,
                  {
                    width: this.props.switchWidth / 2 || this.state.sbWidth / 2,
                    height: this.props.switchHeight - 6 || this.state.sbHeight - 6,
                    right: 0,
                  },
                ]}
              >
                <Text
                  style={[
                    this.state.activeSwitch === 2
                      ? { color: this.props.activeFontColor || '#fff' }
                      : { color: this.props.fontColor || '#b1b1b1' },
                  ]}
                >
                  {this.props.text2 || 'OFF'}
                </Text>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    )
  }
}

const switchStyles = StyleSheet.create({
  textPos: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  rtl: {
    flexDirection: 'row-reverse',
  },
  ltr: {
    flexDirection: 'row',
  },
  wayBtnActive: {
    // borderWidth: 1,
    // marginTop: 2,
    // marginRight: 2,
    // marginLeft: 2,
  },
})

TimeSwitch.propTypes = {
  disabled: PropTypes.bool,
  onValueChange: PropTypes.func,
  text1: PropTypes.string,
  text2: PropTypes.string,
  switchWidth: PropTypes.number,
  switchHeight: PropTypes.number,
  switchdirection: PropTypes.string,
  switchBorderRadius: PropTypes.number,
  switchSpeedChange: PropTypes.number,
  switchBorderColor: PropTypes.string,
  switchBackgroundColor: PropTypes.string,
  btnBorderColor: PropTypes.string,
  btnBackgroundColor: PropTypes.string,
  fontColor: PropTypes.string,
  activeFontColor: PropTypes.string,
}
