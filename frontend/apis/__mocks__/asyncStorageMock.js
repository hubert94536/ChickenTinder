// mock functions for asyncStroage

const getItem = (text) => {
  return Promise.resolve(text)
}
const setItem = (text) => {
  return Promise.resolve(text)
}

export default { getItem, setItem }
