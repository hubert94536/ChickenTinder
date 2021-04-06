import React from 'react'
import { Dimensions, Image, StyleSheet, TouchableWithoutFeedback, View } from 'react-native'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { setDisable, hideDisable } from '../redux/Actions.js'
import PropTypes from 'prop-types'

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
    this.props.setDisable()
    this.setState({ selected: true })
    this.props.press(this.state.photo)
    this.props.hideDisable()
  }

  render() {
    return (
      <TouchableWithoutFeedback onPress={() => this.handleClick()} disabled={this.props.disable}>
        <View style={styles.container}>
          <Image
            source={{ uri: Image.resolveAssetSource(this.props.image).uri }}
            style={[
              styles.picture,
              this.state.selected ? { borderColor: 'black' } : { borderColor: 'white' },
            ]}
          />
        </View>
      </TouchableWithoutFeedback>
    )
  }
}

const mapStateToProps = (state) => {
  const { disable } = state
  return { disable }
}

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      setDisable,
      hideDisable,
    },
    dispatch,
  )

export default connect(mapStateToProps, mapDispatchToProps)(ImageCard)

ImageCard.propTypes = {
  press: PropTypes.func,
  image: PropTypes.string,
  selected: PropTypes.bool,
  setDisable: PropTypes.func,
  hideDisable: PropTypes.func,
  disable: PropTypes.bool,
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
    borderWidth: 1,
  },
})
