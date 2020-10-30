// const loginWithFacebook =  () => {
//     return Promise.resolve('Username')
// }

// exports.loginWithFacebook = loginWithFacebook;

export default {
    loginWithFacebook: jest
    .fn(() => Promise.resolve('Home'))
    .mockRejectedValueOnce(new Error(404))
    .mockResolvedValueOnce('Username')
    
   
    
}