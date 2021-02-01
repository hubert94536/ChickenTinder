import React, { Component } from 'react'
import { StyleSheet, View, Text, TouchableHighlight, Modal } from 'react-native'
import PropTypes from 'prop-types'
import colors from '../../styles/colors.js'
import modalStyles from '../../styles/modalStyles.js'
import normalize from '../../styles/normalize.js'
import screenStyles from '../../styles/screenStyles.js'
import AntDesign from 'react-native-vector-icons/AntDesign'

const font = 'CircularStd-Medium'

export default class Alert extends Component {
  constructor(props) {
    super(props)
    this.state = {
      affPressed: false,
      negPressed: false,
    }
  }

  // function called when main button is pressed
  handlePress() {
    this.props.press()
  }

  //  function called when 'x' is pressed
  handleCancel() {
    this.props.cancel()
  }

  render() {
    return (
      <View style={styles.main}>
        <Text />
        <Modal transparent animationType="none" visible={this.props.visible}>
          <View style={[modalStyles.modal, { height: this.props.height }]}>
            <View style={modalStyles.topRightIcon}>
              <AntDesign
                name="closecircleo"
                style={modalStyles.icon}
                onPress={() => this.handleCancel()}
              />
            </View>
            <View style={styles.modalContent}>
              <View style={styles.textMargin}>
                <Text style={[styles.title, screenStyles.hex]}>{this.props.title}</Text>
                <Text style={styles.body}>{this.props.body}</Text>
              </View>
              <View style={modalStyles.justifyCenter}>
                <TouchableHighlight
                  underlayColor={screenStyles.hex.color}
                  onHideUnderlay={() => this.setState({ affPressed: false })}
                  onShowUnderlay={() => this.setState({ affPressed: true })}
                  onPress={() => this.handlePress()}
                  style={[modalStyles.button, styles.buttonMargin]}
                >
                  <Text
                    style={[
                      modalStyles.text,
                      this.state.affPressed ? styles.white : screenStyles.hex,
                    ]}
                  >
                    {this.props.buttonAff}
                  </Text>
                </TouchableHighlight>
                {this.props.twoButton && (
                  <TouchableHighlight
                    underlayColor={'white'}
                    onHideUnderlay={() => this.setState({ negPressed: false })}
                    onShowUnderlay={() => this.setState({ negPressed: true })}
                    onPress={() => this.handleCancel()}
                    style={[modalStyles.button, styles.buttonMargin, styles.bgHex]}
                  >
                    <Text
                      style={[
                        modalStyles.text,
                        this.state.negPressed ? screenStyles.hex : styles.white,
                      ]}
                    >
                      {this.props.buttonNeg}
                    </Text>
                  </TouchableHighlight>
                )}
              </View>
            </View>
          </View>
        </Modal>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  main: { position: 'absolute' },
  title: {
    fontFamily: font,
    fontWeight: 'bold',
    fontSize: normalize(20),
    marginBottom: '3%',
  },
  body: {
    fontFamily: font,
    fontSize: normalize(15.5),
    marginLeft: '2%',
  },
  modalContent: {
    flexDirection: 'column',
    flex: 1,
    justifyContent: 'space-evenly',
  },
  textMargin: {
    marginLeft: '10%',
    marginRight: '10%',
  },
  buttonMargin: {
    marginBottom: '3%',
  },
  bgHex: {
    backgroundColor: colors.hex,
  },
  white: {
    color: 'white',
  },
})

Alert.propTypes = {
  press: PropTypes.func,
  cancel: PropTypes.func,
  twoButton: PropTypes.bool,
  title: PropTypes.string,
  body: PropTypes.string,
  height: PropTypes.string,
  buttonAff: PropTypes.string,
  buttonNeg: PropTypes.string,
  visible: PropTypes.bool,
}

Alert.defaultProps = {
  visible: true,
}
