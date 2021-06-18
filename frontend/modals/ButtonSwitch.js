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
      selectedIndexes: this.props.multiSelect,
    }
    this.updateIndex = this.updateIndex.bind(this)
  }

  updateIndex(selectedIndex) {
    // If allow users to select multiple buttons (ie. price)
    if (this.props.selectMultiple) {
      this.setState({ selectedIndexes: selectedIndex }, () => {
        this.props.onValueChange(this.state.selectedIndexes)
      })
    } else {
      this.props.onValueChange(this.props.values[selectedIndex])
    }
  }

  render() {
    const buttons = this.props.texts
    if (buttons.length > 3) groupWidth = styles.containerWidth4
    else if (buttons.length == 3) groupWidth = styles.containerWidth3
    else groupWidth = styles.containerWidth2
    return (
      <ButtonGroup
        onPress={this.updateIndex}
        selectedIndex={this.props.select}
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
    height: normalize(42),
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.hex,
  },
  containerWidth2: {
    width: normalize(80),
  },
  containerWidth3: {
    width: normalize(120),
  },
  containerWidth4: {
    width: normalize(200),
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
  texts: PropTypes.array,
  values: PropTypes.array,
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
  multiSelect: PropTypes.array,
  select: PropTypes.number,
}
