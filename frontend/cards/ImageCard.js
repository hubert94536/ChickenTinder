import React from 'react'
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableHighlight,
  TouchableWithoutFeedback,
  View,
} from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome'
import PropTypes from 'prop-types'
import colors from '../../styles/colors.js'
import imgStyles from '../../styles/cardImage.js'
import normalize from '../../styles/normalize.js'
import socket from '../apis/socket.js'
import AntDesign from 'react-native-vector-icons/AntDesign'

const width = Dimensions.get('window').width

export default class ImageCard extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      photo: this.props.image,
      confirmPressed: false,
      deletePressed: false,
      disabled: false,
      selected: this.props.selected,
    }
  }

  handleClick() {
    this.setState({ disabled: true })
    this.setState({ selected: true })
    this.props.press(this.state.photo)
    this.setState({ disabled: false })
    
  }

  render() {
    return (
      <TouchableWithoutFeedback onPress={() => this.handleClick()} disabled={this.state.disabled}>
        <View style={styles.container}>
          <Image
            source={{ uri: Image.resolveAssetSource(this.props.image).uri }}
            style={[styles.picture,  this.state.selected ? {borderColor: 'black'} : {borderColor: 'white'}]}
          />
        </View>
      </TouchableWithoutFeedback>
    )
  }
}

ImageCard.propTypes = {
  press: PropTypes.func,
  image: PropTypes.string,
  selected: PropTypes.bool,
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flex: 1,
  },
  picture: {
    borderRadius: 5,
    height: width * 0.135,
    width: width * 0.135,
    borderWidth: 1
  },
  
})
