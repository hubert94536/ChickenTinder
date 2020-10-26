import 'react-native';
import React from 'react';
import Login from '../screens/login';
import renderer from 'react-test-renderer';
// import accountsApi from '../apis/accountsApi.js'
// import MockAsyncStorage from 'mock-async-storage';
import { Item } from 'react-native-paper/lib/typescript/src/components/List/List';
// import facebookService from '../apis/facebookService.js'
 


const facebookService = require('../apis/facebookService.js')
jest.mock('../apis/facebookService.js')

test('should return username', () => {
  
  facebookService.loginWithFacebook().then(retVal => {
    expect(retVal).toEqual('Username');
  });

  // const retVal = await facebookService.loginWithFacebook();
  
});

// test('renders correctly', () => {
//     // facebookService.loginWithFacebook.mockResolvedValue('Username')
//     const tree = renderer.create(<Login />).toJSON();
//     expect(tree).toMatchSnapshot();
//   });

// import 'react-native';
// import MockAsyncStorage from 'mock-async-storage'
// import React from 'react';
// import Login from '../screens/login'
 
// // Note: test renderer must be required after react-native.
// import renderer from 'react-test-renderer';
 
// const mock = () => {
//   const mockImpl = new MockAsyncStorage()
//   jest.mock('AsyncStorage', () => mockImpl)
// }
 
// mock();
 
// import { AsyncStorage as storage } from 'react-native'
 
// it('renders correctly', () => {
//   const tree = renderer.create(
//     <Index />
//   );
// });
 
// it('Mock Async Storage working', async () => {
//   await storage.setItem('myKey', 'myValue')
//   const value = await storage.getItem('myKey')
//   expect(value).toBe('myValue')
// })