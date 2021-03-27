import foodImages from './defImages.js'

const generalFoodImages = [
  require('./General1.svg'),
  require('./General2.svg'),
  require('./General3.svg'),
]

export default function getCuisine(categories) {
  var max = 0
  var image = null
  for (var i = 0; i < categories.length; i++) {
    if (categories[i].title) {
      const temp = foodImages[categories[i].title]
      if (temp && temp.priority >= max){
        if (typeof temp.img === "string") {
          if(foodImages[temp.img].val > 1){
            var index = Math.random() * (foodImages[temp.img].val - 1)
            image = foodImages[temp.img].choices[index];
          }
          else image = foodImages[temp.img].img
        }
        else image = temp.img;
        if(temp.val > 2){
          var index = Math.random() * (temp.val - 1)
          image = temp.choices[index];
        }
        max = temp.priority;
      }
    }
  }
  if (image) return image
  if (categories[i] !== undefined && categories[i].title[0].toUpperCase() < 'I')
    return generalFoodImages[0]
  else if (categories[i] !== undefined && categories[i].title[0].toUpperCase() < 'Q')
    return generalFoodImages[1]
  else return generalFoodImages[2]
}
