import FBSDK from 'react-native-fbsdk';
import firebase from 'firebase';
import api from './api.js';
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
} from 'react-native-dotenv';
import AsyncStorage from '@react-native-community/async-storage';
const {LoginManager, AccessToken, GraphRequest, GraphRequestManager} = FBSDK;

const config = {
  apiKey: FIREBASE_API_KEY, // Auth / General Use
  applicationId: FIREBASE_APPLICATION_ID, // General Use
  projectId: FIREBASE_PROJECT_ID, // General Use
  authDomain: FIREBASE_AUTH_DOMAIN, // Auth with popup/redirect
  databaseURL: FIREBASE_DATABASE, // Realtime Database
  storageBucket: FIREBASE_STORAGE_BUCKET, //Storage
};

firebase.initializeApp(config);

class FacebookService {
  loginWithFacebook = () => {
    // Attempt a login using the Facebook login dialog asking for default permissions.
    return LoginManager.logInWithPermissions(['public_profile', 'email'])
      .then(login => {
        if (login.isCancelled) {
          return Promise.reject(new Error('Cancelled request'));
        }
        return AccessToken.getCurrentAccessToken();
      })
      .then(data => {
        const credential = firebase.auth.FacebookAuthProvider.credential(
          data.accessToken,
        );
        return firebase.auth().signInWithCredential(credential);
      })
      .then(currentUser => {
        if (currentUser.additionalUserInfo.isNewUser) {
          AsyncStorage.setItem(UID, firebase.auth().currentUser.uid);
          AsyncStorage.setItem(
            NAME,
            currentUser.additionalUserInfo.profile.name,
          );
          AsyncStorage.setItem(ID, currentUser.additionalUserInfo.profile.id);
          AsyncStorage.setItem(
            EMAIL,
            currentUser.additionalUserInfo.profile.email,
          );
          AsyncStorage.setItem(PHOTO, currentUser.user.photoURL);
          return 'Username';
        } else {
          return 'Home';
        }
      })
      .catch(error => {
        //Account linking will be needed with email/phone_number login
        // if (errorCode === 'auth/account-exists-with-different-credential') {
        //   alert('Email already associated with another account.');
        //   // Handle account linking here, if using.
        return Promise.reject(new Error(error.response.message));
      });
  };

  // isSignedIn = () => {
  //   return firebase.auth().currentUser;
  // }

  //test logout
  logoutWithFacebook = () => {
    LoginManager.logOut();
    firebase.logOut();
  };

  deleteUser = () => {
    api
      .deleteUser()
      .then(() => {
        AccessToken.refreshCurrentAccessTokenAsync();
      })
      .then(() => {
        const accessToken = AccessToken.getCurrentAccessToken();
        const credential = firebase.auth.FacebookAuthProvider.credential(
          accessToken,
        );
        firebase.auth().currentUser.reauthenticateWithCredential(credential);
        firebase.auth().currentUser.delete();
        AsyncStorage.multiRemove([NAME, USERNAME, ID, UID, EMAIL, PHOTO]);
      })
      .catch(error => {
        return Promise.reject(new Error(error.response.message));
      });
  };
  //getUser if needed
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

export const facebookService = new FacebookService();
