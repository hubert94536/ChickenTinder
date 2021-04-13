import PropTypes from 'prop-types'
import React from 'react'
import { Dimensions, Image, StyleSheet, TouchableWithoutFeedback, View } from 'react-native'
import colors from '../../styles/colors.js'

const width = Dimensions.get('window').width

class ImageCard extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      photo: this.props.image,
      confirmPressed: false,
      deletePressed: false,
      selected: this.props.selected,
    }
  }

  handleClick() {
    this.setState({ selected: true })
    this.props.press(this.state.photo)
  }

  render() {
    return (
      <TouchableWithoutFeedback onPress={() => this.handleClick()} >
        <View style={styles.container}>
          <Image
            source={{ uri: Image.resolveAssetSource(this.props.image).uri }}
            style={[
              styles.picture,
              this.state.selected ? { borderColor: colors.hex } : { borderColor: 'white' },
            ]}
          />
        </View>
      </TouchableWithoutFeedback>
    )
  }
}

export default ImageCard

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
    borderWidth: 2,
  },
})
