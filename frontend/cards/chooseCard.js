import React from 'react'
import { Text, View, Image } from 'react-native'
import { TouchableHighlight } from 'react-native-gesture-handler'
import AntDesign from 'react-native-vector-icons/AntDesign'
import PropTypes from 'prop-types'
import socket from '../apis/socket.js'
import imgStyles from '../../styles/cardImage.js'

const font = 'CircularStd-Medium'
const hex = '#F15763'

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
          style={[imgStyles.button, {marginTop: '3%'}]}
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
          <Text style={{ fontFamily: font, color: hex }}>@{this.props.username}</Text>
        </View>
        {this.state.added && (
          <View style={{ flexDirection: 'row', flex: 1, justifyContent: 'flex-end' }}>
            <Text style={[imgStyles.text, { color: '#6A6A6A', marginRight: '8%' }]}>Added!</Text>
          </View>
        )}
        {!this.state.added && (
          <TouchableHighlight>
            <View style={{ flexDirection: 'row', flex: 1, justifyContent: 'flex-end' }}>
              <Text style={[imgStyles.text, { marginTop: '10%' }]}>Add</Text>
              <AntDesign
                style={[imgStyles.icon, { margin: '10%', marginTop: '20%', fontSize: 25 }]}
                name="pluscircleo"
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
