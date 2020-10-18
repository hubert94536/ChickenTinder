import React from 'react'
import { StyleSheet, View } from 'react-native'
import PropTypes from 'prop-types';
import BackgroundButton from './backgroundButton.js'

const hex = '#F25763'

TagsView.propTypes = {
  selected: PropTypes.array,
  onChange: PropTypes.func,
  isExclusive: PropTypes.bool,
  all: PropTypes.array
}

export default class TagsView extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      selected: this.props.selected,
    }
  }

  addOrRemove(array, item) {
    const exists = array.includes(item)
    if (exists) {
      return array.filter((c) => {
        return c !== item
      })
    } else {
      const result = array
      result.push(item)
      return result
    }
  }

  handleUpdate(newTags) {
    // console.log(newTags)
    this.props.onChange(newTags)
  }

  render() {
    return <View style={styles.container}>{this.makeButtons()}</View>
  }

  onPress(tag) {
    let chosen
    if (this.props.isExclusive) {
      chosen = [tag]
      this.setState({
        selected: chosen
      })
      this.handleUpdate(chosen)
    } else {
      chosen = this.addOrRemove(this.state.selected, tag)
      this.setState({
        selected: chosen
      })
      this.handleUpdate(chosen)
    }
  }

  makeButtons() {
    return this.props.all.map((tag, i) => {
      const on = this.state.selected.includes(tag)
      const backgroundColor = on ? hex : 'white'
      const textColor = on ? 'white' : hex
      const borderColor = on ? 'white' : hex
      return (
        <BackgroundButton
          backgroundColor={backgroundColor}
          textColor={textColor}
          borderColor={borderColor}
          onPress={() => {
            this.onPress(tag)
          }}
          key={i}
          showImage={on}
          title={tag}
        />
      )
    })
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingVertical: 5,
  },
})
