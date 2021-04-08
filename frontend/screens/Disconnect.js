import React from 'react'
import {
  ImageBackground,
  StyleSheet
} from 'react-native'

export default class Disconnect extends React.Component {
    render(){
        return(
            <ImageBackground
                source={require('../assets/backgrounds/Disconnect.png')}
                style={styles.headerFill}
            />
        )
    }
}

const styles = StyleSheet.create({
    headerFill: {
        flex: 1
    },
  })
  