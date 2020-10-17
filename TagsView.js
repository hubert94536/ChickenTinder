import React from 'react'
import { StyleSheet, View } from 'react-native'
import { addOrRemove } from './addOrRemove'
import BackgroundButton from './BackgroundButton'

const hex = '#F25763'

export default class TagsView extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      selected: this.props.selected,
    }
  }

  handleUpdate (newTags) {
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
      chosen = addOrRemove(this.state.selected, tag)
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
