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
          businessList: res.data.businesses.map((business) => {
            return {
              id: business.id,
              name: business.name,
              distance: (business.distance / 1600).toFixed(1),
              reviewCount: business.review_count,
              rating: business.rating,
              price: business.price,
              phone: business.display_phone,
              city: business.location.city,
              latitude: business.coordinates.latitude,
              longitude: business.coordinates.longitude,
              url: business.url,
              transactions: business.transactions,
              categories: business.categories.map(x => x.title),
            }
          }),
        }
      })
      .catch((error) => {
        console.log(error)
        Promise.reject(error)
      })
  )
}

module.exports = {
  getRestaurants,
}
