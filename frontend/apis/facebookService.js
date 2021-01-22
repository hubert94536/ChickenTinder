import {
  FIREBASE_API_KEY,
  FIREBASE_APPLICATION_ID,
  FIREBASE_AUTH_DOMAIN,
  FIREBASE_DATABASE,
  FIREBASE_STORAGE_BUCKET,
  FIREBASE_PROJECT_ID,
  USERNAME,
  NAME,
  EMAIL,
  PHOTO,
  PHONE,
  REGISTRATION_TOKEN,
  UID,
} from 'react-native-dotenv'
import AsyncStorage from '@react-native-async-storage/async-storage'
import FBSDK from 'react-native-fbsdk'
import Firebase from 'firebase'
import accountsApi from './accountsApi.js'
import notificationsApi from './notificationsApi.js'
import socket from './socket.js'

const { LoginManager, AccessToken } = FBSDK

const config = {
  apiKey: FIREBASE_API_KEY, // Auth / General Use
  applicationId: FIREBASE_APPLICATION_ID, // General Use
  projectId: FIREBASE_PROJECT_ID, // General Use
  authDomain: FIREBASE_AUTH_DOMAIN, // Auth with popup/redirect
  databaseURL: FIREBASE_DATABASE, // Realtime Database
  storageBucket: FIREBASE_STORAGE_BUCKET, // Storage
}

if (!Firebase.apps.length) Firebase.initializeApp(config)

const loginWithFacebook = async () => {
  try {
    // Attempt a login using the Facebook login dialog asking for default permissions.
    const login = await LoginManager.logInWithPermissions(['public_profile', 'email'])
    if (login.isCancelled) {
      return Promise.reject(new Error('Cancelled request'))
    }
    const token = await AccessToken.getCurrentAccessToken()
    const credential = await Firebase.auth.FacebookAuthProvider.credential(token.accessToken)
    // Sign in with Firebase oauth using credential and authentication token
    const userCredential = await Firebase.auth().signInWithCredential(credential)
    // Get info from database if not new user
    if (!userCredential.additionalUserInfo.isNewUser) {
      const user = await accountsApi.getUser()
      AsyncStorage.multiSet([
        [USERNAME, user.username],
        [NAME, user.name],
        [EMAIL, user.email],
        [PHOTO, user.photo],
        [PHONE, user.phone_number],
        [UID, user.uid],
      ])
      // Link user with their notification token
      AsyncStorage.getItem(REGISTRATION_TOKEN)
        .then((token) => notificationsApi.linkToken(token))
        .then(() => {
          console.log('Token linked')
        })
        .catch((err) => {
          console.log(err)
        })
      socket.connect()
      return 'Home'
    }
    // Set user's info locally
    await AsyncStorage.multiSet([
      [NAME, userCredential.additionalUserInfo.profile.name],
      [EMAIL, userCredential.additionalUserInfo.profile.email],
      [UID, Firebase.auth().currentUser.uid],
    ])
    return 'CreateAccount'
  } catch (error) {
    Promise.reject(error)
  }
}

// Log out of Firebase and Facebook, disconnect socket
const logoutWithFacebook = async () => {
  try {
    socket.getSocket().disconnect()
    await Firebase.auth().signOut()
    LoginManager.logOut()
    notificationsApi.unlinkToken()
    await AsyncStorage.multiRemove([NAME, USERNAME, EMAIL, PHOTO, PHONE, UID])
  } catch (err) {
    Promise.reject(err)
  }
}

// Deletes user from database, Firebase, and disconnects socket
const deleteUser = async () => {
  try {
    socket.getSocket().disconnect()
    await accountsApi.deleteUser()
    // Need to refresh access token since old one expired
    await AccessToken.refreshCurrentAccessTokenAsync()
    // Retrieve accesstoken to delete use from Firebase
    const accessToken = await AccessToken.getCurrentAccessToken()
    const credential = await Firebase.auth.FacebookAuthProvider.credential(accessToken)
    await Firebase.auth().currentUser.reauthenticateWithCredential(credential)
    // Delete user from firebase and remove information from AsyncStorage
    await Firebase.auth().currentUser.delete()
    await AsyncStorage.multiRemove([NAME, USERNAME, EMAIL, PHOTO, PHONE, UID])
  } catch (err) {
    Promise.reject(err)
  }
}

export default {
  deleteUser,
  loginWithFacebook,
  logoutWithFacebook,
}
