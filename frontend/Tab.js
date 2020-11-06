// import * as React from "react"
// import { TouchableOpacity } from "react-native"

// const Tab = ({ title, onPress }) => {
//   return (
//     <TouchableOpacity onPress={onPress}>
//       <View
//         style={{
//           padding: 10,
//           borderRadius: 10,
//         }}
//       >
//         <Text
//         >{title}</Text>
//       </View>
//     </TouchableOpacity>
//   )
// }

// export default Tab


import * as React from "react"
import { Animated, TouchableOpacity } from "react-native"

const Tab = ({ focusAnim, title, onPress }) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <Animated.View
        style={{
          padding: 10,
          borderRadius: 10,
        }}
      >
        <Animated.Text
        >{title}</Animated.Text>
      </Animated.View>
    </TouchableOpacity>
  )
}

export default Tab