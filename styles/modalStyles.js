import { StyleSheet } from 'react-native'
import colors from './colors.js'
import normalize from './normalize.js'

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
    color: colors.hex,
    marginTop: '5%',
    marginRight: '5%',
    fontSize: normalize(21),
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
    fontSize: normalize(20),
    paddingTop: '5%',
    paddingBottom: '5%',
    textAlign: 'center',
  },
  button: {
    borderColor: colors.hex,
    borderWidth: 1.5,
    borderRadius: 60,
    width: '35%',
    alignSelf: 'center',
    margin: '3%',
  },
  mainContainer: {
    width: '75%',
    marginTop: '50%',
    backgroundColor: 'white',
    elevation: 20,
    alignSelf: 'center',
    borderRadius: 10,
  },
  closeIcon: {
    fontSize: normalize(18),
    flexDirection: 'row',
    alignSelf: 'flex-end',
    marginTop: '4%',
    marginRight: '4%',
  },
  titleContainer: {
    marginLeft: '5%',
  },
  titleText: {
    fontSize: normalize(17),
    marginBottom: '3%',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: '1%',
  },
  textInput: {
    fontSize: normalize(17),
    color: '#9f9f9f',
    backgroundColor: '#E5E5E5',
    height: '80%',
    width: '17%',
    borderRadius: 7,
    textAlign: 'center',
    padding: '3%',
  },
  error: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  errorIcon: {
    fontSize: normalize(15),
    marginRight: '2%',
  },
  errorText: {
    fontSize: normalize(12),
  },
  doneButton: {
    backgroundColor: colors.hex,
    borderRadius: 30,
    alignSelf: 'center',
    width: '40%',
  },
  doneText: {
    color: 'white',
    textAlign: 'center',
    paddingTop: '5%',
    paddingBottom: '5%',
    fontSize: normalize(20),
  },
  topRightIcon: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  modalContent: {
    flex: 1,
    justifyContent: 'space-evenly',
  },
  justifyCenter: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
})
