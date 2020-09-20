import axios from 'axios'
import { ID } from 'react-native-dotenv'
//import { View, Text } from PermissionsAndroid from 'react-native'
import AsyncStorage from '@react-native-community/async-storage'

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

var myId = ''

AsyncStorage.getItem(ID).then(res => {
  myId = res
})

const accountsApi = axios.create({
  baseURL: 'https://wechews.herokuapp.com'
})

// creates user and returns id
const createFBUser = (name, id, username, email, photo) => {
  return accountsApi
    .post('/accounts', {
      params: {
        id: id,
        name: name,
        username: username,
        email: email,
        photo: photo,
        inSession: false
      }
    })
    .then(res => {
      return {
        id: res.data.user.id,
        status: res.status
      }
    })
    .catch(error => {
      throw error
    })
}

// gets list of users
const getAllUsers = () => {
  return accountsApi
    .get('/accounts')
    .then(res => {
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
      throw error
    })
}

// deletes user and returns status
const deleteUser = () => {
  return accountsApi
    .delete(`/accounts/${myId}`)
    .then(res => {
      return res.status
    })
    .catch(error => {
      throw error
    })
}

// gets user by id and returns user info
const getUser = () => {
  return accountsApi
    .get(`/accounts/${myId}`)
    .then(res => {
      return {
        status: res.status,
        username: res.data.user.username,
        email: res.data.user.email,
        phone_number: res.data.user.phone_number,
        name: res.name
      }
    })
    .catch(error => {
      throw error
    })
}

// update email and returns status
const updateEmail = info => {
  const req = {
    email: info
  }
  return updateUser(req)
}

// update username and returns status
const updateUsername = info => {
  const req = {
    username: info
  }
  return updateUser(req)
}

// update username and returns status
const updateName = info => {
  const req = {
    name: info
  }
  return updateUser(req)
}

// update username and returns status
const updatePhoneNumber = info => {
  const req = {
    phone_number: info
  }
  return updateUser(req)
}

// updates user and returns status
const updateUser = req => {
  return accountsApi
    .put(`/accounts/${myId}`, {
      params: req
    })
    .then(res => {
      return {
        status: res.status,
        name: res.data.name,
        username: res.data.username,
        email: res.data.email,
        phone_number: res.data.phone_number
      }
    })
    .catch(error => {
      throw error
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
      throw error
    })
}

// checks phone number and returns status
const checkPhoneNumber = phoneNumber => {
  return accountsApi
    .get(`/phoneNumber/${phoneNumber}`)
    .then(res => {
      return res.status
    })
    .catch(error => {
      throw error
    })
}

export default {
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
