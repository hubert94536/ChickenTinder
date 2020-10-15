const axios = require('axios')

// setting up Yelp API base caller
const yelpApi = axios.create({
  baseURL: 'https://api.yelp.com/v3',
  headers: {
    Authorization: `Bearer ${process.env.YELP_KEY}`,
  },
})

// getting list of resturants
const getRestaurants = (req) => {
  return (
    yelpApi
      .get('/businesses/search', { params: req })
      // returns business info from Yelp
      .then((res) => {
        return {
          total: res.data.total,
          businessList: res.data.businesses.map((business) => {
            return {
              id: business.id,
              name: business.name,
              distance: business.distance / 1600,
              reviewCount: business.review_count,
              rating: business.rating,
              price: business.price,
              phone: business.display_phone,
              location: business.location,
              latitude: business.coordinates.latitude,
              longitude: business.coordinates.longitude,
              url: business.url,
            }
          }),
        }
      })
      .catch((error) => {
        console.log(error.response)
        throw error
      })
  )
}

module.exports = {
  getRestaurants,
}
