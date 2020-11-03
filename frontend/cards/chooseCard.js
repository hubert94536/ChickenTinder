import React from 'react'
import { Text, View, Image } from 'react-native'
import { TouchableHighlight } from 'react-native-gesture-handler'
import Icon from 'react-native-vector-icons/FontAwesome'
import PropTypes from 'prop-types'
import socket from '../apis/socket.js'
import imgStyles from '../../styles/cardImage.js'

<<<<<<< HEAD
const hex = '#F25763'
=======
>>>>>>> 2f056d0839be22e82bf47a4158918c952bf3b43c
const font = 'CircularStd-Medium'

//  cards for when you're choosing friends for your group
export default class ChooseCard extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      added: this.props.added,
      pressed: false,
    }
  }

  sendInvite() {
    socket.sendInvite(this.props.username)
    this.setState({ added: true })
  }

  render() {
    return (
      <View style={{ flexDirection: 'row', flex: 1 }}>
        <Image
          source={{
            uri: this.props.image,
          }}
          style={imgStyles.button}
        />
        <View
          style={{
            alignSelf: 'center',
            marginLeft: '1%',
            flex: 1,
          }}
        >
          <Text style={{ fontFamily: font, fontWeight: 'bold', fontSize: 15 }}>
            {this.props.name}
          </Text>
          <Text style={{ fontFamily: font }}>@{this.props.username}</Text>
        </View>
        {this.state.added && (
          <View style={{ flexDirection: 'row', flex: 1, justifyContent: 'flex-end' }}>
            <Text style={imgStyles.text}>Added</Text>
            <Icon style={[imgStyles.icon, { margin: '8%' }]} name="check-circle" />
          </View>
        )}
        {!this.state.added && (
          <TouchableHighlight>
            <View style={{ flexDirection: 'row', flex: 1, justifyContent: 'flex-end' }}>
              <Text style={imgStyles.text}>Add</Text>
              <Icon
                style={[imgStyles.icon, { margin: '8%' }]}
                name="plus-circle"
                onPress={() => {
                  this.setState({ added: true })
                  this.sendInvite()
                }}
              />
            </View>
          </TouchableHighlight>
        )}
      </View>
    )
  }
}

ChooseCard.propTypes = {
  added: PropTypes.bool,
  username: PropTypes.string,
  image: PropTypes.string,
  name: PropTypes.string,
}
