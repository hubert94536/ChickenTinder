import axios from 'axios'
import {API_KEY} from 'react-native-dotenv'

//setting up Yelp API base caller
const yelpApi = axios.create({
  baseURL: 'https://api.yelp.com/v3',
  headers: {
    Authorization: `Bearer ${API_KEY}`,
  },
})

const accountsApi = axios.create({
  baseURL: 'https://wechews.herokuapp.com',
})

//getting list of resturants
const getRestaurants = (name, place)  => {
  return yelpApi
    .get('/businesses/search', {
      params: {
        term: name,
        location: place,
      },
    })
    //returns business info from Yelp
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
    .catch(error => console.error(error))
}

//creates user and returns id
const createFBUser = (name, id, username, email, phone_number, photo) => {
  return accountsApi
  .post('/accounts', {
    params: {
      id: id,
      name: name,
      username: username,
      email: email,
      phone_number: phone_number,
      photo: photo,
    },
  })
  .then (res => {
    console.log(res.data.users.id);
    return {
      id: res.data.users.id,
      status: res.status
    }
  })
  .catch(error => console.log(error.message))
}

//gets list of users
const getAllUsers = () => {
  return accountsApi
  .get('/accounts')
  .then (res => {
    console.log(res.data);
    return {
      status: res.status,
      userList: res.data.users.map(function (users) { 
        //returns individual user info
        return {
            name: users.name,
            username: users.username 
        }
      })
    }
  })
  .catch(error => console.log(error.message))
}

//deletes user and returns status
const deleteUser = (id) => {
  return accountsApi
  .delete(`/accounts/${id}`)
  .then (res => {
    console.log(res.status);
    return res.status;
  })
  .catch(error => console.log(error.message))
}

//gets user by id and returns user info
const getUser = (id) => {
  return accountsApi
  .get(`/accounts/${id}`)
  .then (res => {
    console.log(res.data);
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
  .catch(error => console.log(error.message))
}

//update email and returns status
const updateEmail = (id, info) => {
  let req = {
    email: info
  }
  return updateUser(id,req)
}

//update username and returns status
const updateUsername = (id, info) => {
  let req = {
    username: info
  }
  return updateUser(id,req)
}

//update username and returns status
const updateName = (id, info) => {
  let req = {
    name: info
  }
  return updateUser(id,req)
}

//update username and returns status
const updatePhoneNumber = (id, info) => {
  let req = {
    phone_number: info
  }
  return updateUser(id,req)
}

//updates user and returns status
const updateUser = (id, req) => {
  return accountsApi
  .put(`/accounts/${id}`, {
    params: req
  })
  .then (res => {
    console.log(res.status);
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
  .catch(error => console.log(error.message))
}

//checks username and returns status
const checkUsername = (username) => {
  return accountsApi
  .get('/username', {
    params: {
      username: username,
    }
  })
  .then (res => {
    console.log(res.status);
    return res.status;
  })
  .catch(error => console.log(error.message))
}

//checks phone number and returns status
const checkPhoneNumber = (phoneNumber) => {
  return accountsApi
  .get('/phoneNumber', {
    params: {
      phone_number: phoneNumber,
    }
  })
  .then (res => {
    console.log(res.status);
    return res.status;
  })
  .catch(error => console.log(error.message))
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
};