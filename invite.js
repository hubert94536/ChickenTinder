import React from 'react'
import { Image, Modal, StyleSheet, Text, TouchableHighlight, View } from 'react-native'
import { BlurView } from '@react-native-community/blur'
import Icon from 'react-native-vector-icons/FontAwesome'
import socket from './socket.js'

const hex = '#F25763'
const font = 'CircularStd-Medium'
//  props are name, image url, and functions for cancel and go
// invite alert
export default class Invite extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      pressed: false,
    }
  }

  handleAccept() {
    socket.joinRoom(this.props.username)
  }

  handleCancel() {
    socket.declineInvite(this.props.username)
  }

  render() {
    return (
      <View>
        <Text />
        <BlurView
          blurType="light"
          blurAmount={20}
          reducedTransparencyFallbackColor="white"
          style={{ position: 'absolute', top: 0, bottom: 0, left: 0, right: 0 }}
        />
        <Modal transparent animationType="none">
          <View style={styles.modal}>
            <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
              <Icon name="times-circle" style={styles.icon} onPress={() => this.handleCancel()} />
            </View>
            <View
              style={{
                flex: 1,
                justifyContent: 'space-evenly',
              }}
            >
              <View style={{ flexDirection: 'row', justifyContent: 'space-evenly' }}>
                <Image source={{ uri: this.props.image }} style={styles.avatar} />
                <View>
                  <Text
                    style={{
                      fontFamily: font,
                      color: hex,
                      fontSize: 25,
                    }}
                  >
                    {this.props.name}
                  </Text>
                  <Text
                    style={{
                      fontFamily: font,
                      color: hex,
                      fontSize: 25,
                    }}
                  >
                    invites you to join!
                  </Text>
                </View>
              </View>
              <TouchableHighlight
                underlayColor={hex}
                onHideUnderlay={() => this.setState({ pressed: false })}
                onShowUnderlay={() => this.setState({ pressed: true })}
                onPress={() => this.handleAccept()}
                style={{
                  borderColor: hex,
                  borderWidth: 2.5,
                  borderRadius: 60,
                  width: '50%',
                  alignSelf: 'center',
                }}
              >
                <Text style={this.state.pressed ? styles.textPressed : styles.text}>Go</Text>
              </TouchableHighlight>
            </View>
          </View>
        </Modal>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  icon: {
    fontFamily: font,
    color: hex,
    marginTop: '5%',
    marginRight: '5%',
    fontSize: 30,
  },
  modal: {
    flex: 1,
    justifyContent: 'space-evenly',
    width: '80%',
    margin: '3%',
    backgroundColor: 'white',
    alignSelf: 'center',
    borderRadius: 40,
    elevation: 20,
    // margin: '50%'
  },
  text: {
    fontFamily: font,
    color: hex,
    fontSize: 20,
    paddingTop: '5%',
    paddingBottom: '5%',
    textAlign: 'center',
  },
  textPressed: {
    fontFamily: font,
    color: 'white',
    fontSize: 20,
    paddingTop: '5%',
    paddingBottom: '5%',
    textAlign: 'center',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 63,
    borderWidth: 4,
  },
})
