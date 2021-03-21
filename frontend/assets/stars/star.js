export default function getStarPath(rating) {
  switch (rating) {
    case 0:
      return require('./0.png')
    case 1:
      return require('./1.png')
    case 1.5:
      return require('./1.5.png')
    case 2:
      return require('./2.png')
    case 2.5:
      return require('./2.5.png')
    case 3:
      return require('./3.png')
    case 3.5:
      return require('./3.5.png')
    case 4:
      return require('./4.png')
    case 4.5:
      return require('./4.5.png')
    case 5:
      return require('./5.png')
  }
}
