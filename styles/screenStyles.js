import { StyleSheet } from 'react-native'

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
    color: '#F15763',
  },
  textBold: {
    fontFamily: 'CircularStd-Bold',
    color: '#F15763',
  },
  input: {
    fontSize: 20,
    margin: 0,
    padding: 0,
  },
  smallButton: {
    borderRadius: 45,
    borderColor: '#F15763',
    borderWidth: 2,
  },
  smallButtonText: {
    fontFamily: 'CircularStd-Medium',
    textAlign: 'center',
    fontSize: 17,
    paddingTop: '0.5%',
    paddingBottom: '0.5%',
    // paddingTop: '2.5%',
    // paddingBottom: '2.5%',
  },
  title: {
    textAlign: 'center',
    fontSize: 45,
  },
  icons: {
    color: '#F15763',
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

  hex: {
    color: '#F15763',
  },

  white: {
    color: '#FFFFFF',
  },

  black: {
    color: '#000000',
  },
})
