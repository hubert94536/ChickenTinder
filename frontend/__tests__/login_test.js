import 'react-native';
import React from 'react';
import Login from '../screens/login';
import renderer from 'react-test-renderer';
<<<<<<< HEAD
// import facebookService from '../apis/facebookService.js'
import {loginWithFacebook} from '../apis/facebookService.js'

// const facebookService = require('../apis/facebookService.js')
// jest.mock('../apis/facebookService.js')

jest.mock('../apis/facebookService.js', () => ({
  loginWithFacebook: jest.fn()
}));

// test('renders error correctly', () => {
//   const tree = renderer.create(<Login />).toJSON();
//   expect(tree).toMatchSnapshot();
// });

// test('renders username correctly', () => {
//     const tree = renderer.create(<Login />).toJSON();
//     expect(tree).toMatchSnapshot();
//   });

// test('renders home correctly', () => {
//     const tree = renderer.create(<Login />).toJSON();
//     expect(tree).toMatchSnapshot();
//   });

// test('renders error correctly', () => {
//   loginWithFacebook.mockImplementation(() => Promise.resolve(new Error(404)))

//   const tree = renderer.create(<Login />).toJSON();
//   expect(tree).toMatchSnapshot();
// });

// test('renders username correctly', () => {
//   loginWithFacebook.mockImplementation(() => Promise.resolve('Username'))

//   const tree = renderer.create(<Login />).toJSON();
//   expect(tree).toMatchSnapshot();
//   });

// test('renders home correctly', () => {
//   loginWithFacebook.mockImplementation(() => Promise.resolve('Home'))

//   const tree = renderer.create(<Login />).toJSON();
//   expect(tree).toMatchSnapshot();
//   });



    
// test('renders Home', () => {
//   loginWithFacebook.mockImplementation(() => Promise.resolve('Home'))

//   const tree = renderer.create(<Login />).toJSON();
//   expect(tree).toMatchSnapshot();

// })
=======

 


const facebookService = require('../apis/facebookService.js')
jest.mock('../apis/facebookService.js')


test('renders correctly', () => {
    const tree = renderer.create(<Login />).toJSON();
    expect(tree).toMatchSnapshot();
  });
>>>>>>> f0c39505509fa92b6ed0fd7507999106e9c4618e

