import { StyleSheet } from 'react-native'

export default StyleSheet.create({
    blur: {
        position: 'absolute', top: 0, bottom: 0, left: 0, right: 0
    },
    icon: {
        fontFamily:  'CircularStd-Bold',
        color: '#F25763',
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
        fontFamily:  'CircularStd-Bold',
        fontSize: 20,
        paddingTop: '5%',
        paddingBottom: '5%',
        textAlign: 'center',
    },
    button:{
        borderColor: '#F25763',
        borderWidth: 2.5,
        borderRadius: 60,
        width: '50%',
        alignSelf: 'center',
      }
})
