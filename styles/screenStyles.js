import React from 'react'
import { StyleSheet } from 'react-native'

export default StyleSheet.create({
    bigButton: {
        borderRadius: 40,
        borderColor: '#fff',
        borderWidth: 2,
        width: '65%',
        alignSelf: 'center',
    },
    text: {
        fontFamily: 'CircularStd-Bold',
        color: '#F25763'
    },
    profileInput: {
        fontSize: 20,
        margin: 0,
        padding: 0
    },
    profileSelectedText: {
        fontFamily: 'CircularStd-Bold',
        fontSize: 17,
        paddingLeft: '3%',
        paddingRight: '3%',
        paddingTop: '0.5%',
        paddingBottom: '0.5%',
    },
    profileSelected: {
        borderRadius: 40,
        borderColor: '#F25763',
        borderWidth: 2,
        marginLeft: '5%'
    },
    profileChangeText: {
        fontFamily: 'CircularStd-Bold',
        textAlign: 'center',
        fontSize: 17,
        paddingTop: '2.5%',
        paddingBottom: '2.5%',
    }
})