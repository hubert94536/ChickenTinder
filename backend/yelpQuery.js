const axios = require('axios')

// setting up Yelp API base caller
const yelpApi = axios.create({
  baseURL: 'https://api.yelp.com/v3',
  headers: {
    Authorization: `Bearer ${process.env.YELP_KEY}`
  }
})

// getting list of resturants
const getRestaurants = (req) => {
  return (
    yelpApi
      .get('/businesses/search', req)
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
        return Promise.reject(new Error(error.response.status))
      })
  )
}

module.exports = {
  getRestaurants
}
