import React from 'react'
import FBSDK from 'react-native-fbsdk'
import firebase from 'firebase';
import {
  FIREBASE_API_KEY, 
  FIREBASE_APPLICATION_ID, 
  FIREBASE_PROJECT_ID, 
  FIREBASE_AUTH_DOMAIN, 
  FIREBASE_STORAGE_BUCKET} from 'react-native-dotenv'
const { LoginManager, AccessToken, GraphRequest, GraphRequestManager } = FBSDK

firebase.initializeApp({
  apiKey: FIREBASE_API_KEY,                             // Auth / General Use
  applicationId: FIREBASE_APPLICATION_ID,      // General Use
  projectId: FIREBASE_PROJECT_ID,               // General Use
  authDomain: FIREBASE_AUTH_DOMAIN,         // Auth with popup/redirect
  //databaseURL: "https://YOUR_APP.firebaseio.com", // Realtime Database
  storageBucket: FIREBASE_STORAGE_BUCKET       //Storage
});

class FacebookService {
  loginWithFacebook = () => {
    // Attempt a login using the Facebook login dialog asking for default permissions.
    LoginManager.logInWithPermissions(['public_profile', 'email'])
      .then(login => {
        if (login.isCancelled) {
          return Promise.reject(new Error('Cancelled request'));
        }
        return AccessToken.getCurrentAccessToken();
      })
      .then(data => {
        const credential = firebase.auth.FacebookAuthProvider.credential(data.accessToken);
        this.getUser(data.accessToken);
        return firebase.auth().signInWithCredential(credential);
      })
      .then(currentUser => {
        //console.log(`Facebook Login with user : ${JSON.stringify(currentUser.toJSON())}`);
      })
      .catch(error => {
        console.log(`Facebook login fail with error: ${error}`);
      })
  };

  logoutWithFacebook = () => {
    LoginManager.logOut();
  }

  getUser = (token) => {
    const PROFILE_REQUEST_PARAMS = {
      fields: {
        string: 'id,name,email',
      },
    };

    const profileRequest = new GraphRequest(
      '/me',
      { accessToken: token,
        parameters: PROFILE_REQUEST_PARAMS,
      },
      (error, user) => {
        if (error) {
          console.log('login info has error: ' + error);
        } else {

          console.log('result:', user);
          return user;
        }
      },
    );
    new GraphRequestManager().addRequest(profileRequest).start();
  };
}

export const facebookService = new FacebookService();