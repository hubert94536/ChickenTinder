import React, { Component } from 'react'
import { StyleSheet } from 'react-native'
import PropTypes from 'prop-types'
import { ButtonGroup } from 'react-native-elements'
import colors from '../../styles/colors.js'
import normalize from '../../styles/normalize.js'

var groupWidth

export default class ButtonSwitch extends Component {
  static propTypes = {
    onValueChange: PropTypes.func,
  }

  static defaultProps = {
    onValueChange: () => null,
  }

  constructor() {
    super()
    this.state = {
      selectedIndex: 0,
    }
    this.updateIndex = this.updateIndex.bind(this)
  }

  updateIndex(selectedIndex) {
    this.setState({ selectedIndex })
    if (selectedIndex == 0) {
      this.props.onValueChange(this.props.value1)
    } else if (selectedIndex == 1) {
      this.props.onValueChange(this.props.value2)
    } else if (selectedIndex == 2) {
      this.props.onValueChange(this.props.value3)
    } else if (selectedIndex == 3) {
      this.props.onValueChange(this.props.value4)
    }
  }

  render() {
    const buttons = [this.props.text1, this.props.text2]
    if (this.props.text3) {
      buttons.push(this.props.text3)
    }
    if (this.props.text4) {
      buttons.push(this.props.text4)
    }
    const { selectedIndex } = this.state
    if (this.props.text4) {
      groupWidth = styles.containerWidth4
    }
    else if (this.props.text3) {
      groupWidth = styles.containerWidth3
    }
    else {
      groupWidth = styles.containerWidth2
    }
    return (
      <ButtonGroup
        onPress={this.updateIndex}
        selectedIndex={selectedIndex}
        buttons={buttons}
        //Styling
        containerStyle={[styles.container, groupWidth]}
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
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.hex,
  },
  containerWidth2:{
    width: 80
  },
  containerWidth3: {
    width: 120
  },
  containerWidth4: {
    width: 160
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

ButtonSwitch.propTypes = {
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
