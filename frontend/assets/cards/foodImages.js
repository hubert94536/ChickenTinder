import foodImages from './defImages.js'

const generalFoodImages = [
  require('./General1.png'),
  require('./General2.png'),
  require('./General3.png'),
]

const letters1 = ['a', 'A', 'b', 'B', 'c', 'C', 'd', 'D', 'e', 'E', 'f', 'F', 'g', 'G', 'H', 'h']
const letters2 = ['i', 'I', 'j', 'J', 'k', 'K', 'l', 'L', 'm', 'M', 'n', 'N', 'o', 'O', 'p', 'P']

export default function getCuisine(categories, price) {
  var max = 0;
  var image = null;
  console.log("NEW")
  for (var i = 0; i < categories.length; i++) {
    console.log(categories[i].title)
    if (categories[i] === 'Island Pub') return foodImages['Irish'].img
    if (categories[i].title) {
      const temp = foodImages[categories[i].title]
      // i hate typeof
      if (temp && temp.val > max){
        if (typeof temp.img === "string") image = foodImages[temp.img].img
        else image = temp.img;
        max = temp.val;
      }
      // if (typeof temp === "string") return foodImages[temp];
      // else if (typeof temp === "object" && '$' in temp) return foodImages[temp[price]];
      // else if (typeof temp != "undefined") return temp;
    }
  }
  if (image) return image;
  if (categories[i] !== undefined && letters1.includes(categories[i].title.substring(0, 1)))
    return generalFoodImages[0]
  else if (categories[i] !== undefined && letters2.includes(categories[i].title.substring(0, 1)))
    return generalFoodImages[1]
  else return generalFoodImages[2]
}