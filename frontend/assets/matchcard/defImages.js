// Cuisine = 1, Type = 2
const foodImages = {
    'African': {
      img: require('./African.svg'),
      val: 1,
      priority: 1
    },
    'Ice Cream & Frozen Yogurt': {
      img: require('./Yogurt.svg'),
      val: 1,
      priority: 1
    },
    'Australian': {
      img: require('./Australian.svg'),
      val: 1,
      priority: 1
    },
    'Modern Australian': {
      img: 'Australian',
      val: 1,
      priority: 1
    },
    'New Zealand': {
      img: 'Australian',
      val: 1,
      priority: 1
    },
    'Creperies': {
      img: require('./Bakery.svg'),
      val: 1,
      priority: 2
    },
    'Baguettes': {
      img: require('./Bakery2.svg'),
      val: 1,
      priority: 2
    },
    'Breakfast & Brunch': {
      img: require('./Breakfast.svg'),
      val: 1,
      priority: 2
    },
    'Diners': {
      img: require('./Bacon.svg'),
      val: 1,
      priority: 2
    },
    'Desserts': {
      img: require('./Pie.svg'),
      val: 1,
      priority: 2
    },
    'Waffles': {
      img: 'Breakfast & Brunch',
      val: 1,
      priority: 2
    },
    'British': {
      img: require('./British.svg'),
      val: 1,
      priority: 1
    },
    'Fish & Chips': {
      img: 'British',
      val: 1,
      priority: 2
    },
    'Burmese': {
      img: require('./Burmese.svg'),
      val: 1,
      priority: 1
    },
    'Cafes': {
      img: require('./Cafes.svg'),
      val: 1,
      priority: 2
    },
    'Hong Kong Style Cafe': {
      img: 'Cafes',
      val: 1,
      priority: 2
    },
    'Coffeeshops': {
      img: 'Cafes',
      val: 1,
      priority: 2
    },
    'Coffee & Tea': {
      img: 'Cafes',
      val: 1,
      priority: 2
    },
    'Cambodian': {
      img: require('./Cambodian.svg'),
      val: 1,
      priority: 1
    },
    'Canadian': {
      img: require('./Canadian.svg'),
      val: 1,
      priority: 1
    },
    'Caribbean': {
      img: require('./Caribbean.svg'),
      val: 1,
      priority: 2
    },
    'Cajun/Creole': {
      img: 'Caribbean',
      val: 1,
      priority: 2
    },
    'Chicken Wings': {
      img: require('./ChickenWings.svg'),
      val: 1,
      priority: 2
    },
    'Chicken Shop': {
      img: 'Chicken Wings',
      val: 1,
      priority: 2
    },
    'Rotisserie Chicken': {
      img: 'Chicken Wings',
      val: 1,
      priority: 2
    },
    'Chinese': {
      img: require('./Chinese.svg'),
      choices: [require('./Chinese.svg'),require('./Fortune_Cookie.svg'),require('./Zong_Zi.svg'),require('./Tanghulu.svg'),],
      val: 4,
      priority: 1
    },
    'Dim Sum': {
      img: require('./Egg_Tart.svg'),
      val: 1,
      priority: 2
    },
    'Dumplings': {
      img: require('./Chinese.svg'),
      val: 1,
      priority: 2
    },
    'Hot Pot': {
      img: require('./Hotpot.svg'),
      val: 1,
      priority: 2
    },
    'Cantonese': {
      img: require('./Congee.svg'),
      val: 1,
      priority: 2
    },
    'Wok': {
      img: require('./Chinese.svg'),
      val: 1,
      priority: 2
    },
    'Cuban': {
      img: require('./Cuban.svg'),
      val: 1,
      priority: 1
    },
    'Ethiopian': {
      img: require('./Ethiopian.svg'),
      val: 1,
      priority: 1
    },
    'Filipino': {
      img: require('./Filipino.svg'),
      val: 1,
      priority: 1
    },
    'French': {
      img: require('./French.svg'),
      val: 1,
      priority: 1
    },
    'Bistro': {
      img: 'French',
      val: 1,
      priority: 2
    },
    'French Southwest': {
      img: 'French',
      val: 1,
      priority: 1
    },
    'German': {
      img: require('./German.svg'),
      val: 1,
      priority: 1
    },
    'Bavarian': {
      img: 'German',
      val: 1,
      priority: 1
    },
    'Fischbroetchen': {
      img: 'German',
      val: 1,
      priority: 2
    },
    'Schnitzel': {
      img: 'German',
      val: 1,
      priority: 2
    },
    'Greek': {
      img: require('./Greek.svg'),
      val: 1,
      priority: 1
    },
    'Wraps': {
      img: 'Greek',
      val: 1,
      priority: 2
    },
    'Middle Eastern': {
      img: require('./Halal_Middle_Eastern.svg'),
      val: 1,
      priority: 1
    },
    'Halal': {
      img: 'Middle Eastern',
      val: 1,
      priority: 2
    },
    'Burgers': {
      img: require('./Hamburger.svg'),
      val: 1,
      priority: 2
    },
    'Fast Food': {
      img: 'Burgers',
      val: 1,
      priority: 1
    },
    'Hawaiian': {
      img: require('./Hawaiian.svg'),
      val: 1,
      priority: 2
    },
    'Polynesian': {
      img: require('./Hawaiian_Polynesian.svg'),
      val: 1,
      priority: 1
    },
    'Hot Dog': {
      img: require('./Hot_Dog.svg'),
      val: 1,
      priority: 2
    },
    'American (New)': {
      img: 'Caribbean',
      val: 1,
      priority: 1
    },
    'American (Traditional)': {
      img: 'Hamburger',
      val: 1,
      priority: 1
    },
    'Indian': {
      img: require('./Indian.svg'),
      choices: [require('./Indian.svg'), require('./Samosas.svg')],
      val: 2,
      priority: 1
    },
    'Pakistani': {
      img: 'Indian',
      val: 1,
      priority: 1
    },
    'Indonesian': {
      img: require('./Indonesian.svg'),
      val: 1,
      priority: 1
    },
    'Irish': {
      img: require('./Irish_Bars.svg'),
      val: 1,
      priority: 1
    },
    'Island Pub': {
      img: 'Irish',
      val: 1,
      priority: 1
    },
    'Beer Garden': {
      img: 'Irish',
      val: 1,
      priority: 2
    },
    'Beer Hall': {
      img: 'Irish',
      val: 1,
      priority: 2
    },
    'Gastropubs': {
      img: 'Irish',
      val: 1,
      priority: 2
    },
    'Irish Pub': {
      img: 'Irish',
      val: 1,
      priority: 2
    },
    'Italian': {
      img: require('./Italian.svg'),
      val: 1,
      priority: 1
    },
    'Japanese': {
      img: require('./Japanese.svg'),
      choices: [require('./Japanese.svg'),require('./Onigiri.svg'),require('./Bento.svg'),],
      val: 3,
      priority: 1
    },
    'Ramen': {
      img: require('./Japanese.svg'),
      val: 1,
      priority: 1
    },
    'Nikkei': {
      img: 'Japanese',
      val: 1,
      priority: 1
    },
    'Noodles': {
      img: require('./Japanese.svg'),
      val: 1,
      priority: 1
    },
    'Kebab': {
      img: require('./Kebab_Middle_Eastern.svg'),
      val: 1,
      priority: 1
    },
    'Korean': {
      img: require('./Korean.svg'),
      choices:[require('./Korean.svg'), require('./Pancake.svg'),],
      val: 3,
      priority: 1
    },
    'Mediterranean': {
      img: require('./Mediterranean.svg'),
      val: 1,
      priority: 1
    },
    'Pita': {
      img: 'Mediterranean',
      val: 1,
      priority: 2
    },
    'Mexican': {
      img: require('./Mexican.svg'),
      val: 1,
      priority: 1
    },
    'Tex-Mex': {
      img: 'Mexican',
      val: 1,
      priority: 1
    },
    'Mongolian': {
      img: require('./Mongolian.svg'),
      val: 1,
      priority: 1
    },
    'Moroccan': {
      img: require('./Moroccan.svg'),
      val: 1,
      priority: 1
    },
    'Peruvian': {
      img: require('./Peruvian.svg'),
      val: 1,
      priority: 1
    },
    'Pizza': {
      img: require('./Pizza.svg'),
      val: 1,
      priority: 2
    },
    'Polish': {
      img: require('./Polish.svg'),
      val: 1,
      priority: 1
    },
    'Russian': {
      img: require('./Russian.svg'),
      val: 1,
      priority: 2
    },
    'Eastern European': {
      img: 'Russian',
      val: 1,
      priority: 1
    },
    'Soup': {
      img: 'Russian',
      val: 1,
      priority: 2
    },
    'Ukrainian': {
      img: 'Russian',
      val: 1,
      priority: 2
    },
    'Salad': {
      img: require('./Salad.svg'),
      val: 1,
      priority: 2
    },
    'Vegetarian': {
      img: 'Salad',
      val: 1,
      priority: 0.5
    },
    'Vegan': {
      img: 'Salad',
      val: 1,
      priority: 0.5
    },
    'Sandwiches': {
      img: require('./Grilled_Cheese.svg'),
      val: 1,
      priority: 2
    },
    'Delis': {
      img: require('./BLT.svg'),
      val: 1,
      priority: 2
    },
    'Open Sandwiches': {
      img: require('./PBJ.svg'),
      val: 1,
      priority: 2
    },
    'Seafood': {
      img: require('./Seafood.svg'),
      val: 1,
      priority: 2
    },
    'Live/Raw Food': {
      img: 'Seafood',
      val: 1,
      priority: 2
    },
    'Soul Food': {
      img: require('./Southern_Soulfood.svg'),
      val: 1,
      priority: 2
    },
    'Southern': {
      img: 'Soul Food',
      val: 1,
      priority: 2
    },
    'Comfort Food': {
      img: 'Soul Food',
      val: 1,
      priority: 1
    },
    'Spanish': {
      img: require('./Spanish_Tapas.svg'),
      val: 1,
      priority: 1
    },
    'Tapas Bars': {
      img: 'Spanish',
      val: 1,
      priority: 2
    },
    'Tapas/Small Plates': {
      img: 'Spanish',
      val: 1,
      priority: 1
    },
    'Sri Lankan': {
      img: require('./Sri_Lankan.svg'),
      val: 1,
      priority: 1
    },
    'Steakhouses': {
      img: require('./Steakhouse.svg'),
      val: 1,
      priority: 2
    },
    'Barbeque': {
      img: 'Steakhouses',
      val: 1,
      priority: 2
    },
    'Sushi Bars': {
      img: require('./Sushi.svg'),
      choices:[require('./Sushi.svg'),require('./Nigiri.svg'),],
      val: 2,
      priority: 2
    },
    'Swedish': {
      img: require('./Swedish_Scandinavian.svg'),
      val: 1,
      priority: 1
    },
    'Meatballs': {
      img: 'Swedish',
      val: 1,
      priority: 2
    },
    'Scandinavian': {
      img: 'Swedish',
      val: 1,
      priority: 1
    },
    'Traditional Norwegian': {
      img: 'Swedish',
      val: 1,
      priority: 2
    },
    'Traditional Swedish': {
      img: 'Swedish',
      val: 1,
      priority: 2
    },
    'Taiwanese': {
      img: require('./Taiwanese.svg'),
      val: 1,
      priority: 2
    },
    'Asian Fusion': {
      img: require('./KBBQ.svg'),
      val: 1,
      priority: 1
    },
    'Thai': {
      img: require('./Thai.svg'),
      val: 1,
      priority: 1
    },
    'Vietnamese': {
      img: require('./Vietnamese.svg'),
      val: 1,
      priority: 1
    }
  }
  export default foodImages