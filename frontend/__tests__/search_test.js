import 'react-native'
import { render, fireEvent, cleanup } from '@testing-library/react-native'
import Renderer from 'react-test-renderer'
import Search from '../screens/search'
import MockAsyncStorage from 'mock-async-storage'
import React from 'react'

const mock = () => {
  const mockImpl = new MockAsyncStorage()
  jest.mock('AsyncStorage', () => mockImpl)
}

mock()

jest.mock('../apis/friendsApi')
jest.mock('../apis/accountsApi.js')

afterEach(cleanup)

test('renders search for nothing correctly', () => {
  const tree = render(<Search />)
  expect(tree.toJSON()).toMatchSnapshot()
})

test('snapshot for search', () => {
  Renderer.create(<Search />).getInstance()
  const { getByText, getByPlaceholderText } = render(<Search />)
  // Test typing generates cards
  fireEvent.changeText(getByPlaceholderText('Search for friends'), 'John')
  expect(getByText('j0hn'))
  // Test cards remain after deleting
  fireEvent.changeText(getByPlaceholderText('Search for friends'), '')
  expect(getByText('@j0hn'))
})
