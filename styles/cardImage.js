import { Dimensions, StyleSheet } from 'react-native'
import colors from './colors.js'
import normalize from '../styles/normalize.js'

const width = Dimensions.get('window').width

export default StyleSheet.create({
  font: {
    fontFamily: 'CircularStd-Medium',
  },
  bookFont: {
    fontFamily: 'CircularStd-Book',
  },
  hex: {
    color: colors.hex,
  },
  hexBorder: {
    borderColor: colors.hex,
  },
  greyBorder: {
    borderColor: '#F5F5F5',
  },
  button: {
    borderRadius: 63,
    height: width * 0.12,
    width: width * 0.12,
    margin: '1%',
  },
  text: {
    fontFamily: 'CircularStd-Medium',
    color: colors.hex,
    fontSize: normalize(15),
    alignSelf: 'center',
  },
  icon: {
    fontFamily: 'CircularStd-Medium',
    color: colors.hex,
    fontSize: normalize(35),
    alignSelf: 'center',
  },
  card: { flexDirection: 'row', flex: 1, justifyContent: 'flex-end' },
})
