// Adapted from github.com/yaraht17/react-native-draggable-view/
import React, { Component } from 'react'
import { StyleSheet, View, Animated, PanResponder, Dimensions } from 'react-native'
import PropTypes from 'prop-types'

const SCREEN_HEIGHT = Dimensions.get('window').height

class DraggableView extends Component {
  constructor(props) {
    super(props)

    const upPos = -1 * this.props.objectHeight
    const downPos = 0.0 // screen height - thingy size

    this.state = {
      position: new Animated.Value(0, this.props.initialDrawerPos),
      closedPosition: upPos,
      openPosition: downPos,
      currState: true, // true = top, false = down
      objectHeight: this.props.objectHeight,
    }

    this.state.position.setOffset(0)
    this.state.position.setValue(upPos)

    this._panGesture = PanResponder.create({
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        return (
          Math.abs(gestureState.dy) > Math.abs(gestureState.dx) && Math.abs(gestureState.dy) > 1
        )
      },
      onPanResponderGrant: (evt, gestureState) => {
        if (this.state.currState == true) {
          // is currently top - hidden
          this.state.position.setOffset(-this.state.objectHeight)
        } else {
          // is currently bottom - shown
          console.log('currbot')
          this.state.position.setOffset(0)
        }
      },
      onPanResponderMove: Animated.event([
        null,
        {
          dy: this.state.position,
        },
      ]),
      onPanResponderRelease: (evt, gestureState) => {
        this.state.position.flattenOffset()
        const goingUp = gestureState.dy < 0 && gestureState.vy < 0
        const goingDown = gestureState.dy > 0 && gestureState.vy > 0
        if (goingUp) {
          this.setState({ currState: true })
          Animated.spring(this.state.position, {
            toValue: this.state.closedPosition,
            useNativeDriver: 'false',
          }).start()
        } else if (goingDown) {
          console.log('goingDown')
          this.setState({ currState: false })
          Animated.spring(this.state.position, {
            toValue: this.state.openPosition,
            useNativeDriver: 'false',
          }).start()
        } else if (!goingUp && !goingDown) {
          console.log('bounce')
          Animated.spring(this.state.position, {
            toValue: this.state.currentState ? this.state.closedPosition : this.state.openPosition,
            useNativeDriver: 'false',
          }).start()
        }
      },
    })
  }

  render() {
    const containerView = this.props.renderContainerView()
    const drawerView = this.props.renderDrawerView()
    const header = this.props.renderHeader()

    return (
      <View style={styles.viewport}>
        <View>{header}</View>
        <Animated.View
          style={[
            {
              translateY: this.state.position.interpolate({
                inputRange: [-this.state.objectHeight * 1.1, 0],
                outputRange: [-this.state.objectHeight * 1.1, 0],
                extrapolate: 'clamp',
              }),
              perspective: 1000,
            },
            styles.drawer,
          ]}
          {...this._panGesture.panHandlers}
        >
          <View>{drawerView}</View>
        </Animated.View>
        <View style={styles.container}>{containerView}</View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  viewport: {
    flexDirection: 'column',
  },
  drawer: {
    zIndex: 1,
    elevation: 1,
    // display: 'none',
  },
  container: {
    width: '100%',
    position: 'absolute',
    top: 150,
    backgroundColor: 'blue',
    zIndex: 0,
    elevation: 0,
  },
  header: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    width: '100%',
    height: 200,
    zIndex: 3,
    elevation: 3,
    backgroundColor: 'yellow',
  },
})

DraggableView.propTypes = {
  initialDrawerPos: PropTypes.number,
  finalDrawerPos: PropTypes.number,
  objectHeight: PropTypes.number,
  onTopReached: PropTypes.func,
  onRelease: PropTypes.func,
  renderContainerView: PropTypes.func,
  renderDrawerView: PropTypes.func,
  renderHeader: PropTypes.func,
}

DraggableView.defaultProps = {
  initialDrawerPos: 0,
  finalDrawerPos: 0,
  objectHeight: 600,
  onRelease: () => {},
  renderContainerView: () => {},
  renderDrawerView: () => {},
  renderHeader: () => {},
}

export default DraggableView
