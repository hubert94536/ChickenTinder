import { StyleSheet } from 'react-native'
import colors from './colors.js'

export default StyleSheet.create({
  bigButton: {
    borderRadius: 40,
    borderColor: '#fff',
    borderWidth: 2,
    width: '65%',
    alignSelf: 'center',
  },
  bigButtonText: {
    fontFamily: 'CircularStd-Book',
    fontSize: 16,
    textAlign: 'center',
  },
  text: {
    fontFamily: 'CircularStd-Medium',
    color: colors.hex,
  },
  textBold: {
    fontFamily: 'CircularStd-Bold',
    color: colors.hex,
  },
  textBook: {
    fontFamily: 'CircularStd-Book',
    color: colors.hex,
  },
  input: {
    fontSize: 20,
    margin: 0,
    padding: 0,
  },
  smallButton: {
    borderRadius: 45,
    borderColor: colors.hex,
    borderWidth: 2,
  },
  smallButtonText: {
    fontFamily: 'CircularStd-Medium',
    textAlign: 'center',
    fontSize: 17,
    paddingTop: '0.5%',
    paddingBottom: '0.5%',
  },
  title: {
    textAlign: 'center',
    fontSize: 45,
  },
  icons: {
    color: colors.hex,
    fontSize: 27,
    fontFamily: 'CircularStd-Medium',
  },
  medButton: {
    borderRadius: 30,
    borderWidth: 2.5,
    alignSelf: 'center',
  },
  medButtonText: {
    fontFamily: 'CircularStd-Medium',
    fontSize: 16,
    textAlign: 'center',
  },

  longButton: {
    borderRadius: 30,
    borderWidth: 2.5,
    alignSelf: 'center',
    paddingVertical: 5,
    paddingHorizontal: 12,
    width: '70%',
  },
  longButtonText: {
    alignSelf: 'center',
    fontFamily: 'CircularStd-Book',
    fontSize: 18,
    fontWeight: 'normal',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 63,
    borderWidth: 4,
    alignSelf: 'center',
    margin: '1.5%',
  },
  mainContainer: {
    backgroundColor: 'white',
    flex: 1,
  },
  contentContainer: {
    flexDirection: 'row',
    alignSelf: 'center',
  },
  hex: {
    color: colors.hex,
  },
  book: {
    fontFamily: 'CircularStd-Book',
  },
  medium: {
    fontFamily: 'CircularStd-Medium',
  },
  screenBackground: {
    flex: 1,
  },
})
