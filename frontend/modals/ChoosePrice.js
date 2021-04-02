import React from 'react'
import { Dimensions, Modal, StyleSheet, Text, TouchableHighlight, View } from 'react-native'
import PropTypes from 'prop-types'
import ButtonSwitch from './ButtonSwitch.js'
import colors from '../../styles/colors.js'
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
    }
  }

  // function called when main button is pressed
  handlePress() {
    let prices = this.state.selectedPrice
      .map((item) => item.length)
      .sort()
      .toString()
    this.props.press(prices)
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
            <Text style={[screenStyles.text, modalStyles.titleText]}>Price</Text>
            <Text style={[screenStyles.text, styles.black]}>Select your ideal price range</Text>
            <View style={modalStyles.error}>
              <View style={styles.filterGroupContainer}>
                <View style={{ flexDirection: 'row' }}>
                  <Text style={styles.filterSubtext}>Select all that apply</Text>
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
                    this.setState({ selectedPrice: priceArr }, () =>
                      console.log('price array: ' + this.state.selectedPrice),
                    )
                  }}
                />
              </View>
            </View>
            {this.state.invalidPrice && (
              <View style={[modalStyles.error, styles.errorMargin]}>
                <Icon name="exclamationcircle" color={colors.hex} style={modalStyles.errorIcon} />
                <Text style={[screenStyles.text, modalStyles.errorText]}>
                  Invalid time. Please try again
                </Text>
              </View>
            )}
            {!this.state.invalidPrice && (
              <View style={[modalStyles.error, styles.errorMargin]}>
                <Text style={[screenStyles.text, modalStyles.errorText]}> </Text>
              </View>
            )}
            <TouchableHighlight
              style={[modalStyles.doneButton, styles.doneButtonMargin]}
              onPress={() => this.evaluate()}
            >
              <Text style={[screenStyles.text, modalStyles.doneText]}>Done</Text>
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
  errorMargin: {
    marginTop: '3%',
  },
  doneButtonMargin: {
    marginTop: '5%',
  },
})

Price.propTypes = {
  press: PropTypes.func,
  cancel: PropTypes.func,
  visible: PropTypes.bool,
}
