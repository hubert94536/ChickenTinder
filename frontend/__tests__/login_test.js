import 'react-native'
import React from 'react'
import { render, fireEvent, cleanup } from '@testing-library/react-native'
import Renderer from 'react-test-renderer'
import Login from '../screens/login'

afterEach(cleanup)

jest.mock('../apis/facebookService.js')

test('renders login page correctly', () => {
  const tree = render(<Login />)
  expect(tree.toJSON()).toMatchSnapshot()
})

test('renders login with Facebook alert', () => {
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
