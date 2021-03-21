const getRestaurants = jest
  .fn(async () => Promise.reject())
  .mockImplementationOnce(async () =>
    Promise.resolve({
      businessList: [
        {
          id: '4H86Ob5uf4GLNVRzunBNSA',
          name: 'Ho Chow Restaurant',
          distance: '5.4',
          reviewCount: 345,
          rating: 3.5,
          price: '$$',
          phone: '(510) 657-0683',
          city: 'Fremont',
          latitude: 37.4767594740515,
          longitude: -121.921156109449,
          url:
            'https://www.yelp.com/biz/ho-chow-restaurant-fremont?adjust_creative=DPCbYHGBwXPeGeSl0fSj2Q&utm_campaign=yelp_api_v3&utm_medium=api_v3_business_search&utm_source=DPCbYHGBwXPeGeSl0fSj2Q',
          transactions: ['pickup'],
          categories: [[Object], [Object]],
        },
        {
          id: 'PPwmpycJoI-tOQ3VOJyDsg',
          name: 'Happy Lamb Hot Pot',
          distance: '4.1',
          reviewCount: 920,
          rating: 3.5,
          price: '$$',
          phone: '(510) 675-9919',
          city: 'Union City',
          latitude: 37.5877,
          longitude: -122.02183,
          url:
            'https://www.yelp.com/biz/happy-lamb-hot-pot-union-city?adjust_creative=DPCbYHGBwXPeGeSl0fSj2Q&utm_campaign=yelp_api_v3&utm_medium=api_v3_business_search&utm_source=DPCbYHGBwXPeGeSl0fSj2Q',
          transactions: ['delivery'],
          categories: [[Object], [Object], [Object]],
        },
        {
          id: '27HJodh8E3gsSo7uVFQy5A',
          name: 'Fu Lam Moon Restaurant',
          distance: '1.0',
          reviewCount: 351,
          rating: 3,
          price: '$$',
          phone: '(510) 668-1333',
          city: 'Fremont',
          latitude: 37.52066,
          longitude: -121.9883,
          url:
            'https://www.yelp.com/biz/fu-lam-moon-restaurant-fremont?adjust_creative=DPCbYHGBwXPeGeSl0fSj2Q&utm_campaign=yelp_api_v3&utm_medium=api_v3_business_search&utm_source=DPCbYHGBwXPeGeSl0fSj2Q',
          transactions: ['delivery'],
          categories: [[Object], [Object]],
        },
        {
          id: 'q4TFULSMVoebvbJfnCYzmQ',
          name: 'Shinry Lamian',
          distance: '2.3',
          reviewCount: 126,
          rating: 3.5,
          price: '$$',
          phone: '(510) 792-6660',
          city: 'Fremont',
          latitude: 37.56291,
          longitude: -122.01009,
          url:
            'https://www.yelp.com/biz/shinry-lamian-fremont-3?adjust_creative=DPCbYHGBwXPeGeSl0fSj2Q&utm_campaign=yelp_api_v3&utm_medium=api_v3_business_search&utm_source=DPCbYHGBwXPeGeSl0fSj2Q',
          transactions: ['delivery'],
          categories: [[Object], [Object]],
        },
      ],
    }),
  )
module.exports = {
  getRestaurants,
}
