const cardImages = [
  require('./African.png'),
  require('./Australian.png'),
  require('./Bakery.png'),
  require('./Bakery2.png'),
  require('./Breakfast.png'),
  require('./British.png'),
  require('./Burmese.png'),
  require('./Cafes.png'),
  require('./Cambodian.png'),
  require('./Canadian.png'),
  require('./Caribbean.png'),
  require('./ChickenWings.png'),
  require('./chinese.png'),
  require('./Cuban.png'),
  require('./Ethiopian.png'),
  require('./Filipino.png'),
  require('./French.png'),
  require('./German.png'),
  require('./Greek.png'),
  require('./Halal_Middle_Eastern.png'),
  require('./hamburger.png'),
  require('./Hawaiian.png'),
  require('./Hawaiian_Polynesian.png'),
  require('./Hot_Dog.png'),
  require('./indian.png'),
  require('./Indonesian.png'),
  require('./Irish_Bars.png'),
  require('./italian.png'),
  require('./japanese.png'),
  require('./Kebab_Middle_Eastern.png'),
  require('./korean.png'),
  require('./Mediterranean.png'),
  require('./mexican.png'),
  require('./mongolian.png'),
  require('./Moroccan.png'),
  require('./Peruvian.png'),
  require('./Pizza.png'),
  require('./Polish.png'),
  require('./Russian.png'),
  require('./Salad.png'),
  require('./Sandwiches.png'),
  require('./Seafood.png'),
  require('./Southern_Soulfood.png'),
  require('./Spanish_Tapas.png'),
  require('./Sri_Lankan.png'),
  require('./Steakhouse.png'),
  require('./Sushi.png'),
  require('./Swedish_Scandinavian.png'),
  require('./Taiwanese.png'),
  require('./thai.png'),
  require('./Vietnamese.png'),
]

const generalCardImages = [
  require('./General1.png'),
  require('./General2.png'),
  require('./General3.png'),
]

const foodImages = [
  require('../images/African.png'),
  require('../images/Australian.png'),
  require('../images/Bakery.png'),
  require('../images/Bakery2.png'),
  require('../images/Breakfast.png'),
  require('../images/British.png'),
  require('../images/Burmese.png'),
  require('../images/Cafes.png'),
  require('../images/Cambodian.png'),
  require('../images/Canadian.png'),
  require('../images/Caribbean.png'),
  require('../images/ChickenWings.png'),
  require('../images/chinese.png'),
  require('../images/Cuban.png'),
  require('../images/Ethiopian.png'),
  require('../images/Filipino.png'),
  require('../images/French.png'),
  require('../images/German.png'),
  require('../images/Greek.png'),
  require('../images/Halal_Middle_Eastern.png'),
  require('../images/hamburger.png'),
  require('../images/Hawaiian.png'),
  require('../images/Hawaiian_Polynesian.png'),
  require('../images/Hot_Dog.png'),
  require('../images/indian.png'),
  require('../images/Indonesian.png'),
  require('../images/Irish_Bars.png'),
  require('../images/italian.png'),
  require('../images/japanese.png'),
  require('../images/Kebab_Middle_Eastern.png'),
  require('../images/korean.png'),
  require('../images/Mediterranean.png'),
  require('../images/mexican.png'),
  require('../images/mongolian.png'),
  require('../images/Moroccan.png'),
  require('../images/Peruvian.png'),
  require('../images/Pizza.png'),
  require('../images/Polish.png'),
  require('../images/Russian.png'),
  require('../images/Salad.png'),
  require('../images/Sandwiches.png'),
  require('../images/Seafood.png'),
  require('../images/Southern_Soulfood.png'),
  require('../images/Spanish_Tapas.png'),
  require('../images/Sri_Lankan.png'),
  require('../images/Steakhouse.png'),
  require('../images/Sushi.png'),
  require('../images/Swedish_Scandinavian.png'),
  require('../images/Taiwanese.png'),
  require('../images/thai.png'),
  require('../images/Vietnamese.png'),
]

const generalFoodImages = [
  require('../images/General1.png'),
  require('../images/General2.png'),
  require('../images/General3.png'),
]

