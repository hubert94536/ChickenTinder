// // import * as React from "react"
// // import { View, Text, TouchableOpacity, Dimensions } from "react-native"
// // import Tab from "./Tab.js"

// // const height = Dimensions.get('window').height
// // const width = Dimensions.get('window').width

// // const TabBar = (props) => {
// //   const { navigationState, navigation, position } = props
// //   return (
// //     <View style={{
// //       backgroundColor: '#fff2f2',
// //       height: height*0.07,
// //       flexDirection: "row",
// //       justifyContent: 'space-around',
// //       margin:'3%',
// //       borderRadius: 10
// //     }}>
// //       <TouchableOpacity >
// //         <Text style={{fontFamily:'CircularStd-Bold', color:'black' }}>Navigation</Text>
// //       </TouchableOpacity>
// //     </View>
// //   )
// // }

// // export default TabBar

// import * as React from "react"
// import { View, Text, TouchableOpacity } from "react-native"
// import Tab from "./Tab"

// const TabBar = (props) => {
//   const { navigationState, navigation, position } = props
//   return (
//     <View style={{
//       height: 80,
//       backgroundColor: 'seashell',
//       flexDirection: "row",
//       justifyContent: 'space-around',
//       alignItems: 'center',
//     }}>
//       {navigationState.routes.map((route, index) => {
//         return (
//           <Tab
//             key={route.routeName}
//             title={route.routeName}
//             onPress={() => navigation.navigate(route.routeName)}
//           />
//         )
//       })}
//       <TouchableOpacity onPress={() => {
//         // toggle drawer or dispatch any other arbitrary action
//         alert("You pressed the menu button!")
//       }}>
//         <Text>🍔</Text>
//       </TouchableOpacity>
//     </View>
//   )
// }

// export default TabBar

import React from 'react'
import PropTypes from 'prop-types'
import { SafeAreaView, TouchableOpacity, View, StyleSheet } from 'react-native'

const TABBAR_HEIGHT = 49

const MultiBar = ({ navigation, activeTintColor, inactiveTintColor, renderIcon, jumpTo }) => {
  const { index, routes } = navigation.state

  return (
    <SafeAreaView>
      <View style={Styles.tabBarContentStyle} />
      <View pointerEvents="box-none" style={Styles.content}>
        {routes.map((route, idx) => {
          const focused = index === idx

          if (!route.params || !route.params.navigationDisabled) {
            return (
              <TabIcon
                key={route.key}
                route={route}
                renderIcon={renderIcon}
                focused={focused}
                activeTintColor={activeTintColor}
                inactiveTintColor={inactiveTintColor}
                onPress={() =>
                  (!route.params || !route.params.navigationDisabled) && jumpTo(route.key)
                }
              />
            )
          }

          const Icon = renderIcon({
            route,
            focused,
            tintColor: focused ? activeTintColor : inactiveTintColor,
          })

          return {
            ...Icon,
            key: 'simple',
          }
        })}
      </View>
    </SafeAreaView>
  )
}

MultiBar.propTypes = {
  navigation: PropTypes.object.isRequired,
  renderIcon: PropTypes.func.isRequired,
  jumpTo: PropTypes.func.isRequired,
  activeTintColor: PropTypes.string,
  inactiveTintColor: PropTypes.string,
}

const TabIcon = ({ route, renderIcon, focused, activeTintColor, inactiveTintColor, onPress }) => (
  <TouchableOpacity style={Styles.tabStyle} onPress={() => onPress && onPress()}>
    {renderIcon({
      route,
      focused,
      tintColor: focused ? activeTintColor : inactiveTintColor,
    })}
  </TouchableOpacity>
)

TabIcon.propTypes = {
  route: PropTypes.object.isRequired,
  renderIcon: PropTypes.func.isRequired,
  activeTintColor: PropTypes.string.isRequired,
  inactiveTintColor: PropTypes.string.isRequired,
  focused: PropTypes.bool,
  onPress: PropTypes.func,
}

TabIcon.defaultProps = {
  focused: false,
}

const Styles = {
  container: {
    bottom: 0,
    width: '100%',
    justifyContent: 'flex-end',
  },
  tabBarContentStyle: {
    height: TABBAR_HEIGHT,
    backgroundColor: '#fff',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(0, 0, 0, .3)',
  },
  content: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'space-between',
  },
  tabStyle: {
    height: 50,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
}

export { MultiBar }
