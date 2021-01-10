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
  UID,
} from 'react-native-dotenv'
import AsyncStorage from '@react-native-async-storage/async-storage'
import FBSDK from 'react-native-fbsdk'
import Firebase from 'firebase'
import accountsApi from './accountsApi.js'
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
      console.log(user)
      AsyncStorage.multiSet([
        [USERNAME, user.username],
        [NAME, user.name],
        [EMAIL, user.email],
        [PHOTO, user.photo],
        [PHONE, user.phone_number],
        [UID, user.uid],
      ])
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
  socket.getSocket().disconnect()
  Firebase.auth()
    .signOut()
    .then(() => {
      LoginManager.logOut()
      AsyncStorage.multiRemove([NAME, USERNAME, EMAIL, PHOTO, PHONE, UID])
    })
    .catch((error) => {
      Promise.reject(error)
    })
}

// Deletes user from database, Firebase, and disconnects socket
const deleteUser = async () => {
  socket.getSocket().disconnect()
  accountsApi
    .deleteUser()
    .then(() => {
      // Need to refresh access token since old one expired
      AccessToken.refreshCurrentAccessTokenAsync()
    })
    .then(() => {
      // Retrieve accesstoken to delete use from Firebase
      AccessToken.getCurrentAccessToken().then((accessToken) => {
        const credential = Firebase.auth.FacebookAuthProvider.credential(accessToken)
        Firebase.auth()
          .currentUser.reauthenticateWithCredential(credential)
          .then(() => {
            // Delete user from firebase and remove information from AsyncStorage
            Firebase.auth().currentUser.delete()
            AsyncStorage.multiRemove([NAME, USERNAME, EMAIL, PHOTO, PHONE, UID])
          })
          .catch((error) => Promise.reject(error))
      })
    })
    .catch((error) => {
      Promise.reject(error)
    })
}

export default {
  loginWithFacebook,
  logoutWithFacebook,
  deleteUser,
}