const matchImages = [
  require('../matchcard/African.png'),
  require('../matchcard/Australian.png'),
  require('../matchcard/Bakery.png'),
  require('../matchcard/Bakery2.png'),
  require('../matchcard/Breakfast.png'),
  require('../matchcard/British.png'),
  require('../matchcard/Burmese.png'),
  require('../matchcard/Cafes.png'),
  require('../matchcard/Cambodian.png'),
  require('../matchcard/Canadian.png'),
  require('../matchcard/Caribbean.png'),
  require('../matchcard/ChickenWings.png'),
  require('../matchcard/chinese.png'),
  require('../matchcard/Cuban.png'),
  require('../matchcard/Ethiopian.png'),
  require('../matchcard/Filipino.png'),
  require('../matchcard/French.png'),
  require('../matchcard/German.png'),
  require('../matchcard/Greek.png'),
  require('../matchcard/Halal_Middle_Eastern.png'),
  require('../matchcard/hamburger.png'),
  require('../matchcard/Hawaiian.png'),
  require('../matchcard/Hawaiian_Polynesian.png'),
  require('../matchcard/Hot_Dog.png'),
  require('../matchcard/indian.png'),
  require('../matchcard/Indonesian.png'),
  require('../matchcard/Irish_Bars.png'),
  require('../matchcard/italian.png'),
  require('../matchcard/japanese.png'),
  require('../matchcard/Kebab_Middle_Eastern.png'),
  require('../matchcard/korean.png'),
  require('../matchcard/Mediterranean.png'),
  require('../matchcard/mexican.png'),
  require('../matchcard/mongolian.png'),
  require('../matchcard/Moroccan.png'),
  require('../matchcard/Peruvian.png'),
  require('../matchcard/Pizza.png'),
  require('../matchcard/Polish.png'),
  require('../matchcard/Russian.png'),
  require('../matchcard/Salad.png'),
  require('../matchcard/Sandwiches.png'),
  require('../matchcard/Seafood.png'),
  require('../matchcard/Southern_SoulFood.png'),
  require('../matchcard/Spanish_Tapas.png'),
  require('../matchcard/Sri_Lankan.png'),
  require('../matchcard/Steakhouse.png'),
  require('../matchcard/Sushi.png'),
  require('../matchcard/Swedish_Scandinavian.png'),
  require('../matchcard/Taiwanese.png'),
  require('../matchcard/thai.png'),
  require('../matchcard/Vietnamese.png'),
]

const generalMatchImages = [
  require('../matchcard/General1.png'),
  require('../matchcard/General2.png'),
  require('../matchcard/General3.png'),
]

