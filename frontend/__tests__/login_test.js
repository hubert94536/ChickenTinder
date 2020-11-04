import 'react-native'
import React from 'react'
import Login from '../screens/login'
import renderer from 'react-test-renderer'

const facebookService = require('../apis/facebookService.js')
jest.mock('../apis/facebookService.js')

test('renders correctly', () => {
  const tree = renderer.create(<Login />).toJSON()
  expect(tree).toMatchSnapshot()
})
