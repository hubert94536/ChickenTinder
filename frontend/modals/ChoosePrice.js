import React from 'react'
import { Dimensions, Modal, StyleSheet, Text, TouchableHighlight, View } from 'react-native'
import PropTypes from 'prop-types'
import ButtonSwitch from './ButtonSwitch.js'
import modalStyles from '../../styles/modalStyles.js'
import normalize from '../../styles/normalize.js'
import screenStyles from '../../styles/screenStyles.js'
import Icon from 'react-native-vector-icons/AntDesign'
import _ from 'lodash'

export default class Price extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      selectedPrice: [],
      pressed: false,
    }
  }

  // function called when main button is pressed
  handlePress() {
    let prices = this.state.selectedPrice
      .map((item) => item.length)
      .sort()
      .toString()
    if (prices !== '') this.props.press(prices)
  }

  //  function called when 'x' is pressed
  handleCancel() {
    this.props.cancel(true)
  }

  evaluate = _.debounce(this.handlePress.bind(this), 200)

  render() {
    return (
      <Modal animationType="fade" transparent visible={this.props.visible}>
        <View style={[styles.mainContainerHeight, modalStyles.mainContainer]}>
          <Icon
            name="closecircleo"
            style={[screenStyles.text, modalStyles.closeIcon]}
            onPress={() => this.handleCancel()}
          />
          <View style={modalStyles.titleContainer}>
            <Text style={[screenStyles.text, modalStyles.titleText, styles.heading]}>Price</Text>
            <Text style={[screenStyles.text, styles.black, styles.heading]}>
              Select your ideal price range
            </Text>
            <View style={modalStyles.error}>
              <View style={styles.filterGroupContainer}>
                <View style={{ flexDirection: 'row' }}>
                  <Text style={styles.selectMargin}>Select all that apply</Text>
                </View>
                <ButtonSwitch
                  text1="$"
                  text2="$$"
                  text3="$$$"
                  text4="$$$$"
                  value1="$"
                  value2="$$"
                  value3="$$$"
                  value4="$$$$"
                  selectMultiple={true}
                  onValueChange={(priceArr) => {
                    this.setState({ selectedPrice: priceArr })
                  }}
                />
              </View>
            </View>
            <TouchableHighlight
              onShowUnderlay={() => this.setState({ pressed: true })}
              onHideUnderlay={() => this.setState({ pressed: false })}
              underlayColor="white"
              style={[modalStyles.doneButton, styles.doneButtonMargin]}
              onPress={() => this.evaluate()}
            >
              <Text
                style={[
                  screenStyles.text,
                  modalStyles.doneText,
                  this.state.pressed ? screenStyles.hex : screenStyles.white,
                ]}
              >
                Done
              </Text>
            </TouchableHighlight>
          </View>
        </View>
      </Modal>
    )
  }
}

const styles = StyleSheet.create({
  mainContainerHeight: {
    height: Dimensions.get('window').height * 0.3,
  },
  black: {
    color: 'black',
  },
  colon: {
    fontSize: normalize(20),
    marginRight: '2%',
    marginLeft: '2%',
  },
  filterGroupContainer: {
    marginLeft: '5%',
    marginRight: '5%',
    flex: 1,
    justifyContent: 'flex-start',
  },
  heading: {
    marginLeft: '5%',
  },
  doneButtonMargin: {
    marginTop: '6%',
  },
  selectMargin: {
    marginBottom: '4%',
  },
})

Price.propTypes = {
  press: PropTypes.func,
  cancel: PropTypes.func,
  visible: PropTypes.bool,
}