export default function getCusine(restaurant) {
  for (var i = 0; i < restaurant.categories.length; i++) {
    if (restaurant.categories[i].title === 'African') {
      restaurant.image = cardImages[0]
      restaurant.matchImage = matchImages[0]
      restaurant.topImage = foodImages[0]
      return restaurant
    } else if (
      restaurant.categories[i].title === 'Australian' ||
      restaurant.categories[i].title === 'Modern Australian' ||
      restaurant.categories[i].title === 'New Zealand'
    ) {
      restaurant.image = cardImages[1]
      restaurant.matchImage = matchImages[1]
      restaurant.topImage = foodImages[1]
      return restaurant
    } else if (restaurant.categories[i].title === 'Creperies') {
      restaurant.image = cardImages[2]
      restaurant.matchImage = matchImages[2]
      restaurant.topImage = foodImages[2]
      return restaurant
    } else if (restaurant.categories[i].title === 'Baguettes') {
      restaurant.image = cardImages[3]
      restaurant.matchImage = matchImages[3]
      restaurant.topImage = foodImages[3]
      return restaurant
    } else if (
      restaurant.categories[i].title === 'Breakfast & Brunch' ||
      restaurant.categories[i].title === 'Diners' ||
      restaurant.categories[i].title === 'Waffles'
    ) {
      restaurant.image = cardImages[4]
      restaurant.matchImage = matchImages[4]
      restaurant.topImage = foodImages[4]
      return restaurant
    } else if (
      restaurant.categories[i].title === 'British' ||
      restaurant.categories[i].title === 'Fish & Chips'
    ) {
      restaurant.image = cardImages[5]
      restaurant.matchImage = matchImages[5]
      restaurant.topImage = foodImages[5]
      return restaurant
    } else if (restaurant.categories[i].title === 'Burmese') {
      restaurant.image = cardImages[6]
      restaurant.matchImage = matchImages[6]
      restaurant.topImage = foodImages[6]
      return restaurant
    } else if (
      restaurant.categories[i].title === 'Cafes' ||
      restaurant.categories[i].title === 'Hong Kong Style Cafe' ||
      restaurant.categories[i].title === 'Coffeeshops' ||
      restaurant.categories[i].title === 'Coffee & Tea'
    ) {
      restaurant.image = cardImages[7]
      restaurant.matchImage = matchImages[7]
      restaurant.topImage = foodImages[7]
      return restaurant
    } else if (restaurant.categories[i].title === 'Cambodian') {
      restaurant.image = cardImages[8]
      restaurant.matchImage = matchImages[8]
      restaurant.topImage = foodImages[8]
      return restaurant
    } else if (restaurant.categories[i].title === 'Canadian') {
      restaurant.image = cardImages[9]
      restaurant.matchImage = matchImages[9]
      restaurant.topImage = foodImages[9]
      return restaurant
    } else if (
      restaurant.categories[i].title === 'Cajun/Creole' ||
      restaurant.categories[i].title === 'Caribbean'
    ) {
      restaurant.image = cardImages[10]
      restaurant.matchImage = matchImages[10]
      restaurant.topImage = foodImages[10]
      return restaurant
    } else if (
      restaurant.categories[i].title === 'Chicken Shop' ||
      restaurant.categories[i].title === 'Chicken Wings' ||
      restaurant.categories[i].title === 'Rotisserie Chicken'
    ) {
      restaurant.image = cardImages[11]
      restaurant.matchImage = matchImages[11]
      restaurant.topImage = foodImages[11]
      return restaurant
    } else if (
      restaurant.categories[i].title === 'Chinese' ||
      restaurant.categories[i].title === 'Dumplings' ||
      restaurant.categories[i].title === 'Hot Pot' ||
      restaurant.categories[i].title === 'Wok'
    ) {
      restaurant.image = cardImages[12]
      restaurant.matchImage = matchImages[12]
      restaurant.topImage = foodImages[12]
      return restaurant
    } else if (restaurant.categories[i].title === 'Cuban') {
      restaurant.image = cardImages[13]
      restaurant.matchImage = matchImages[13]
      restaurant.topImage = foodImages[13]
      return restaurant
    } else if (restaurant.categories[i].title === 'Ethiopian') {
      restaurant.image = cardImages[14]
      restaurant.matchImage = matchImages[14]
      restaurant.topImage = foodImages[14]
      return restaurant
    } else if (restaurant.categories[i].title === 'Filipino') {
      restaurant.image = cardImages[15]
      restaurant.matchImage = matchImages[15]
      restaurant.topImage = foodImages[15]
      return restaurant
    } else if (
      restaurant.categories[i].title === 'Bistro' ||
      restaurant.categories[i].title === 'French' ||
      restaurant.categories[i].title === 'French Southwest'
    ) {
      restaurant.image = cardImages[16]
      restaurant.matchImage = matchImages[16]
      restaurant.topImage = foodImages[16]
      return restaurant
    } else if (
      restaurant.categories[i].title === 'Bavarian' ||
      restaurant.categories[i].title === 'Fischbroetchen' ||
      restaurant.categories[i].title === 'German' ||
      restaurant.categories[i].title === 'Schnitzel'
    ) {
      restaurant.image = cardImages[17]
      restaurant.matchImage = matchImages[17]
      restaurant.topImage = foodImages[17]
      return restaurant
    } else if (
      restaurant.categories[i].title === 'Greek' ||
      restaurant.categories[i].title === 'Wraps'
    ) {
      restaurant.image = cardImages[18]
      restaurant.matchImage = matchImages[18]
      restaurant.topImage = foodImages[18]
      return restaurant
    } else if (
      restaurant.categories[i].title === 'Halal' ||
      restaurant.categories[i].title === 'Middle Eastern'
    ) {
      restaurant.image = cardImages[19]
      restaurant.matchImage = matchImages[19]
      restaurant.topImage = foodImages[19]
      return restaurant
    } else if (
      restaurant.categories[i].title === 'Burgers' ||
      restaurant.categories[i].title === 'Fast Food'
    ) {
      restaurant.image = cardImages[20]
      restaurant.matchImage = matchImages[20]
      restaurant.topImage = foodImages[20]
      return
    } else if (restaurant.categories[i].title === 'Hawaiian') {
      restaurant.image = cardImages[21]
      restaurant.matchImage = matchImages[21]
      restaurant.topImage = foodImages[21]
      return restaurant
    } else if (restaurant.categories[i].title === 'Polynesian') {
      restaurant.image = cardImages[22]
      restaurant.matchImage = matchImages[22]
      restaurant.topImage = foodImages[22]
      return restaurant
    } else if (
      restaurant.categories[i].title === 'American (New)' ||
      restaurant.categories[i].title === 'American (Traditional)' ||
      restaurant.categories[i].title === 'Hot Dogs'
    ) {
      restaurant.image = cardImages[23]
      restaurant.matchImage = matchImages[23]
      restaurant.topImage = foodImages[23]
      return restaurant
    } else if (
      restaurant.categories[i].title === 'Indian' ||
      restaurant.categories[i].title === 'Pakistani'
    ) {
      restaurant.image = cardImages[24]
      restaurant.matchImage = matchImages[24]
      restaurant.topImage = foodImages[24]
      return restaurant
    } else if (restaurant.categories[i].title === 'Indonesian') {
      restaurant.image = cardImages[25]
      restaurant.matchImage = matchImages[25]
      restaurant.topImage = foodImages[25]
      return restaurant
    } else if (
      restaurant.categories[i].title === 'Beer Garden' ||
      restaurant.categories[i].title === 'Beer Hall' ||
      restaurant.categories[i].title === 'Gastropubs' ||
      restaurant.categories[i].title === 'Irish' ||
      restaurant.categories[i] === 'Island Pub'
    ) {
      restaurant.image = cardImages[26]
      restaurant.matchImage = matchImages[26]
      restaurant.topImage = foodImages[26]
      return restaurant
    } else if (restaurant.categories[i].title === 'Italian') {
      restaurant.image = cardImages[27]
      restaurant.matchImage = matchImages[27]
      restaurant.topImage = foodImages[27]
      return restaurant
    } else if (
      restaurant.categories[i].title === 'Japanese' ||
      restaurant.categories[i].title === 'Nikkei' ||
      restaurant.categories[i].title === 'Noodles'
    ) {
      restaurant.image = cardImages[28]
      restaurant.matchImage = matchImages[28]
      restaurant.topImage = foodImages[28]
      return restaurant
    } else if (restaurant.categories[i].title === 'Kebab') {
      restaurant.image = cardImages[29]
      restaurant.matchImage = matchImages[29]
      restaurant.topImage = foodImages[29]
      return restaurant
    } else if (restaurant.categories[i].title === 'Korean') {
      restaurant.image = cardImages[30]
      restaurant.matchImage = matchImages[30]
      restaurant.topImage = foodImages[30]
      return restaurant
    } else if (
      restaurant.categories[i].title === 'Mediterranean' ||
      restaurant.categories[i].title === 'Pita'
    ) {
      restaurant.image = cardImages[31]
      restaurant.matchImage = matchImages[31]
      restaurant.topImage = foodImages[31]
      return restaurant
    } else if (
      restaurant.categories[i].title === 'Mexican' ||
      restaurant.categories[i].title === 'Tex-Mex'
    ) {
      restaurant.image = cardImages[32]
      restaurant.matchImage = matchImages[32]
      restaurant.topImage = foodImages[32]
      return restaurant
    } else if (restaurant.categories[i].title == 'Mongolian') {
      restaurant.image = cardImages[33]
      restaurant.matchImage = matchImages[33]
      restaurant.topImage = foodImages[33]
      return restaurant
    } else if (restaurant.categories[i].title === 'Moroccan') {
      restaurant.image = cardImages[34]
      restaurant.matchImage = matchImages[34]
      restaurant.topImage = foodImages[34]
      return restaurant
    } else if (restaurant.categories[i].title === 'Peruvian') {
      restaurant.image = cardImages[35]
      restaurant.matchImage = matchImages[35]
      restaurant.topImage = foodImages[35]
      return restaurant
    } else if (restaurant.categories[i].title === 'Pizza') {
      restaurant.image = cardImages[36]
      restaurant.matchImage = matchImages[36]
      restaurant.topImage = foodImages[36]
      return restaurant
    } else if (restaurant.categories[i].title === 'Polish') {
      restaurant.image = cardImages[37]
      restaurant.matchImage = matchImages[37]
      restaurant.topImage = foodImages[37]
      return restaurant
    } else if (
      restaurant.categories[i].title === 'Eastern European' ||
      restaurant.categories[i].title === 'Russian' ||
      restaurant.categories[i].title === 'Soup' ||
      restaurant.categories[i].title === 'Ukrainian'
    ) {
      restaurant.image = cardImages[38]
      restaurant.matchImage = matchImages[38]
      restaurant.topImage = foodImages[38]
      return restaurant
    } else if (
      restaurant.categories[i].title === 'Salad' ||
      restaurant.categories[i].title === 'Vegetarian' ||
      restaurant.categories[i].title === 'Vegan'
    ) {
      restaurant.image = cardImages[39]
      restaurant.matchImage = matchImages[39]
      restaurant.topImage = foodImages[39]
      return restaurant
    } else if (
      restaurant.categories[i].title === 'Delis' ||
      restaurant.categories[i].title === 'Open Sandwiches' ||
      restaurant.categories[i].title === 'Sandwiches'
    ) {
      restaurant.image = cardImages[40]
      restaurant.matchImage = matchImages[40]
      restaurant.topImage = foodImages[40]
      return restaurant
    } else if (
      restaurant.categories[i].title === 'Live/Raw Food' ||
      restaurant.categories[i].title === 'Seafood'
    ) {
      restaurant.image = cardImages[41]
      restaurant.matchImage = matchImages[41]
      restaurant.topImage = foodImages[41]
      return restaurant
    } else if (
      restaurant.categories[i].title === 'Comfort Food' ||
      restaurant.categories[i].title === 'Soul Food' ||
      restaurant.categories[i].title === 'Southern'
    ) {
      restaurant.image = cardImages[42]
      restaurant.matchImage = matchImages[42]
      restaurant.topImage = foodImages[42]
      return restaurant
    } else if (
      restaurant.categories[i].title === 'Spanish' ||
      restaurant.categories[i].title === 'Tapas Bars' ||
      restaurant.categories[i].title === 'Tapas/Small Plates'
    ) {
      restaurant.image = cardImages[43]
      restaurant.matchImage = matchImages[43]
      restaurant.topImage = foodImages[43]
      return restaurant
    } else if (restaurant.categories[i].title === 'Sri Lankan') {
      restaurant.image = cardImages[44]
      restaurant.matchImage = matchImages[44]
      restaurant.topImage = foodImages[44]
      return restaurant
    } else if (
      restaurant.categories[i].title === 'Barbeque' ||
      restaurant.categories[i].title === 'Steakhouses'
    ) {
      restaurant.image = cardImages[45]
      restaurant.matchImage = matchImages[45]
      restaurant.topImage = foodImages[45]
      return restaurant
    } else if (restaurant.categories[i].title === 'Sushi Bars') {
      restaurant.image = cardImages[46]
      restaurant.matchImage = matchImages[46]
      restaurant.topImage = foodImages[46]
      return restaurant
    } else if (
      restaurant.categories[i].title === 'Meatballs' ||
      restaurant.categories[i].title === 'Scandinavian' ||
      restaurant.categories[i].title === 'Swedish' ||
      restaurant.categories[i].title === 'Traditional Norwegian' ||
      restaurant.categories[i].title === 'Traditional Swedish'
    ) {
      restaurant.image = cardImages[47]
      restaurant.matchImage = matchImages[47]
      restaurant.topImage = foodImages[47]
      return restaurant
    } else if (
      restaurant.categories[i].title === 'Asian Fusion' ||
      restaurant.categories[i].title === 'Taiwanese'
    ) {
      restaurant.image = cardImages[48]
      restaurant.matchImage = matchImages[48]
      restaurant.topImage = foodImages[48]
      return restaurant
    } else if (restaurant.categories[i].title === 'Thai') {
      restaurant.image = cardImages[49]
      restaurant.matchImage = matchImages[49]
      restaurant.topImage = foodImages[49]
      return restaurant
    } else if (restaurant.categories[i].title === 'Vietnamese') {
      restaurant.image = cardImages[50]
      restaurant.matchImage = matchImages[50]
      restaurant.topImage = foodImages[50]
      return restaurant
    }
  }
  var index = Math.floor(Math.random() * 3)
  restaurant.image = generalCardImages[index]
  restaurant.matchImage = generalMatchImages[index]
  restaurant.topImage = generalFoodImages[index]
  return restaurant
}
