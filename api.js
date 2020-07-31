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
  baseURL: 'https://wechews.herokuapp.com/',
 // baseURL: 'http://localhost:3000',
  headers: {
    'Access-Control-Allow-Origin': true,
    'Content-Type': 'application/json',
    'Access-Control-Allow-Methods' : 'GET,PUT,POST,DELETE'
  },

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
const createUser = (name, username, email, phone_number) => {
  return accountsApi
  .post('/accounts', {
    params: {
      name: name,
      username: username,
      email: email,
      phone_number,
    },
  })
  .then (res => {
    console.log(res.data);
    return res.data.id;
  })
  .catch(error => console.log(error.message))
}

export default {
  getRestaurants,
  createUser
};