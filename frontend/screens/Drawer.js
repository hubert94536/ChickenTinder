import React, { Component } from 'react'
import { Dimensions, StyleSheet, View, Animated, PanResponder } from 'react-native'
import PropTypes from 'prop-types'

const windowHeight = Dimensions.get('window').height

class Drawer extends Component {
  constructor(props) {
    super(props)

    const upPos = -1 * this.props.objectHeight
    const downPos = 0.0 // screen height - thingy size

    // true = top, false = down
    // Avoid state variables to avoid setState, which re-renders component
    this.currState = true

    this.state = {
      position: new Animated.Value(0, this.props.initialDrawerPos),
      closedPosition: upPos,
      openPosition: downPos,
      objectHeight: this.props.objectHeight,
      height: windowHeight - this.props.offset,
    }

    this.state.position.setOffset(0)
    this.state.position.setValue(upPos)

    this._panGesture = PanResponder.create({
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        // console.log('Drawer.js: tryGesture' + gestureState.moveY)
        return (
          this.props.enabled &&
          Math.abs(gestureState.dy) > Math.abs(gestureState.dx) &&
          Math.abs(gestureState.dy) > 1
        )
      },
      onPanResponderGrant: () => {
        if (this.currState == true) {
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
          this.currState = true
          Animated.spring(this.state.position, {
            toValue: this.state.closedPosition,
            useNativeDriver: 'false',
            speed: 12,
            bounciness: 12,
          }).start()
          this.props.onClose()
        } else if (goingDown) {
          this.currState = false
          Animated.spring(this.state.position, {
            toValue: this.state.openPosition,
            useNativeDriver: 'false',
          }).start()
          this.props.onOpen()
        } else if (!goingUp && !goingDown) {
          // console.log('filterContainer.js: bounce')
          Animated.spring(this.state.position, {
            toValue: this.currState ? this.state.closedPosition : this.state.openPosition,
            useNativeDriver: 'false',
          }).start()
        }
      },
    })
  }

  render() {
    const containerView = this.props.renderContainerView
    const drawerView = this.props.renderDrawerView

    return (
      <View
        style={[
          styles.viewport,
          {
            top: this.props.offset,
            height: this.state.height,
          },
        ]}
      >
        <View style={styles.container}>{containerView}</View>
        <Animated.View
          style={{
            opacity: this.state.position.interpolate({
              inputRange: [-this.state.objectHeight * 1, 0],
              outputRange: [0, 1],
              extrapolate: 'clamp',
            }),
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            elevation: 1,
            zIndex: 1,
          }}
          pointerEvents={'none'}
        >
          <View
            style={{
              position: 'absolute',
              top: 0,
              bottom: 0,
              left: 0,
              right: 0,
              elevation: 1,
              zIndex: 1,
              backgroundColor: 'rgba(42, 42, 42, 0.9)',
            }}
          ></View>
          {/* Blur looks very very nice but crashes when other 
              blurs are enabled due to a bug w/ BlurView package ): */}
          {/* <BlurView
            blurType="light"
            blurAmount={10}
            blurRadius={10}
            style={{
              position: 'absolute',
              top: 0,
              bottom: 0,
              left: 0,
              right: 0,
              elevation: 1,
              zIndex: 1,
            }}
          /> */}
        </Animated.View>

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
    height: '100%',
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
  renderContainerView: PropTypes.object,
  renderDrawerView: PropTypes.object,
  enabled: PropTypes.bool,
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
