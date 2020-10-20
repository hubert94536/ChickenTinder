import React from 'react'
import { StyleSheet } from 'react-native'

export default StyleSheet.create({
    blur: {
        position: 'absolute', top: 0, bottom: 0, left: 0, right: 0
    },
    icon: {
        fontFamily: font,
        color: hex,
        marginTop: '5%',
        marginRight: '5%',
        fontSize: 30,
    },
    modal: {
        flex: 1,
        justifyContent: 'space-evenly',
        width: '80%',
        backgroundColor: 'white',
        alignSelf: 'center',
        borderRadius: 40,
        elevation: 20,
        margin: '50%'
    },
    text: {
        fontFamily: font,
        color: hex,
        fontSize: 20,
        paddingTop: '5%',
        paddingBottom: '5%',
        textAlign: 'center',
    },
    textPressed: {
        fontFamily: font,
        color: 'white',
        fontSize: 20,
        paddingTop: '5%',
        paddingBottom: '5%',
        textAlign: 'center',
    },
    button:{
        borderColor: hex,
        borderWidth: 2.5,
        borderRadius: 60,
        width: '50%',
        alignSelf: 'center',
      }
})