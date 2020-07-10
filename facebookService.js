import React from 'react'
import FBSDK from 'react-native-fbsdk'

const { LoginButton, AccessToken, GraphRequest, GraphRequestManager } = FBSDK

class FacebookService {
  constructor() {
    this.requestManager = new GraphRequestManager()
  }

  makeLoginButton() {
    return (

      <LoginButton
        publishPermissions={["email", "public_profile"]}
        onLoginFinished={
          (error, result) => {
            if (error) {
              alert("Login failed with error: " + error.message);
              ////INSERT PAGE TO NAV TO
            } else if (result.isCancelled) {
              alert("Login was cancelled")
              //INSERT PAGE TO NAV TO
            } else {
              //authenticate login
              AccessToken.getCurrentAccessToken()
                .then((data) => {
                  //call passed function with access token
                  //INSERT PAGE TO NAV TO
                })
            }
          }
        }
      />
    );
  }

  makeLogoutButton() {
    return (
      <LoginButton onLogoutFinished={() => {
        // INSERT PAGE TO NAV TO
      }} />
    )
  }
  //queries user info for logged in user (from FB documentation)
  async fetchProfile() {
    return new Promise((resolve, reject) => {
      const request = new GraphRequest(
        '/me',
        null,
        (error, result) => {
          if (result) {
            //returns profile if successful
            resolve(result)
          } else {
            //otherwise throws error
            reject(error)
          }
        }
      )
      
      this.requestManager.addRequest(request).start()
    })
  }

}

export const facebookService = new FacebookService()