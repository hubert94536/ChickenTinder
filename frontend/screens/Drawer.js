import React, { Component } from 'react'
import { StyleSheet, View, Animated, PanResponder } from 'react-native'
import PropTypes from 'prop-types'

class Drawer extends Component {
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
        // console.log('Drawer.js: tryGesture' + gestureState.moveY)
        return (
          Math.abs(gestureState.dy) > Math.abs(gestureState.dx) && Math.abs(gestureState.dy) > 1
        )
      },
      onPanResponderGrant: () => {
        if (this.state.currState == true) {
          this.state.position.setOffset(-this.state.objectHeight)
        } else {
          this.state.position.setOffset(0)
        }
      },
      onPanResponderMove: Animated.event(
        [
          null,
          {
            dy: this.state.position,
          },
        ],
        { useNativeDriver: false },
      ),
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
          // console.log('filterContainer.js: goingDown')
          this.setState({ currState: false })
          Animated.spring(this.state.position, {
            toValue: this.state.openPosition,
            useNativeDriver: 'false',
          }).start()
        } else if (!goingUp && !goingDown) {
          // console.log('filterContainer.js: bounce')
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

    return (
      <View
        style={[
          styles.viewport,
          {
            top: this.props.offset,
            height: '100%',
          },
        ]}
      >
        <View style={{ height: this.props.objectHeight + 40 }} {...this._panGesture.panHandlers}>
          <Animated.View
            style={[
              {
                translateY: this.state.position.interpolate({
                  inputRange: [-this.state.objectHeight * 1.1, 0],
                  outputRange: [-this.state.objectHeight * 1.1, 0],
                  extrapolate: 'clamp',
                }),
                perspective: 1000,
                height: '100%',
              },
              styles.drawer,
            ]}
            {...this._panGesture.panHandlers}
          >
            {drawerView}
          </Animated.View>
        </View>
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
    top: 0,
    backgroundColor: 'white',
    zIndex: 0,
    elevation: 0,
  },
})

Drawer.propTypes = {
  initialDrawerPos: PropTypes.number,
  finalDrawerPos: PropTypes.number,
  objectHeight: PropTypes.number,
  offset: PropTypes.number,
  onOpen: PropTypes.func,
  onClose: PropTypes.func,
  renderContainerView: PropTypes.func,
  renderDrawerView: PropTypes.func,
}

Drawer.defaultProps = {
  initialDrawerPos: 0,
  finalDrawerPos: 0,
  objectHeight: 600,
  offset: 0,
  onOpen: () => {},
  onClose: () => {},
  renderContainerView: () => {},
  renderDrawerView: () => {},
}

export default Drawer
