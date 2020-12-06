// Adapted from github.com/yaraht17/react-native-draggable-view/
import React, { Component } from 'react'
import { StyleSheet, View, Animated, PanResponder, Dimensions } from 'react-native'
import PropTypes from 'prop-types'

const SCREEN_HEIGHT = Dimensions.get('window').height

class DraggableView extends Component {
  constructor(props) {
    super(props)

    const upPos = -1 * SCREEN_HEIGHT
    const downPos = 0.0 // screen height - thingy size

    // const upPos = 0.0 * SCREEN_HEIGHT
    // const downPos = -0.0 * SCREEN_HEIGHT // screen height - thingy size

    this.state = {
      moveInitPosition: 0,
      position: new Animated.ValueXY(0, this.props.initialDrawerPos),
      drawerPosition: new Animated.Value(0),
      topPosition: upPos,
      downPosition: downPos,
      prevState: true, // true = top, false = down
      currState: true, // true = top, false = down
      objectHeight: SCREEN_HEIGHT,
    }

    this.state.position.y.setOffset(0)
    this.state.position.y.setValue(upPos)

    this._panGesture = PanResponder.create({
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        return (
          Math.abs(gestureState.dy) > Math.abs(gestureState.dx) && Math.abs(gestureState.dy) > 1
        )
      },
      onPanResponderGrant: (evt, gestureState) => {
        this.setState({ moveInitPosition: this.state.position.__getValue() })
        // console.log(this.state.currentState === true ? this.state.objectHeight : 0)
        // this.state.position.y.setOffset(this.state.currentState ? -this.state.objectHeight : 0)
      },
      onPanResponderMove: Animated.event([
        null,
        {
          dy: this.state.position.y,
        },
      ]),
      onPanResponderRelease: (evt, gestureState) => {
        const goingUp = gestureState.dy < 0 && gestureState.vy < 0
        const goingDown = gestureState.dy > 0 && gestureState.vy > 0
        if (goingUp) {
          console.log('goingUp')
          const dest = -this.state.objectHeight // this.state.topPosition
          Animated.spring(
            this.state.position.y, // Auto-multiplexed
            {
              toValue: dest,
              useNativeDriver: 'false',
            }, // Back to zero
          ).start(() => {
            this.state.position.y.setOffset(-this.state.objectHeight)
            Animated.spring(
              this.state.position.y, // Auto-multiplexed
              {
                toValue: 0,
                useNativeDriver: 'false',
              }, // Back to zero
            ).start(() => {
              // this.state.position.y.setValue(this.state.topPosition)
            })
          })
        } else if (goingDown) {
          console.log('goingDown')
          const dest = this.state.objectHeight
          Animated.spring(
            this.state.position.y, // Auto-multiplexed
            {
              toValue: dest,
              useNativeDriver: 'false',
            }, // Back to zero
          ).start(() => {
            this.state.position.y.setOffset(0)
            // this.state.position.y.setValue(this.state.topPosition)
          })
        } else if (!goingUp && !goingDown) {
          console.log('bounce')
          if (this.state.currentState == true) {
            // currently up
            console.log('bounceup')
            this.position.y.setOffset(-this.state.objectHeight)
          } else {
            console.log('bouncedown')
            // this.position.y.setOffset(0)
            // Animated.spring(
            //   this.state.position.y,
            //   {
            //     toValue: 0,
            //     useNativeDriver: 'false',
            //   }, // Back to zero
            // ).start()
          }
        }

        const destination = gestureState.dy > 0 ? this.state.downPosition : this.state.topPosition
        const destState = gestureState.dy > 0 ? false : true
        this.setState({ currentState: destState })
        // Animated.spring(
        //   this.state.position, // Auto-multiplexed
        //   {
        //     toValue: { x: 0, y: destination },
        //     useNativeDriver: 'false',
        //   }, // Back to zero
        // ).start()
        // this.state.position.y.setOffset(0)
      },
      // onPanResponderRelease: (evt, gestureState) => {
      //   this.setState({ moveInitPosition: 0 })
      //   this.moveFinished(gestureState)
      // },
    })
  }
  componentDidUpdate() {
    // console.log(this.state.moveInitPosition)
  }

  bounce() {
    console.log('FilterContainer.js - bounce!')
  }

  // open() {
  //   this.startAnimation(this.state.position, this.state.downPos, -100)
  //   this.props.onRelease && this.props.onRelease(true) // only add this line if you need to detect if the drawer is up or
  // }

  // close() {
  //   this.startAnimation(this.state.position, this.state.upPos, 100)
  //   this.props.onRelease && this.props.onRelease(true) // only add this line if you need to detect if the drawer is up or
  // }

  // startAnimation = (startPosition, endPosition, velocityY) => {
  //   const position = new Animated.Value(startPosition)
  //   position.removeAllListeners()

  //   Animated.timing(position, {
  //     toValue: endPosition,
  //     tension: 30,
  //     friction: 0,
  //     velocity: velocityY,
  //     useNativeDriver: 'false',
  //   }).start()

  //   position.addListener((position) => {
  //     this.onUpdatePosition(position.value)
  //   })
  // }

  // onUpdatePosition(position) {
  //   position = position + 50
  //   this.state.position.y.setValue(position)

  //   if (position === this.state.initialPosition) {
  //     this.props.onTopReached()
  //   }
  // }

  // moveFinished(gestureState) {
  //   const goingUp = gestureState.vy < 0
  //   const destination = goingUp ? this.state.topPosition : this.state.downPosition
  //   const fingerReleaseLocation = gestureState.dy + this.state.moveInitPosition

  //   this.startAnimation(fingerReleaseLocation, destination, gestureState.vy)
  //   this.props.onRelease(goingUp)
  // }

  render() {
    const containerView = this.props.renderContainerView()
    const drawerView = this.props.renderDrawerView()
    const header = this.props.renderHeader()

    // this.state.position.getTranslateTransform()

    return (
      <View style={styles.viewport}>
        <Animated.View
          style={[
            {
              translateY: this.state.position.y,
              perspective: 1000,
            },
            styles.drawer,
          ]}
          {...this._panGesture.panHandlers}
        >
          <View {...this._panGesture.panHandlers}>
            {drawerView}
            {header}
          </View>
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
    zIndex: 7,
    elevation: 7,
  },
  container: {
    width: '100%',
    position: 'absolute',
    top: 150,
    backgroundColor: 'blue',
    zIndex: 1,
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
  objectHeight: 300,
  onRelease: () => {},
  renderContainerView: () => {},
  renderDrawerView: () => {},
  renderHeader: () => {},
}

export default DraggableView
