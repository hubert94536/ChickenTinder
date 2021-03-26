import React, { Component } from 'react'
import { StyleSheet } from 'react-native'
import PropTypes from 'prop-types'
import { ButtonGroup } from 'react-native-elements'
import colors from '../../styles/colors.js'
import normalize from '../../styles/normalize.js'

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
      selectedIndex: 2,
    }
    this.updateIndex = this.updateIndex.bind(this)
  }

  updateIndex(selectedIndex) {
    this.setState({ selectedIndex }, () =>
      console.log('selectedIndex: ' + this.state.selectedIndex),
    )
    if (selectedIndex == 0) {
      this.props.onValueChange('AM')
    } else if (selectedIndex == 1) {
      this.props.onValueChange('PM')
    }
  }

  render() {
    const buttons = ['AM', 'PM']
    const { selectedIndex } = this.state
    return (
      <ButtonGroup
        onPress={this.updateIndex}
        selectedIndex={selectedIndex}
        buttons={buttons}
        //Styling
        containerStyle={styles.container}
        innerBorderStyle={styles.innerBorder}
        textStyle={styles.text}
        selectedButtonStyle={styles.button}
        selectedTextStyle={styles.selectedText}
        underlayColor={'white'}
        activeOpacity={1}
      />
    )
  }
}

const styles = StyleSheet.create({
  container: {
    height: 40,
    width: 80,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.hex,
  },
  innerBorder: {
    width: 0,
  },
  text: {
    fontSize: normalize(17),
    color: colors.gray,
  },
  button: {
    backgroundColor: 'white',
  },
  selectedText: {
    color: colors.hex,
    borderBottomWidth: 1,
    borderColor: colors.hex,
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
