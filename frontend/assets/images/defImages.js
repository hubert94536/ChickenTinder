// Cuisine = 1, Type = 2
const assets = {
  African: require('./African.png'),
  Australian: require('./Australian.png'),
  Bacon: require('./Bacon.png'),
  Bakery: require('./Bakery.png'),
  Bakery2: require('./Bakery2.png'),
  Bento: require('./Bento.png'),
  Breakfast: require('./Breakfast.png'),
  British: require('./British.png'),
  Burmese: require('./Burmese.png'),
  Cafes: require('./Cafes.png'),
  Cambodian: require('./Cambodian.png'),
  Canadian: require('./Canadian.png'),
  Caribbean: require('./Caribbean.png'),
  ChickenWings: require('./ChickenWings.png'),
  Chinese: require('./Chinese.png'),
  Congee: require('./Congee.png'),
  Cuban: require('./Cuban.png'),
  Egg_Tart: require('./Egg_Tart.png'),
  Ethiopian: require('./Ethiopian.png'),
  Filipino: require('./Filipino.png'),
  French: require('./French.png'),
  Fortune_Cookie: require('./Fortune_Cookie.png'),
  German: require('./German.png'),
  Greek: require('./Greek.png'),
  Grilled_Cheese: require('./Grilled_Cheese.png'),
  Halal: require('./Halal_Middle_Eastern.png'),
  Hamburger: require('./Hamburger.png'),
  Hawaiian: require('./Hawaiian.png'),
  Polynesian: require('./Hawaiian_Polynesian.png'),
  HotDog: require('./Hot_Dog.png'),
  Hotpot: require('./Hotpot.png'),
  Indian: require('./Indian.png'),
  Indonesian: require('./Indonesian.png'),
  Irish: require('./Irish_Bars.png'),
  Italian: require('./Italian.png'),
  Japanese: require('./Japanese.png'),
  KBBQ: require('./KBBQ.png'),
  Kebab: require('./Kebab_Middle_Eastern.png'),
  Korean: require('./Korean.png'),
  Mediterranean: require('./Mediterranean.png'),
  Mexican: require('./Mexican.png'),
  Mongolian: require('./Mongolian.png'),
  Moroccan: require('./Moroccan.png'),
  Nigiri: require('./Nigiri.png'),
  Onigiri: require('./Onigiri.png'),
  PBJ: require('./PBJ.png'),
  Pancake: require('./Pancake.png'),
  Peruvian: require('./Peruvian.png'),
  Pie: require('./Pie.png'),
  Pizza: require('./Pizza.png'),
  Polish: require('./Polish.png'),
  Russian: require('./Russian.png'),
  Samosas: require('./Samosas.png'),
  Salad: require('./Salad.png'),
  Sandwiches: require('./Sandwiches.png'),
  Seafood: require('./Seafood.png'),
  SoulFood: require('./Southern_Soulfood.png'),
  Spanish: require('./Spanish_Tapas.png'),
  SriLankan: require('./Sri_Lankan.png'),
  Steak: require('./Steakhouse.png'),
  Sushi: require('./Sushi.png'),
  Swedish: require('./Swedish_Scandinavian.png'),
  Taiwanese: require('./Taiwanese.png'),
  Tanghulu: require('./Tanghulu.png'),
  Thai: require('./Thai.png'),
  Vietnamese: require('./Vietnamese.png'),
  Yogurt: require('./Yogurt.png'),
  Zong_Zi: require('./Zong_Zi.png'),
}

