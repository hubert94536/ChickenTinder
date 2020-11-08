import React from 'react'
import { Image, Modal, Dimensions, StyleSheet, Text, TouchableHighlight, View } from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome'

const height=Dimensions.get('window').height
const heigwidthht=Dimensions.get('window').width

const hex = '#F15763'

export default class TabBar extends React.Component{
  render() {
    return (
            <View style={styles.bar}>
              <Icon name='home' style={{color: this.props.cur === 'Home' ? hex : '#8d8d8d', fontSize: 26}} onPress={() => this.props.goHome()}/>
              <Icon name='search' style={{color: this.props.cur === 'Search' ? hex : '#8d8d8d', fontSize: 26}} onPress={() => this.props.goSearch()}/>
              <Icon name='bullhorn' style={{color: this.props.cur === 'Notifs' ? hex : '#8d8d8d', fontSize: 26}}  onPress={() => this.props.goNotifs()}/>
              <Icon name='user' style={{color: this.props.cur === 'Profile' ? hex : '#8d8d8d', fontSize: 26}}  onPress={() => this.props.goProfile()}/>
            </View>

    )
  }
}

const styles = StyleSheet.create({
  bar:{
    width:'95%',
    marginBottom:'2%',
    alignSelf:'center',
    height: height*0.07, 
    backgroundColor:'#fff2f2',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    elevation: 20,
    borderWidth: 0,
    position: 'absolute',
    bottom: 0,
    flexDirection:'row',
    justifyContent:'space-evenly'
  }
})