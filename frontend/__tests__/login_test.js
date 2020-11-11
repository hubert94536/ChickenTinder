import 'react-native'
import React from 'react'
<<<<<<< HEAD
import Login from '../screens/login'
import renderer from 'react-test-renderer'

const facebookService = require('../apis/facebookService.js')
jest.mock('../apis/facebookService.js')

test('renders correctly', () => {
  const tree = renderer.create(<Login />).toJSON()
  expect(tree).toMatchSnapshot()
=======
import { render, fireEvent, cleanup } from '@testing-library/react-native'
import Renderer from 'react-test-renderer'
import Login from '../screens/login'

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
>>>>>>> 8522c47d83d5811d63c3936d16b94aec8a8de1d6
})
