// Cuisine = 1, Type = 2
const foodImages = {
  'African': {
    img: require('./African.png'),
    val: 1
  },
  'Australian': {
    img: require('./Australian.png'),
    val: 1
  },
  'Modern Australian': {
    img: 'Australian',
    val: 1
  },
  'New Zealand': {
    img: 'Australian',
    val: 1
  },
  'Creperies': {
    img: require('./Bakery.png'),
    val: 2
  },
  'Baguettes': {
    img: require('./Bakery2.png'),
    val: 2
  },
  'Breakfast & Brunch': {
    img: require('./Breakfast.png'),
    val: 2
  },
  'Diners': {
    img: 'Breakfast & Brunch',
    val: 2
  },
  'Waffles': {
    img: 'Breakfast & Brunch',
    val: 2
  },
  'British': {
    img: require('./British.png'),
    val: 1
  },
  'Fish & Chips': {
    img: 'British',
    val: 2
  },
  'Burmese': {
    img: require('./Burmese.png'),
    val: 1
  },
  'Cafes': {
    img: require('./Cafes.png'),
    val: 2
  },
  'Hong Kong Style Cafe': {
    img: 'Cafes',
    val: 2
  },
  'Coffeeshops': {
    img: 'Cafes',
    val: 2
  },
  'Coffee & Tea': {
    img: 'Cafes',
    val: 2
  },
  'Cambodian': {
    img: require('./Cambodian.png'),
    val: 1
  },
  'Canadian': {
    img: require('./Canadian.png'),
    val: 1
  },
  'Caribbean': {
    img: require('./Caribbean.png'),
    val: 2
  },
  'Cajun/Creole': {
    img: 'Caribbean',
    val: 2
  },
  'Chicken Wings': {
    img: require('./ChickenWings.png'),
    val: 2
  },
  'Chicken Shop': {
    img: 'Chicken Wings',
    val: 2
  },
  'Rotisserie Chicken': {
    img: 'Chicken Wings',
    val: 2
  },
  'Chinese': {
    img: require('./Chinese.png'),
    val: 1
  },
  'Dim Sum': {
    img: 'Chinese',
    val: 2
  },
  'Dumplings': {
    img: 'Chinese',
    val: 2
  },
  'Hot Pot': {
    img: 'Chinese',
    val: 2
  },
  'Wok': {
    img: 'Chinese',
    val: 2
  },
  'Cuban': {
    img: require('./Cuban.png'),
    val: 1
  },
  'Ethiopian': {
    img: require('./Ethiopian.png'),
    val: 1
  },
  'Filipino': {
    img: require('./Filipino.png'),
    val: 1
  },
  'French': {
    img: require('./French.png'),
    val: 1
  },
  'Bistro': {
    img: 'French',
    val: 2
  },
  'French Southwest': {
    img: 'French',
    val: 1
  },
  'German': {
    img: require('./German.png'),
    val: 1
  },
  'Bavarian': {
    img: 'German',
    val: 1
  },
  'Fischbroetchen': {
    img: 'German',
    val: 2
  },
  'Schnitzel': {
    img: 'German',
    val: 2
  },
  'Greek': {
    img: require('./Greek.png'),
    val: 1
  },
  'Wraps': {
    img: 'Greek',
    val: 2
  },
  'Middle Eastern': {
    img: require('./Halal_Middle_Eastern.png'),
    val: 1
  },
  'Halal': {
    img: 'Middle Eastern',
    val: 2
  },
  'Burgers': {
    img: require('./Hamburger.png'),
    val: 2
  },
  'Fast Food': {
    img: 'Burgers',
    val: 1
  },
  'Hawaiian': {
    img: require('./Hawaiian.png'),
    val: 2
  },
  'Polynesian': {
    img: require('./Hawaiian_Polynesian.png'),
    val: 1
  },
  'Hot Dog': {
    img: require('./Hot_Dog.png'),
    val: 2
  },
  'American (New)': {
    img: 'Caribbean',
    val: 1
  },
  'American (Traditional)': {
    img: 'Hamburger',
    val: 1
  },
  'Indian': {
    img: require('./Indian.png'),
    val: 1
  },
  'Pakistani': {
    img: 'Indian',
    val: 1
  },
  'Indonesian': {
    img: require('./Indonesian.png'),
    val: 1
  },
  'Irish': {
    img: require('./Irish_Bars.png'),
    val: 1
  },
  'Island Pub': {
    img: 'Irish',
    val: 1
  },
  'Beer Garden': {
    img: 'Irish',
    val: 2
  },
  'Beer Hall': {
    img: 'Irish',
    val: 2
  },
  'Gastropubs': {
    img: 'Irish',
    val: 2
  },
  'Irish Pub': {
    img: 'Irish',
    val: 2
  },
  'Italian': {
    img: require('./Italian.png'),
    val: 1
  },
  'Japanese': {
    img: require('./Japanese.png'),
    val: 1
  },
  'Ramen': {
    img: 'Japanese',
    val: 2
  },
  'Nikkei': {
    img: 'Japanese',
    val: 2
  },
  'Noodles': {
    img: 'Japanese',
    val: 2
  },
  'Kebab': {
    img: require('./Kebab_Middle_Eastern.png'),
    val: 2
  },
  'Korean': {
    img: require('./Korean.png'),
    val: 1
  },
  'Mediterranean': {
    img: require('./Mediterranean.png'),
    val: 1
  },
  'Pita': {
    img: 'Mediterranean',
    val: 2
  },
  'Mexican': {
    img: require('./Mexican.png'),
    val: 1
  },
  'Tex-Mex': {
    img: 'Mexican',
    val: 1
  },
  'Mongolian': {
    img: require('./Mongolian.png'),
    val: 1
  },
  'Moroccan': {
    img: require('./Moroccan.png'),
    val: 1
  },
  'Peruvian': {
    img: require('./Peruvian.png'),
    val: 1
  },
  'Pizza': {
    img: require('./Pizza.png'),
    val: 2
  },
  'Polish': {
    img: require('./Polish.png'),
    val: 1
  },
  'Russian': {
    img: require('./Russian.png'),
    val: 2
  },
  'Eastern European': {
    img: 'Russian',
    val: 1
  },
  'Soup': {
    img: 'Russian',
    val: 2
  },
  'Ukrainian': {
    img: 'Russian',
    val: 2
  },
  'Salad': {
    img: require('./Salad.png'),
    val: 2
  },
  'Vegetarian': {
    img: 'Salad',
    val: 0.5
  },
  'Vegan': {
    img: 'Salad',
    val: 0.5
  },
  'Sandwiches': {
    img: require('./Sandwiches.png'),
    val: 2
  },
  'Delis': {
    img: 'Sandwiches',
    val: 2
  },
  'Open Sandwiches': {
    img: 'Sandwiches',
    val: 2
  },
  'Seafood': {
    img: require('./Seafood.png'),
    val: 2
  },
  'Live/Raw Food': {
    img: 'Seafood',
    val: 2
  },
  'Soul Food': {
    img: require('./Southern_Soulfood.png'),
    val: 2
  },
  'Southern': {
    img: 'Soul Food',
    val: 2
  },
  'Comfort Food': {
    img: 'Soul Food',
    val: 1
  },
  'Spanish': {
    img: require('./Spanish_Tapas.png'),
    val: 1
  },
  'Tapas Bars': {
    img: 'Spanish',
    val: 2
  },
  'Tapas/Small Plates': {
    img: 'Spanish',
    val: 1
  },
  'Sri Lankan': {
    img: require('./Sri_Lankan.png'),
    val: 1
  },
  'Steakhouses': {
    img: require('./Steakhouse.png'),
    val: 2
  },
  'Barbeque': {
    img: 'Steakhouses',
    val: 2
  },
  'Sushi Bars': {
    img: require('./Sushi.png'),
    val: 2
  },
  'Swedish': {
    img: require('./Swedish_Scandinavian.png'),
    val: 1
  },
  'Meatballs': {
    img: 'Swedish',
    val: 2
  },
  'Scandinavian': {
    img: 'Swedish',
    val: 1
  },
  'Traditional Norwegian': {
    img: 'Swedish',
    val: 2
  },
  'Traditional Swedish': {
    img: 'Swedish',
    val: 2
  },
  'Taiwanese': {
    img: require('./Taiwanese.png'),
    val: 2
  },
  'Asian Fusion': {
    img: 'Taiwanese',
    val: 1
  },
  'Thai': {
    img: require('./Thai.png'),
    val: 1
  },
  'Vietnamese': {
    img: require('./Vietnamese.png'),
    val: 1
  }
}
export default foodImages