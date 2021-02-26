import {
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
import auth from '@react-native-firebase/auth'
import accountsApi from './accountsApi.js'
import notificationsApi from './notificationsApi.js'
import socket from './socket.js'

const { LoginManager, AccessToken } = FBSDK

// const config = {
//   apiKey: FIREBASE_API_KEY, // Auth / General Use
//   applicationId: FIREBASE_APPLICATION_ID, // General Use
//   projectId: FIREBASE_PROJECT_ID, // General Use
//   authDomain: FIREBASE_AUTH_DOMAIN, // Auth with popup/redirect
//   databaseURL: FIREBASE_DATABASE, // Realtime Database
//   storageBucket: FIREBASE_STORAGE_BUCKET, // Storage
// }

// if (!Firebase.apps.length) Firebase.initializeApp(config)

// TODO: Move phone auth

// TODO: On login, check user displayname
// On login for new user, set display name to null
// If user provider ID is phone, set async storage phone to number
// If account finishes creation, set display name to display name

const loginWithCredential = async (userCredential) => {
  try {
    // Get info from database if not new user
    if (!userCredential.additionalUserInfo.isNewUser && userCredential.user.displayName != null) {
      const user = await accountsApi.getUser()
      AsyncStorage.multiSet([
        [USERNAME, user.username],
        [NAME, user.name],
        [PHOTO, user.photo],
        [UID, user.uid],
      ])
      if (user.email) await AsyncStorage.setItem(EMAIL, user.email)
      if (user.phone_number) await AsyncStorage.setItem(PHONE, user.phone_number)
      global.email = user.email
      global.phone = user.phone_number
      // Link user with their notification token
      const token = await AsyncStorage.getItem(REGISTRATION_TOKEN)
      await notificationsApi.linkToken(token)
      socket.connect()
      return 'Home'
    }
    // Set user's info locally
    await AsyncStorage.setItem(UID, userCredential.user.uid)
    auth().currentUser.updateProfile({ displayName: null })
    switch (auth().currentUser.providerData[0].providerId) {
      case 'facebook.com':
        await AsyncStorage.multiSet([
          [NAME, userCredential.additionalUserInfo.profile.name],
          [EMAIL, userCredential.additionalUserInfo.profile.email],
        ])
        break
      case 'phone':
        await AsyncStorage.multiSet([[PHONE, userCredential.user.phoneNumber]])
        break
      case 'phone':
      case 'firebase':
        await AsyncStorage.multiSet([[PHONE, userCredential.user.phoneNumber]])
        break
      default:
        throw new Error('Could not determine provider')
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
    const credential = await auth.FacebookAuthProvider.credential(token.accessToken)
    // Sign in with Firebase oauth using credential and authentication token
    const userCredential = await auth().signInWithCredential(credential)
    return loginWithCredential(userCredential)
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

const loginWithPhone = async (number) => {
  try {
    if (!validatePhoneNumber(number)) throw new Error('Invalid phone number')
    const confirm = await auth().signInWithPhoneNumber(formatPhoneNumber(number))
    return confirm
  } catch (err) {
    return Promise.reject(err)
  }
}

// Log out of Firebase and Facebook, disconnect socket
const logout = async () => {
  try {
    socket.getSocket().disconnect()
    if (auth().currentUser.providerData[0].providerId === 'facebook.com') {
      LoginManager.logOut()
    }
    await notificationsApi.unlinkToken()
    await auth().signOut()
    await AsyncStorage.multiRemove([NAME, USERNAME, EMAIL, PHOTO, PHONE, UID])
  } catch (err) {
    return Promise.reject(err)
  }
}

// TODO: Generalize

const deleteUserWithCredential = async (credential) => {
  try {
    // Reauthenticate current user
    await auth().currentUser.reauthenticateWithCredential(credential)
    // Disconnect from socket
    socket.getSocket().disconnect()
    // Delete user from database
    await accountsApi.deleteUser()
    // Delete user from firebase and remove information from AsyncStorage
    await auth().currentUser.delete()
    await AsyncStorage.multiRemove([NAME, USERNAME, EMAIL, PHOTO, PHONE, UID])
  } catch (err) {
    console.log('------ERROR DELETING USER')
    return Promise.reject(err)
  }
}

// Deletes user from database, Firebase, and disconnects socket
const deleteUser = async () => {
  try {
    // Get credential for reauthentication
    var credential
    switch (auth().currentUser.providerData[0].providerId) {
      case 'facebook.com':
        // Retrieve accesstoken to delete use from Firebase
        const data = await AccessToken.getCurrentAccessToken()
        if (!data) {
          // Attempt a login using the Facebook login dialog asking for default permissions.
          const login = await LoginManager.logInWithPermissions(['public_profile', 'email'])
          if (login.isCancelled) {
            return Promise.reject(new Error('Cancelled request'))
          }
          data = await AccessToken.getCurrentAccessToken()
        }
        credential = await auth.FacebookAuthProvider.credential(data.accessToken)
        break
      default:
      return auth().verifyPhoneNumber(auth().currentUser.phoneNumber)
        .on('state_changed', (phoneAuthSnapshot) => {
          console.log('State: ', phoneAuthSnapshot.state);
          switch (phoneAuthSnapshot.state){
            case auth.PhoneAuthState.CODE_SENT:
              break;
            case auth.PhoneAuthState.ERROR:
              break;
          }
        });

    }
    // deleteUserWithCredential(credential)
  } catch (err) {
    console.log(err)
    return Promise.reject(err)
  }
}

export default {
  deleteUser,
  loginWithFacebook,
  logout,
  loginWithCredential,
  loginWithPhone,
}
