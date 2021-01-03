import { Dimensions, StyleSheet } from 'react-native'
import normalize from '../styles/normalize.js'

const width = Dimensions.get('window').width

export default StyleSheet.create({
  font: {
    fontFamily: 'CircularStd-Medium',
  },
  hex: {
    color: '#F15763',
  },
  hexBorder: {
    borderColor: '#F15763',
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
    color: '#F15763',
    fontSize: normalize(15),
    alignSelf: 'center',
  },
  icon: {
    fontFamily: 'CircularStd-Medium',
    color: '#F15763',
    fontSize: normalize(35),
    alignSelf: 'center',
  },
  card: { flexDirection: 'row', flex: 1, justifyContent: 'flex-end' },
})
