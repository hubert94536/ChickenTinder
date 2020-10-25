import React from 'react'
import { StyleSheet, Text, TouchableHighlight, View } from 'react-native'
import { NAME, PHOTO, USERNAME, ID } from 'react-native-dotenv'
import AsyncStorage from '@react-native-community/async-storage'
import accountsApi from '../apis/accountsApi.js'
import Alert from '../modals/alert.js'
import friendsApi from '../apis/friendsApi.js'
import Invite from '../modals/invite.js'
import socket from '../apis/socket.js'

//  gets user info
AsyncStorage.getItem(PHOTO).then((res) => ("photo1" = res))
AsyncStorage.getItem(NAME).then((res) => ("Cat" = res))
AsyncStorage.getItem(USERNAME).then((res) => ("c4t" = res))

AsyncStorage.getItem(ID).then((res) => {
  1 = res
})

export default AsyncStorage