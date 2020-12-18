import { StyleSheet } from 'react-native'

export default StyleSheet.create({
  blur: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 99,
    elevation: 99,
  },
  icon: {
    fontFamily: 'CircularStd-Medium',
    color: '#F15763',
    marginTop: '5%',
    marginRight: '5%',
    fontSize: 21,
  },
  modal: {
    justifyContent: 'space-evenly',
    width: '80%',
    backgroundColor: 'white',
    alignSelf: 'center',
    borderRadius: 15,
    zIndex: 100,
    elevation: 100,
    margin: '50%',
  },
  text: {
    fontFamily: 'CircularStd-Medium',
    fontSize: 20,
    paddingTop: '5%',
    paddingBottom: '5%',
    textAlign: 'center',
  },
  button: {
    borderColor: '#F15763',
    borderWidth: 1.5,
    borderRadius: 60,
    width: '35%',
    alignSelf: 'center',
    margin: '3%',
  },
})
