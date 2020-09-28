import io from 'socket.io-client'
import AsyncStorage from '@react-native-community/async-storage'
import { USERNAME } from 'react-native-dotenv'
var myUsername = ''

AsyncStorage.get(USERNAME).then(res => myUsername = res)

const socket = io('https://wechews.herokuapp.com', {
  query: `username=${myUsername}`
})
export default socket