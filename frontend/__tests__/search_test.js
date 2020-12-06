import 'react-native'
import { render, fireEvent, cleanup } from '@testing-library/react-native'
import Renderer from 'react-test-renderer'
import Search from '../screens/search'
import MockAsyncStorage from 'mock-async-storage'
import React from 'react'

//import { AsyncStorage } from 'react-native'

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
  const { getByText, getByPlaceholderText } = render(<Search />)
  // Test typing generates cards
  fireEvent.changeText(getByPlaceholderText('Search for friends'), 'John')
  expect(getByText('j0hn'))
  // Test cards remain after deleting
  fireEvent.changeText(getByPlaceholderText('Search for friends'), '')
  expect(getByText('@j0hn'))
})

test('snapshot for search, no results', () => {
  const tree = render(<Search />)
  const { getByPlaceholderText } = render(<Search />)
  // Test for search that generates nothing
  fireEvent.changeText(getByPlaceholderText('Search for friends'), 'Harbinger')
  expect(tree.toJSON()).toMatchSnapshot()
})

// fail first, accept later

// test('accept friend request calls API + changes button, failing case', () => {

// })

// test('accept friend request calls API + changes button', () => {

// })

// test('delete friend request calls API + removes from view, failing case', () => {

// })

// test('delete friend request calls API + removes from view', () => {

// })

// test('status click if friends, failing case', () => {
//   // test if error alert renders

//   // clicking on cancel closes pop up
// })

// test('status click if friends', () => {
//   // clicking on friend's status creates alert to confirm

//   // clicking on confirm calls Api function + closes pop up
// })
