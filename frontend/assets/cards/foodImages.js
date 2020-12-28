const foodImages = [
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

const generalFoodImages = [
  require('./General1.png'),
  require('./General2.png'),
  require('./General3.png'),
]

const letters1 = ['a', 'A', 'b', 'B', 'c', 'C', 'd', 'D', 'e', 'E', 'f', 'F', 'g', 'G', 'H', 'h']
const letters2 = ['i', 'I', 'j', 'J', 'k', 'K', 'l', 'L', 'm', 'M', 'n', 'N', 'o', 'O', 'p', 'P']

export default function getCusine(categories) {
  for (var i = 0; i < categories.length; i++) {
    if (categories[i].title === 'African') {
      return foodImages[0]
    } else if (
      categories[i].title === 'Australian' ||
      categories[i].title === 'Modern Australian' ||
      categories[i].title === 'New Zealand'
    ) {
      return foodImages[1]
    } else if (categories[i].title === 'Creperies') {
      return foodImages[2]
    } else if (categories[i].title === 'Baguettes') {
      return foodImages[3]
    } else if (
      categories[i].title === 'Breakfast & Brunch' ||
      categories[i].title === 'Diners' ||
      categories[i].title === 'Waffles'
    ) {
      return foodImages[4]
    } else if (categories[i].title === 'British' || categories[i].title === 'Fish & Chips') {
      return foodImages[5]
    } else if (categories[i].title === 'Burmese') {
      return foodImages[6]
    } else if (
      categories[i].title === 'Cafes' ||
      categories[i].title === 'Hong Kong Style Cafe' ||
      categories[i].title === 'Coffeeshops'
    ) {
      return foodImages[7]
    } else if (categories[i].title === 'Cambodian') {
      return foodImages[8]
    } else if (categories[i].title === 'Canadian') {
      return foodImages[9]
    } else if (categories[i].title === 'Cajun/Creole' || categories[i].title === 'Caribbean') {
      return foodImages[10]
    } else if (
      categories[i].title === 'Chicken Shop' ||
      categories[i].title === 'Chicken Wings' ||
      categories[i].title === 'Rotisserie Chicken'
    ) {
      return foodImages[11]
    } else if (
      categories[i].title === 'Chinese' ||
      categories[i].title === 'Dim Sum' ||
      categories[i].title === 'Dumplings' ||
      categories[i].title === 'Hot Pot' ||
      categories[i].title === 'Wok'
    ) {
      return foodImages[12]
    } else if (categories[i].title === 'Cuban') {
      return foodImages[13]
    } else if (categories[i].title === 'Ethiopian') {
      return foodImages[14]
    } else if (categories[i].title === 'Filipino') {
      return foodImages[15]
    } else if (
      categories[i].title === 'Bistro' ||
      categories[i].title === 'French' ||
      categories[i].title === 'French Southwest'
    ) {
      return foodImages[16]
    } else if (
      categories[i].title === 'Bavarian' ||
      categories[i].title === 'Fischbroetchen' ||
      categories[i].title === 'German' ||
      categories[i].title === 'Schnitzel'
    ) {
      return foodImages[17]
    } else if (categories[i].title === 'Greek' || categories[i].title === 'Wraps') {
      return foodImages[18]
    } else if (categories[i].title === 'Halal' || categories[i].title === 'Middle Eastern') {
      return foodImages[19]
    } else if (categories[i].title === 'Burgers' || categories[i].title === 'Fast Food') {
      return foodImages[20]
    } else if (categories[i].title === 'Hawaiian') {
      return foodImages[21]
    } else if (categories[i].title === 'Polynesian') {
      return foodImages[22]
    } else if (
      categories[i].title === 'American (New)' ||
      categories[i].title === 'American (Traditional)' ||
      categories[i].title === 'Hot Dogs'
    ) {
      return foodImages[23]
    } else if (categories[i].title === 'Indian' || categories[i].title === 'Pakistani') {
      return foodImages[24]
    } else if (categories[i].title === 'Indonesian') {
      return foodImages[25]
    } else if (
      categories[i].title === 'Beer Garden' ||
      categories[i].title === 'Beer Hall' ||
      categories[i].title === 'Gastropubs' ||
      categories[i].title === 'Irish' ||
      categories[i] === 'Island Pub'
    ) {
      return foodImages[26]
    } else if (categories[i].title === 'Italian') {
      return foodImages[27]
    } else if (
      categories[i].title === 'Japanese' ||
      categories[i].title === 'Ramen' ||
      categories[i].title === 'Nikkei' ||
      categories[i].title === 'Noodles'
    ) {
      return foodImages[28]
    } else if (categories[i].title === 'Kebab') {
      return foodImages[29]
    } else if (categories[i].title === 'Korean') {
      return foodImages[30]
    } else if (categories[i].title === 'Mediterranean' || categories[i].title === 'Pita') {
      return foodImages[31]
    } else if (categories[i].title === 'Mexican' || categories[i].title === 'Tex-Mex') {
      return foodImages[32]
    } else if (categories[i].title == 'Mongolian') {
      return foodImages[33]
    } else if (categories[i].title === 'Moroccan') {
      return foodImages[34]
    } else if (categories[i].title === 'Peruvian') {
      return foodImages[35]
    } else if (categories[i].title === 'Pizza') {
      return foodImages[36]
    } else if (categories[i].title === 'Polish') {
      return foodImages[37]
    } else if (
      categories[i].title === 'Eastern European' ||
      categories[i].title === 'Russian' ||
      categories[i].title === 'Soup' ||
      categories[i].title === 'Ukrainian'
    ) {
      return foodImages[38]
    } else if (
      categories[i].title === 'Salad' ||
      categories[i].title === 'Vegetarian' ||
      categories[i].title === 'Vegan'
    ) {
      return foodImages[39]
    } else if (
      categories[i].title === 'Delis' ||
      categories[i].title === 'Open Sandwiches' ||
      categories[i].title === 'Sandwiches'
    ) {
      return foodImages[40]
    } else if (categories[i].title === 'Live/Raw Food' || categories[i].title === 'Seafood') {
      return foodImages[41]
    } else if (
      categories[i].title === 'Comfort Food' ||
      categories[i].title === 'Soul Food' ||
      categories[i].title === 'Southern'
    ) {
      return foodImages[42]
    } else if (
      categories[i].title === 'Spanish' ||
      categories[i].title === 'Tapas Bars' ||
      categories[i].title === 'Tapas/Small Plates'
    ) {
      return foodImages[43]
    } else if (categories[i].title === 'Sri Lankan') {
      return foodImages[44]
    } else if (categories[i].title === 'Barbeque' || categories[i].title === 'Steakhouses') {
      return foodImages[45]
    } else if (categories[i].title === 'Sushi Bars') {
      return foodImages[46]
    } else if (
      categories[i].title === 'Meatballs' ||
      categories[i].title === 'Scandinavian' ||
      categories[i].title === 'Swedish' ||
      categories[i].title === 'Traditional Norwegian' ||
      categories[i].title === 'Traditional Swedish'
    ) {
      return foodImages[47]
    } else if (categories[i].title === 'Asian Fusion' || categories[i].title === 'Taiwanese') {
      return foodImages[48]
    } else if (categories[i].title === 'Thai') {
      return foodImages[49]
    } else if (categories[i].title === 'Vietnamese') {
      return foodImages[50]
    }
  }
  if (categories[i] !== undefined && letters1.includes(categories[i].title.substring(0, 1)))
    return generalFoodImages[0]
  else if (categories[i] !== undefined && letters2.includes(categories[i].title.substring(0, 1)))
    return generalFoodImages[1]
  else return generalFoodImages[2]
}

export { foodImages, getCusine };