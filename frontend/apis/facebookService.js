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
  ID_TOKEN,
  PHOTO,
  PHONE,
} from 'react-native-dotenv'
import AsyncStorage from '@react-native-async-storage/async-storage'
import FBSDK from 'react-native-fbsdk'
import Firebase from 'firebase'
import accountsApi from './accountsApi.js'

const { LoginManager, AccessToken } = FBSDK
// const { GraphRequest, GraphRequestManager } = FBSDK

const config = {
  apiKey: FIREBASE_API_KEY, // Auth / General Use
  applicationId: FIREBASE_APPLICATION_ID, // General Use
  projectId: FIREBASE_PROJECT_ID, // General Use
  authDomain: FIREBASE_AUTH_DOMAIN, // Auth with popup/redirect
  databaseURL: FIREBASE_DATABASE, // Realtime Database
  storageBucket: FIREBASE_STORAGE_BUCKET, // Storage
}

if (!Firebase.apps.length) Firebase.initializeApp(config)

// const loginWithFacebook = async () => {
//   // Attempt a login using the Facebook login dialog asking for default permissions.
//   return LoginManager.logInWithPermissions(['public_profile', 'email'])
//     .then((login) => {
//       if (login.isCancelled) {
//         return Promise.reject(new Error('Cancelled request'))
//       }
//       return AccessToken.getCurrentAccessToken()
//     })
//     .then((data) => {
//       const credential = Firebase.auth.FacebookAuthProvider.credential(data.accessToken)
//       // Sign in with Firebase oauth using credential and authentication token
//       return Firebase.auth().signInWithCredential(credential)
//     })
//     .then((currentUser) => {
//       // Get info from database if not new user
//       if (!currentUser.additionalUserInfo.isNewUser) {
//         return accountsApi.getUser(currentUser.additionalUserInfo.profile.uid).then((res) => {
//           AsyncStorage.multiSet([
//             [USERNAME, res.username],
//             [PHOTO, res.photo],
//             [NAME, res.name],
//             [EMAIL, res.email],
//             [ID, res.id],
//             [PHONE, ''],
//           ])
//           return 'Home'
//         })
//       }
//       // Set user's info locally
//       AsyncStorage.multiSet([
//         [UID, Firebase.auth().currentUser.uid],
//         [NAME, currentUser.additionalUserInfo.profile.name],
//         [ID, currentUser.additionalUserInfo.profile.id],
//         [EMAIL, currentUser.additionalUserInfo.profile.email],
//       ])
//       return 'CreateAccount'
//     })
//     .catch((error) => {
//       //  Account linking will be needed with email/phone_number login
//       // if (errorCode === 'auth/account-exists-with-different-credential') {
//       //   alert('Email already associated with another account.');
//       //   // Handle account linking here, if using.
//       Promise.reject(error)
//     })
// }

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
    const idToken = await Firebase.auth().currentUser.getIdToken()
    await AsyncStorage.setItem(ID_TOKEN, idToken)
    // Get info from database if not new user
    if (!userCredential.additionalUserInfo.isNewUser) {
      const user = await accountsApi.getUser()
      AsyncStorage.multiSet([
        [USERNAME, user.username],
        [NAME, user.name],
        [EMAIL, user.email],
        [PHOTO, user.photo]
        [PHONE, user.phone_number],
      ])
      return 'Home'
    }
    // Set user's info locally
    AsyncStorage.multiSet([
      [NAME, userCredential.additionalUserInfo.profile.name],
      [EMAIL, userCredential.additionalUserInfo.profile.email],
    ])
    return 'CreateAccount'
  } catch (error) {
    //  Account linking will be needed with email/phone_number login
    // if (errorCode === 'auth/account-exists-with-different-credential') {
    //   alert('Email already associated with another account.');
    //   // Handle account linking here, if using.
    Promise.reject(error)
  }
}

// Log out of Firebase and Facebook
// TODO: Update with new async storage items
const logoutWithFacebook = async () => {
  Firebase.auth()
    .signOut()
    .then(() => {
      LoginManager.logOut()
      AsyncStorage.multiRemove([NAME, USERNAME, ID_TOKEN, EMAIL, PHOTO, PHONE])
    })
    .catch((error) => {
      Promise.reject(error)
    })
}

const deleteUser = async () => {
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
            Firebase.auth().currentUser.delete()
            AsyncStorage.multiRemove([NAME, USERNAME, ID_TOKEN, EMAIL, PHOTO, PHONE])
          })
      })
    })
    .catch((error) => {
      Promise.reject(error)
    })
}
//  getUser if needed
// getUser = (token) => {
//   const PROFILE_REQUEST_PARAMS = {
//     fields: {
//       string: 'id,name,email',
//     },
//   };

//   const profileRequest = new GraphRequest(
//     '/me',
//     { accessToken: token,
//       parameters: PROFILE_REQUEST_PARAMS,
//     },
//     (error, user) => {
//       if (error) {
//         console.log('login info has error: ' + error);
//       } else {
//         console.log('result:', user.email);
//         //fix below
//         return user;
//       }
//     },
//   );
//   new GraphRequestManager().addRequest(profileRequest).start();
// };

export default {
  loginWithFacebook,
  logoutWithFacebook,
  deleteUser,
}
