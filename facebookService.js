import React from 'react';
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
} from 'react-native-dotenv';

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
    LoginManager.logInWithPermissions(['public_profile', 'email'])
      .then(login => {
        if (login.isCancelled) {
          global.success = false;
          return Promise.reject(new Error('Cancelled request'));
        }
        global.success = true;
        console.log(global.success);
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
          global.uid = firebase.auth().currentUser.uid;
          global.name = currentUser.additionalUserInfo.profile.name;
          global.id = currentUser.additionalUserInfo.profile.id;
          global.email = currentUser.additionalUserInfo.profile.email;
          global.photo = currentUser.user.photoURL;
          console.log(global.uid);
          console.log(global.name);
          console.log(global.id);
          console.log(global.email);
          console.log(global.photo);
          //uncomment below code after finishing phone authentication
          // api.createFBUser(
          //   currentUser.additionalUserInfo.profile.name,
          //   currentUser.additionalUserInfo.profile.id,
          //   username,
          //   currentUser.additionalUserInfo.profile.email,
          //   currentUser.user.photoURL,
          // );
        }
        //navigate to homepage here
      })
      .catch(error => {
        //Account linking will be needed with email/phone_number login
        // if (errorCode === 'auth/account-exists-with-different-credential') {
        //   alert('Email already associated with another account.');
        //   // Handle account linking here, if using.
        console.log(`Facebook login fail with error: ${error.message}`);
      });
  };

  //test logout
  logoutWithFacebook = () => {
    LoginManager.logOut();
    firebase.logOut();
  };

  deleteUser = async () => {
    api.deleteUser();
    await AccessToken.refreshCurrentAccessTokenAsync();
    return AccessToken.getCurrentAccessToken()
      .then(data => {
        const credential = firebase.auth.FacebookAuthProvider.credential(
          data.accessToken,
        );
        firebase.auth().currentUser.reauthenticateWithCredential(credential);
        firebase.auth().currentUser.delete();
      })
      .catch(error => {
        console.log(error);
      })
  }
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
