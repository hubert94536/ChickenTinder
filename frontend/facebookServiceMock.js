// facebookService.js mock functions

// returns 'Username' by default and 'Home' if the first argument is "1"
const loginWithFacebook = (home) => {
  if (home == 1) {
    return Promise.resolve('Home')
  }
  return Promise.resolve('Username')
}

export default {
    loginWithFacebook
}