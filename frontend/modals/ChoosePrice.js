import React from 'react'
import {
  Dimensions,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableHighlight,
  View,
} from 'react-native'
import PropTypes from 'prop-types'
// import { Switch } from 'react-native-switch'
import colors from '../../styles/colors.js'
import modalStyles from '../../styles/modalStyles.js'
import normalize from '../../styles/normalize.js'
import screenStyles from '../../styles/screenStyles.js'
import TagsView from '../TagsView.js'
import Icon from 'react-native-vector-icons/AntDesign'
import _ from 'lodash'

const tagsPrice = ['$', '$$', '$$$', '$$$$']

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
            <Text style={[screenStyles.text, styles.black]}>Select a target price</Text>
          </View>
          <View style={styles.filterGroupContainer}>
            <TagsView
              ACCENT_COLOR={colors.hex}
              TEXT_COLOR={colors.hex}
              all={tagsPrice}
              selected={this.state.selectedPrice}
              isExclusive={false}
              onChange={(event) => this.setState({ selectedPrice: event })}
            />
          </View>
          <TouchableHighlight style={[modalStyles.doneButton]} onPress={() => this.evaluate()}>
            <Text style={[screenStyles.text, modalStyles.doneText]}>Done</Text>
          </TouchableHighlight>
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
    height: '20%',
    alignSelf: 'center',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
})

Price.propTypes = {
  press: PropTypes.func,
  cancel: PropTypes.func,
  visible: PropTypes.bool,
}
