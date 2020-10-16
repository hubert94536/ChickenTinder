import AsyncStorage from '@react-native-community/async-storage'
import FBSDK from 'react-native-fbsdk'
import accountsApi from './accountsApi.js'
import firebase from 'firebase'
import {
  FIREBASE_API_KEY,
  FIREBASE_APPLICATION_ID,
  FIREBASE_AUTH_DOMAIN,
  FIREBASE_DATABASE,
  FIREBASE_STORAGE_BUCKET,
  FIREBASE_PROJECT_ID,
  USERNAME,
  NAME,
  ID,
  UID,
  EMAIL,
  PHOTO,
} from 'react-native-dotenv'

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

firebase.initializeApp(config)

class FacebookService {
  async loginWithFacebook() {
    // Attempt a login using the Facebook login dialog asking for default permissions.
    return LoginManager.logInWithPermissions(['public_profile', 'email'])
      .then((login) => {
        if (login.isCancelled) {
          return Promise.reject(new Error('Cancelled request'))
        }
        return AccessToken.getCurrentAccessToken()
      })
      .then((data) => {
        const credential = firebase.auth.FacebookAuthProvider.credential(data.accessToken)
        // Sign in with Firebase oauth using credential and authentication token
        return firebase.auth().signInWithCredential(credential)
      })
      .then((currentUser) => {
        // Set user's info locally
        AsyncStorage.setItem(UID, firebase.auth().currentUser.uid)
        AsyncStorage.setItem(NAME, currentUser.additionalUserInfo.profile.name)
        AsyncStorage.setItem(ID, currentUser.additionalUserInfo.profile.id)
        AsyncStorage.setItem(EMAIL, currentUser.additionalUserInfo.profile.email)
        AsyncStorage.setItem(PHOTO, currentUser.user.photoURL)
        // Get username from database if not new user
        if (!currentUser.additionalUserInfo.isNewUser) {
          accountsApi.getUser().then((res) => {
            AsyncStorage.setItem(USERNAME, res.username)
          })
          return 'Home'
        }
        return 'Username'
      })
      .catch((error) => {
        //  Account linking will be needed with email/phone_number login
        // if (errorCode === 'auth/account-exists-with-different-credential') {
        //   alert('Email already associated with another account.');
        //   // Handle account linking here, if using.
        throw error
      })
  }

  // isSignedIn = () => {
  //   return firebase.auth().currentUser;
  // }

  // Log out of Firebase and Facebook
  async logoutWithFacebook() {
    firebase
      .auth()
      .signOut()
      .then(() => {
        LoginManager.logOut()
        AsyncStorage.multiRemove([NAME, USERNAME, ID, UID, EMAIL, PHOTO])
      })
      .catch((error) => {
        throw error
      })
  }

  async deleteUser() {
    accountsApi
      .deleteUser()
      .then(() => {
        // Need to refresh access token since old one expired
        AccessToken.refreshCurrentAccessTokenAsync()
      })
      .then(() => {
        // Retrieve accesstoken to delete use from Firebase
        AccessToken.getCurrentAccessToken().then((accessToken) => {
          const credential = firebase.auth.FacebookAuthProvider.credential(accessToken)
          firebase.auth().currentUser.reauthenticateWithCredential(credential)
          firebase.auth().currentUser.delete()
          AsyncStorage.multiRemove([NAME, USERNAME, ID, UID, EMAIL, PHOTO])
        })
      })
      .catch((error) => {
        throw error
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
}

export const facebookService = new FacebookService()
