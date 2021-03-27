import foodImages from './defImages.js'

const generalFoodImages = [
  require('./General1.png'),
  require('./General2.png'),
  require('./General3.png'),
]

export default function getCuisine(categories) {
  var max = 0;
  var image = null;
  for (var i = 0; i < categories.length; i++) {
    if (categories[i].title) {
      const temp = foodImages[categories[i].title]
      console.log(temp)
      if (temp && temp.val >= max){
        if (typeof temp.img === "string") image = foodImages[temp.img].img
        else image = temp.img;
        max = temp.val;
      }
    }
  }
  if (image) return image;
  if (categories[i] !== undefined && categories[i].title[0].toUpperCase() < 'I')
    return generalFoodImages[0]
  else if (categories[i] !== undefined && categories[i].title[0].toUpperCase() < 'Q')
    return generalFoodImages[1]
  else return generalFoodImages[2]
}