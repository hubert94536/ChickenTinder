import foodImages from './defImages.js'

const generalFoodImages = [
  require('./General1.png'),
  require('./General2.png'),
  require('./General3.png'),
]

const letters1 = ['a', 'A', 'b', 'B', 'c', 'C', 'd', 'D', 'e', 'E', 'f', 'F', 'g', 'G', 'H', 'h']
const letters2 = ['i', 'I', 'j', 'J', 'k', 'K', 'l', 'L', 'm', 'M', 'n', 'N', 'o', 'O', 'p', 'P']

export default function getCuisine(categories, price) {
  for (var i = 0; i < categories.length; i++) {
    if (categories[i] === 'Island Pub') return foodImages['Irish']
    else if (categories[i].title) {
      const temp = foodImages[categories[i].title]
      console.log(typeof temp)
      if (typeof temp === "string") return foodImages[temp];
      else if ('$' in temp) return foodImages[temp[price]];
      else return temp;
    }
  }
  if (categories[i] !== undefined && letters1.includes(categories[i].title.substring(0, 1)))
    return generalFoodImages[0]
  else if (categories[i] !== undefined && letters2.includes(categories[i].title.substring(0, 1)))
    return generalFoodImages[1]
  else return generalFoodImages[2]
}