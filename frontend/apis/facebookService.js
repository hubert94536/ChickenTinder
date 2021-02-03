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
import Firebase from '@react-native-firebase/app'
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

// TODO: Move phone auth

// TODO: On login, check user displayname
// On login for new user, set display name to null
// If user provider ID is phone, set async storage phone to number
// If account finishes creation, set display name to display name

const loginWithCredential = async (userCredential) => {
  try{ 
    // Get info from database if not new user
    console.log(userCredential);
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
      global.username = user.username
      global.name = user.name
      global.photo = user.photo
      global.email = user.email
      global.phone = user.photo
      // Link user with their notification token
      const token = await AsyncStorage.getItem(REGISTRATION_TOKEN)
      await notificationsApi.linkToken(token)
      console.log('Token linked')
      socket.connect()
      return 'Home'
    }
    // Set user's info locally
    await AsyncStorage.setItem(UID, userCredential.user.uid)
    
    switch (userCredential.user.providerId){
      case "FacebookAuthProviderID":
        await AsyncStorage.multiSet([
          [NAME, userCredential.additionalUserInfo.profile.name],
          [EMAIL, userCredential.additionalUserInfo.profile.email]
        ])
        break;
      case "PhoneAuthProviderID":
        // await AsyncStorage.multiSet([
        //   [PHONE, ]
        // ])
        break;
      default:
        break;
    }

    return 'CreateAccount'
  } catch (err) {
    return Promise.reject(err)
  }
}

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
    return login(userCredential)
  } catch (err) {
    return Promise.reject(err)
  }
}

validatePhoneNumber = (number) => {
  const regexp = /^\+?(\d{1,2})?\s?\(?(\d{3})\)?[\s.-]?(\d{3})[\s.-]?(\d{4})$/
  return regexp.test(number)
}

formatPhoneNumber = (number) => {
  const regexp = /^\+?(\d{1,2})?\s?\(?(\d{3})\)?[\s.-]?(\d{3})[\s.-]?(\d{4})$/
  const matches = number.match(regexp)
  return `+${matches[1] || 1}${matches[2]}${matches[3]}${matches[4]}`
}

const loginWithPhone = async(number) => {
  try {
    if (!validatePhoneNumber(number)) throw new Error("Invalid phone number")
    const confirm = await Firebase.auth().signInWithPhoneNumber(formatPhoneNumber(number))
    return confirm
  } catch (err) {
    return Promise.reject(err)
  }
}

// Log out of Firebase and Facebook, disconnect socket
const logout = async () => {
  try {
    socket.getSocket().disconnect()
    if ( Firebase.auth().currentUser.providerId === "FacebookAuthProviderID" ) { LoginManager.logOut() }
    await notificationsApi.unlinkToken()
    await Firebase.auth().signOut()
    await AsyncStorage.multiRemove([NAME, USERNAME, EMAIL, PHOTO, PHONE, UID])
  } catch (err) {
    return Promise.reject(err)
  }
}

// TODO: Generalize

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
    return Promise.reject(err)
  }
}

export default {
  deleteUser,
  loginWithFacebook,
  logout,
  loginWithCredential,
  loginWithPhone
}