const foodImages = {
  'Acai Bowls': {
    img: assets['Yogurt'],
    val: 1,
  },
  African: {
    img: assets['African'],
    val: 1,
  },
  Australian: {
    img: assets['Australian'],
    val: 1,
  },
  'Modern Australian': {
    img: assets['Australian'],
    val: 1,
  },
  'New Zealand': {
    img: assets['Australian'],
    val: 1,
  },
  Creperies: {
    img: assets['Bakery'],
    val: 2,
  },
  Baguettes: {
    img: assets['Bakery2'],
    val: 2,
  },
  'Breakfast & Brunch': {
    img: assets['Breakfast'],
    val: 2,
  },
  Diners: {
    img: assets['Bacon'],
    val: 2,
  },
  Waffles: {
    img: assets['Breakfast'],
    val: 2,
  },
  British: {
    img: assets['British'],
    val: 1,
  },
  'Fish & Chips': {
    img: assets['British'],
    val: 2,
  },
  Burmese: {
    img: assets['Burmese'],
    val: 1,
  },
  Cafes: {
    img: assets['Cafes'],
    val: 2,
  },
  Cantonese: {
    img: assets['Congee'],
    val: 2,
  },
  'Hong Kong Style Cafe': {
    img: assets['Egg_Tart'],
    val: 2,
  },
  Coffeeshops: {
    img: assets['Cafes'],
    val: 2,
  },
  'Coffee & Tea': {
    img: assets['Cafes'],
    val: 2,
  },
  Cambodian: {
    img: assets['Cambodian'],
    val: 1,
  },
  Canadian: {
    img: assets['Canadian'],
    val: 1,
  },
  'Conveyor Belt Sushi': {
    img: assets['Nigiri'],
    val: 3,
  },
  Caribbean: {
    img: assets['Caribbean'],
    val: 2,
  },
  'Cajun/Creole': {
    img: assets['Caribbean'],
    val: 2,
  },
  'Chicken Wings': {
    img: assets['ChickenWings'],
    val: 2,
  },
  'Chicken Shop': {
    img: assets['ChickenWings'],
    val: 2,
  },
  'Rotisserie Chicken': {
    img: assets['ChickenWings'],
    val: 2,
  },
  Chinese: {
    img: assets['Chinese'],
    val: 1,
  },
  'Dim Sum': {
    img: assets['Fortune_Cookie'],
    val: 2,
  },
  'Food Stands': {
    img: assets['Tanghulu'],
    val: 1,
  },
  Desserts: {
    img: assets['Pie'],
    val: 1,
  },
  Dumplings: {
    img: assets['Chinese'],
    val: 2,
  },
  'Hot Pot': {
    img: assets['Hotpot'],
    val: 2,
  },
  Wok: {
    img: assets['Chinese'],
    val: 2,
  },
  Cuban: {
    img: assets['Cuban'],
    val: 1,
  },
  Ethiopian: {
    img: assets['Ethiopian'],
    val: 1,
  },
  Filipino: {
    img: assets['Filipino'],
    val: 1,
  },
  French: {
    img: assets['French'],
    val: 1,
  },
  Bistro: {
    img: assets['French'],
    val: 2,
  },
  'French Southwest': {
    img: assets['French'],
    val: 1,
  },
  German: {
    img: assets['German'],
    val: 1,
  },
  Bavarian: {
    img: assets['German'],
    val: 1,
  },
  Fischbroetchen: {
    img: assets['German'],
    val: 2,
  },
  Schnitzel: {
    img: assets['German'],
    val: 2,
  },
  Greek: {
    img: assets['Greek'],
    val: 1,
  },
  Izakaya: {
    img: assets['Onigiri'],
    val: 2,
  },
  Wraps: {
    img: assets['Greek'],
    val: 2,
  },
  'Middle Eastern': {
    img: assets['Samosas'],
    val: 1,
  },
  Halal: {
    img: assets['Halal'],
    val: 2,
  },
  Hamburger: {
    img: assets['Hamburger'],
    val: 2,
  },
  'Fast Food': {
    img: assets['Hamburger'],
    val: 1,
  },
  Hawaiian: {
    img: assets['Hawaiian'],
    val: 2,
  },
  Polynesian: {
    img: assets['Polynesian'],
    val: 1,
  },
  'Hot Dog': {
    img: assets['HotDog'],
    val: 2,
  },
  'American (New)': {
    img: assets['Caribbean'],
    val: 1,
  },
  'American (Traditional)': {
    img: assets['Hamburger'],
    val: 1,
  },
  Indian: {
    img: assets['Indian'],
    val: 1,
  },
  Pakistani: {
    img: assets['Indian'],
    val: 1,
  },
  'Ice Cream & Frozen Yogurt': {
    img: assets['Yogurt'],
    val: 1,
  },
  'Juice Bars & Smoothies': {
    img: assets['Yogurt'],
    val: 1,
  },
  Indonesian: {
    img: assets['Indonesian'],
    val: 1,
  },
  Irish: {
    img: assets['Irish'],
    val: 1,
  },
  'Island Pub': {
    img: assets['Irish'],
    val: 1,
  },
  'Beer Garden': {
    img: assets['Irish'],
    val: 2,
  },
  'Beer Hall': {
    img: assets['Irish'],
    val: 2,
  },
  Gastropubs: {
    img: assets['Irish'],
    val: 2,
  },
  'Irish Pub': {
    img: assets['Irish'],
    val: 2,
  },
  Italian: {
    img: assets['Italian'],
    val: 1,
  },
  Japanese: {
    img: assets['Japanese'],
    val: 1,
  },
  Ramen: {
    img: assets['Japanese'],
    val: 2,
  },
  Nikkei: {
    img: assets['Japanese'],
    val: 2,
  },
  Noodles: {
    img: assets['Japanese'],
    val: 2,
  },
  Kebab: {
    img: assets['Kebab'],
    val: 2,
  },
  Korean: {
    img: assets['Korean'],
    val: 1,
  },
  Mediterranean: {
    img: assets['Mediterranean'],
    val: 1,
  },
  Pita: {
    img: assets['Mediterranean'],
    val: 2,
  },
  Mexican: {
    img: assets['Mexican'],
    val: 1,
  },
  'Tex-Mex': {
    img: assets['Mexican'],
    val: 1,
  },
  Mongolian: {
    img: assets['Mongolian'],
    val: 1,
  },
  Moroccan: {
    img: assets['Moroccan'],
    val: 1,
  },
  Peruvian: {
    img: assets['Peruvian'],
    val: 1,
  },
  Pizza: {
    img: assets['Pizza'],
    val: 2,
  },
  Polish: {
    img: assets['Polish'],
    val: 1,
  },
  Russian: {
    img: assets['Russian'],
    val: 2,
  },
  'Eastern European': {
    img: assets['Russian'],
    val: 1,
  },
  Shanghainese: {
    img: assets['Zong_Zi'],
    val: 2,
  },
  Soup: {
    img: assets['Russian'],
    val: 2,
  },
  Ukrainian: {
    img: assets['Russian'],
    val: 2,
  },
  Salad: {
    img: assets['Salad'],
    val: 2,
  },
  Vegetarian: {
    img: assets['Salad'],
    val: 0.5,
  },
  Vegan: {
    img: assets['Salad'],
    val: 0.5,
  },
  Sandwiches: {
    img: assets['Grilled_Cheese'],
    val: 2,
  },
  Delis: {
    img: assets['Sandwiches'],
    val: 2,
  },
  'Open Sandwiches': {
    img: assets['PBJ'],
    val: 2,
  },
  Seafood: {
    img: assets['Seafood'],
    val: 2,
  },
  'Live/Raw Food': {
    img: assets['Seafood'],
    val: 2,
  },
  'Soul Food': {
    img: assets['SoulFood'],
    val: 2,
  },
  Southern: {
    img: assets['SoulFood'],
    val: 2,
  },
  'Comfort Food': {
    img: assets['SoulFood'],
    val: 1,
  },
  Spanish: {
    img: assets['Spanish'],
    val: 1,
  },
  'Tapas Bars': {
    img: assets['Spanish'],
    val: 2,
  },
  'Tapas/Small Plates': {
    img: assets['Spanish'],
    val: 1,
  },
  'Japanese Curry': {
    img: assets['Bento'],
    val: 2,
  },
  'Sri Lankan': {
    img: assets['SriLankan'],
    val: 1,
  },
  Steakhouses: {
    img: assets['Steak'],
    val: 2,
  },
  Barbeque: {
    img: assets['KBBQ'],
    val: 2,
  },
  'Sushi Bars': {
    img: assets['Sushi'],
    val: 2,
  },
  Swedish: {
    img: assets['Swedish'],
    val: 1,
  },
  Meatballs: {
    img: assets['Swedish'],
    val: 2,
  },
  Scandinavian: {
    img: assets['Swedish'],
    val: 1,
  },
  'Traditional Norwegian': {
    img: assets['Swedish'],
    val: 2,
  },
  'Traditional Swedish': {
    img: assets['Swedish'],
    val: 2,
  },
  Taiwanese: {
    img: assets['Taiwanese'],
    val: 2,
  },
  'Asian Fusion': {
    img: assets['Pancake'],
    val: 1,
  },
  Thai: {
    img: assets['Thai'],
    val: 1,
  },
  Vietnamese: {
    img: assets['Vietnamese'],
    val: 1,
  },
}
export { foodImages, assets }
