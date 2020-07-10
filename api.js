import axios from 'axios'
import {API_KEY} from 'react-native-dotenv'

//setting up Yelp API base caller
const api = axios.create({
  baseURL: 'https://api.yelp.com/v3',
  headers: {
    Authorization: `Bearer ${API_KEY}`,
  },
})

//getting list of resturants
const getRestaurants = (name, place)  => {
  return api
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

export default {
  getRestaurants,
};