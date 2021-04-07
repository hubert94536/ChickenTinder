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

  constructor(props) {
    super(props)
    this.state = {
      selectedIndex: this.props.selectMultiple ? -1 : 0, // Default value only for single choices
      selectedIndexes: [0],
    }
    this.updateIndex = this.updateIndex.bind(this)
  }

  updateIndex(selectedIndex) {
    // If allow users to select multiple buttons (ie. price)
    if (this.props.selectMultiple) {
      this.setState({ selectedIndexes: selectedIndex }, () => {
        //  Turn array of indexes into array of desired values passed in as props
        const priceArr = []
        const tempSelectedIndexes = this.state.selectedIndexes
        tempSelectedIndexes.forEach((index) => {
          switch (index) {
            case 0:
              priceArr.push(this.props.value1)
              break
            case 1:
              priceArr.push(this.props.value2)
              break
            case 2:
              priceArr.push(this.props.value3)
              break
            case 3:
              priceArr.push(this.props.value4)
              break
          }
        })
        this.props.onValueChange(priceArr)
      })
      return
    } else {
      this.setState({ selectedIndex: selectedIndex })
    }
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

    if (this.props.text4) {
      groupWidth = styles.containerWidth4
    } else if (this.props.text3) {
      groupWidth = styles.containerWidth3
    } else {
      groupWidth = styles.containerWidth2
    }
    return (
      <ButtonGroup
        onPress={this.updateIndex}
        selectedIndex={this.state.selectedIndex}
        selectedIndexes={this.state.selectedIndexes}
        buttons={buttons}
        //Styling
        containerStyle={[styles.container, groupWidth]}
        innerBorderStyle={styles.innerBorder}
        textStyle={styles.text}
        selectedButtonStyle={styles.button}
        selectedTextStyle={styles.selectedText}
        underlayColor={'white'}
        activeOpacity={1}
        selectMultiple={this.props.selectMultiple}
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
  containerWidth2: {
    width: 80,
  },
  containerWidth3: {
    width: 120,
  },
  containerWidth4: {
    // width: 180,
    width: 200,
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
  value1: PropTypes.string,
  value2: PropTypes.string,
  value3: PropTypes.string,
  value4: PropTypes.string,
  text1: PropTypes.string,
  text2: PropTypes.string,
  text3: PropTypes.string,
  text4: PropTypes.string,
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
  selectMultiple: PropTypes.bool,
}
