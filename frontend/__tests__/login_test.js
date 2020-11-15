<<<<<<< HEAD
import 'react-native';
import React from 'react';
import Login from '../screens/login';
import renderer from 'react-test-renderer';
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
import 'react-native'
import React from 'react'
import { render, fireEvent, cleanup } from '@testing-library/react-native'
import Renderer from 'react-test-renderer'
import Login from '../screens/login'
>>>>>>> 21f90f553fa612fb7a9c51b9d4996e263351a25a

afterEach(cleanup)

jest.mock('../apis/facebookService.js')

test('renders login page correctly', () => {
  const tree = render(<Login />)
  expect(tree.toJSON()).toMatchSnapshot()
})

test('renders login with Facebook alert', async () => {
  const create = Renderer.create(<Login />).getInstance()
  const { getByText, toJSON } = render(<Login />)
  // Test Facebook Login button opens alert
  fireEvent.press(getByText('Log in with Facebook'))
  expect(getByText('Open "Facebook?"'))
  // Test cancel button closes alert
  fireEvent.press(getByText(''))
  expect(toJSON()).toMatchSnapshot()
  // Test error alert renders and closes
  return create.handleClick().then(() => {
    expect(create.state.errorAlert).toBe(false)
    return create.handleClick().then(() => {
      expect(create.state.errorAlert).toBe(true)
    })
  })
})
