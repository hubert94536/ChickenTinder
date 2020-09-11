import axios from 'axios'
<<<<<<< HEAD
import { API_KEY } from 'react-native-dotenv'
// import { View, Text } from PermissionsAndroid from 'react-native'
import React from 'react'
=======
import { API_KEY, ID } from 'react-native-dotenv'
//import { View, Text } from PermissionsAndroid from 'react-native'
import AsyncStorage from '@react-native-community/async-storage'
>>>>>>> d683c0d0e5e358ce448a34862fbb554019c201c4

// import {globalAgent} from 'http';
// import Geolocation from '@react-native-community/geolocation';

// const App = () => {
//   Geolocation.getCurrentPosition(data => console.warn(data));
//   console.warn('Geolocation');
//   return (
//     <View>
//       <Text style={{fontSize: 70}}>latitude longitude</Text>
//     </View>
//   );
// };

// const requestLocationPermission = async () => {
//   try {
//     const granted = await PermissionsAndroid.request(
//       PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
//       {
//         title: 'Location Permission',
//         message:
//           'WeChews needs access to your location ' +
//           'so you can find nearby restaurants.',
//         buttonNeutral: 'Ask Me Later',
//         buttonNegative: 'Cancel',
//         buttonPositive: 'OK',
//       },
//     );
//     if (granted === PermissionsAndroid.RESULTS.GRANTED) {
//       console.log('Location access granted');
//     } else {
//       console.log('Location access denied');
//     }
//   } catch (err) {
//     console.warn(err);
//   }
// };

<<<<<<< HEAD
=======
var saved_id = ''

AsyncStorage.getItem(ID).then(res => {
  saved_id = res
})

>>>>>>> d683c0d0e5e358ce448a34862fbb554019c201c4
// setting up Yelp API base caller
const yelpApi = axios.create({
  baseURL: 'https://api.yelp.com/v3',
  headers: {
    Authorization: `Bearer ${API_KEY}`
  }
})

const accountsApi = axios.create({
  baseURL: 'https://wechews.herokuapp.com'
})

// getting list of resturants
const getRestaurants = (name, place) => {
  return (
    yelpApi
      .get('/businesses/search', {
        params: {
          term: name,
          location: place
        }
      })
      // returns business info from Yelp
      .then(res => {
        return {
          total: res.data.total,
          businessList: res.data.businesses.map(function (business) {
            return {
              name: business.name,
              distance: business.distance,
              categories: business.categories,
              reviewCount: business.review_count,
              rating: business.rating,
              price: business.price,
              phone: business.display_phone,
              location: business.location,
              isClosed: business.is_closed
            }
          })
        }
      })
      .catch(error => {
        return error.response.status
      })
  )
}

// creates user and returns id
const createFBUser = (name, id, username, email, photo) => {
  return accountsApi
    .post('/accounts', {
      params: {
        id: id,
        name: name,
        username: username,
        email: email,
<<<<<<< HEAD
        photo: photo,
        inSession: false
=======
        photo: photo
>>>>>>> d683c0d0e5e358ce448a34862fbb554019c201c4
      }
    })
    .then(res => {
      console.log(res.data.user)
      return {
        id: res.data.user.id,
        status: res.status
      }
    })
    .catch(error => {
      return error.response.status
    })
}

// gets list of users
const getAllUsers = () => {
  return accountsApi
    .get('/accounts')
    .then(res => {
      console.log(res.data)
      return {
        status: res.status,
        userList: res.data.users.map(function (users) {
          // returns individual user info
          return {
            name: users.name,
            username: users.username
          }
        })
      }
    })
    .catch(error => {
      return error.response.status
    })
}

// deletes user and returns status
const deleteUser = () => {
  return accountsApi
    .delete(`/accounts/${saved_id}`)
    .then(res => {
      console.log(res.status)
      return res.status
    })
    .catch(error => {
      return error.response.status
    })
}

// gets user by id and returns user info
const getUser = () => {
  return accountsApi
    .get(`/accounts/${saved_id}`)
    .then(res => {
      console.log(res.data)
      return {
        status: res.status,
        user: res.data.user.map(function (user) {
          return {
            name: user.name,
            username: user.username,
            email: user.email,
            phone_number: user.phone_number
          }
        })
      }
    })
    .catch(error => {
      return error.response.status
    })
}

// update email and returns status
<<<<<<< HEAD
const updateEmail = (info) => {
  const req = {
    email: info
  }
  return updateUser(global.id, req)
}

// update username and returns status
const updateUsername = (info) => {
  const req = {
    username: info
  }
  return updateUser(global.id, req)
}

// update username and returns status
const updateName = (info) => {
  const req = {
    name: info
  }
  return updateUser(global.id, req)
}

// update username and returns status
const updatePhoneNumber = (info) => {
  const req = {
    phone_number: info
  }
  return updateUser(global.id, req)
}

// updates user and returns status
const updateUser = (req) => {
  return accountsApi
    .put(`/accounts/${global.id}`, {
=======
const updateEmail = info => {
  const req = {
    email: info
  }
  return updateUser(saved_id, req)
}

// update username and returns status
const updateUsername = info => {
  const req = {
    username: info
  }
  return updateUser(saved_id, req)
}

// update username and returns status
const updateName = info => {
  const req = {
    name: info
  }
  return updateUser(saved_id, req)
}

// update username and returns status
const updatePhoneNumber = info => {
  const req = {
    phone_number: info
  }
  return updateUser(saved_id, req)
}

// updates user and returns status
const updateUser = req => {
  return accountsApi
    .put(`/accounts/${saved_id}`, {
>>>>>>> d683c0d0e5e358ce448a34862fbb554019c201c4
      params: req
    })
    .then(res => {
      console.log(res.status)
      return {
        status: res.status,
        user: res.data.user.map(function (user) {
          return {
            name: user.name,
            username: user.username,
            email: user.email,
            phone_number: user.phone_number
          }
        })
      }
    })
    .catch(error => {
      return error.response.status
    })
}

// checks username and returns status
const checkUsername = username => {
  return accountsApi
    .get(`/username/${username}`)
    .then(res => {
      return res.status
    })
    .catch(error => {
      console.log(error.response.status)
      return error.response.status
    })
}

// checks phone number and returns status
const checkPhoneNumber = phoneNumber => {
  return accountsApi
    .get(`/phoneNumber/${phoneNumber}`)
    .then(res => {
      console.log(res.status)
      return res.status
    })
    .catch(error => {
      return error.response.status
    })
}

export default {
  getRestaurants,
  createFBUser,
  getAllUsers,
  deleteUser,
  getUser,
  updateEmail,
  updateUsername,
  updateName,
  updatePhoneNumber,
  checkUsername,
  checkPhoneNumber
}
