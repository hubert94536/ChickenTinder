// Adapted from github.com/yaraht17/react-native-draggable-view/
import React, { Component } from 'react'
import { StyleSheet, View, Animated, PanResponder, Dimensions, } from 'react-native'
import PropTypes from 'prop-types'

const SCREEN_HEIGHT = Dimensions.get('window').height

class DraggableView extends Component {
  constructor(props) {
    super(props)
    const initialUsedSpace = Math.abs(this.props.initialDrawerSize)

    const downPos = 0.0 // screen height - thingy size
    const upPos = -1 * SCREEN_HEIGHT

    this._panGesture = PanResponder.create({
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        return this.isValidMovement(gestureState.dx, gestureState.dy)
      },
      onPanResponderMove: (evt, gestureState) => {
        // console.log('ypos: ' + gestureState.moveY)
        this.moveDrawerView(gestureState)
      },
      onPanResponderRelease: (evt, gestureState) => {
        this.moveFinished(gestureState)
      },
    })

    this.state = {
      position: new Animated.Value(this.props.finalDrawerHeight),
      initialPositon: downPos,
      finalPosition: upPos,
      initialUsedSpace: initialUsedSpace,
    }

    this.state.position.setValue(-1 * SCREEN_HEIGHT)
  }

  componentDidUpdate(nextProps) {
    const autoDrawerUp = this.props.autoDrawerUp

    const autoDrawerUpSuccess =
      autoDrawerUp !== nextProps.autoDrawerUp && nextProps.autoDrawerUp === 1

    if (autoDrawerUpSuccess) {
      setTimeout(() => {
        this.moveFinishedUpper()
      }, 1000)
    }
  }

  open() {
    this.startAnimation(-100, 500, this.state.initialPositon, null, this.state.finalPosition)
    this.props.onRelease && this.props.onRelease(true) // only add this line if you need to detect if the drawer is up or not
  }

  //   close () {
  //     this.startAnimation(-90, 100, this.state.finalPosition, null, this.state.initialPositon)
  //     this.props.onRelease && this.props.onRelease(true) // only add this line if you need to detect if the drawer is up or not
  //   }

  isValidMovement = (distanceX, distanceY) => {
    const moveTravelledFarEnough =
      Math.abs(distanceY) > Math.abs(distanceX) && Math.abs(distanceY) > 5
    return moveTravelledFarEnough
  }

  startAnimation = (velocityY, positionY, initialPositon, id, finalPosition) => {
    const isGoingUp = velocityY > 0
    const endPosition = isGoingUp ? initialPositon + 50 : finalPosition + 50

    const position = new Animated.Value(positionY)
    position.removeAllListeners()

    Animated.timing(position, {
      toValue: endPosition,
      tension: 30,
      friction: 0,
      velocity: velocityY,
      useNativeDriver: true,
    }).start()

    position.addListener((position) => {
      this.onUpdatePosition(position.value)
    })
  }

  onUpdatePosition(position) {
    position = position - 50
    this.state.position.setValue(position)
    this._previousTop = position
    const { initialPosition } = this.state

    if (initialPosition === position) {
      this.props.onInitialPositionReached()
    }
  }

  moveDrawerView(gestureState) {
    // Grab "location" of dropdown
    const position = gestureState.moveY - SCREEN_HEIGHT * 1.1
    this.onUpdatePosition(position)
  }

  moveFinished(gestureState) {
    const isGoingUp = gestureState.vy < 0
    const releaseLocation = gestureState.moveY - SCREEN_HEIGHT * 1.1

    this.startAnimation(
      gestureState.vy,
      releaseLocation,
      this.state.initialPositon,
      gestureState.stateId,
      this.state.finalPosition,
    )
    this.props.onRelease(isGoingUp)
  }

  moveFinishedUpper() {

    this.startAnimation(-10, 0, this.state.initialPositon, 0, this.state.finalPosition)
    this.props.onRelease && this.props.onRelease(true)
  }

  render() {
    const containerView = this.props.renderContainerView()
    const drawerView = this.props.renderDrawerView()
    const header = this.props.renderHeader()
    const drawerPosition = {
      top: this.state.position,
    }

    return (
      <View style={styles.viewport}>
        <Animated.View style={[drawerPosition, styles.drawer]} {...this._panGesture.panHandlers}>
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
  drawerBg: PropTypes.string,
  finalDrawerHeight: PropTypes.number,
  onInitialPositionReached: PropTypes.func,
  onRelease: PropTypes.func,
  renderContainerView: PropTypes.func,
  renderDrawerView: PropTypes.func,
  renderHeader: PropTypes.func,
  autoDrawerUp: PropTypes.bool,
  initialDrawerSize: PropTypes.number,
  retractColor: PropTypes.string,
  expandColor: PropTypes.string,
}

DraggableView.defaultProps = {
  drawerBg: 'white',
  finalDrawerHeight: 0,
  onInitialPositionReached: () => {},
  onRelease: () => {},
  renderContainerView: () => {},
  renderDrawerView: () => {},
  renderHeader: () => {},
}

export default DraggableView
