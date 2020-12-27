import 'react-native'
import { render, fireEvent, cleanup } from '@testing-library/react-native'
import Renderer from 'react-test-renderer'
import Search from '../screens/search'
import React from 'react'
import AsyncStorage from '@react-native-community/async-storage'

jest.mock('../apis/friendsApi')
jest.mock('../apis/accountsApi.js')

it('Mock Async Storage working', async () => {
  await AsyncStorage.setItem('myKey', 'myValue')
  const value = await AsyncStorage.getItem('myKey')
  expect(value).toBe('myValue')
})

test('renders search for nothing correctly', () => {
  const tree = render(<Search />)
  expect(tree.toJSON()).toMatchSnapshot()
})

test('snapshot for search', () => {
  const create = Renderer.create(<Search />).getInstance()
  const { getByText, getByPlaceholderText, toJSON } = render(<Search />)
  // Test typing generates cards
  fireEvent.changeText(getByPlaceholderText('Search for friends'), 'John')
  expect(toJSON()).toMatchSnapshot()
  expect(getByText('John'))
  
  // Test cards remain after deleting
  fireEvent.changeText(getByPlaceholderText('Search for friends'), '')
  expect(getByText('@j0hn'))
})

test('snapshot for search, no results', () => {
  const tree = render(<Search />)
  const { getByPlaceholderText, toJson } = render(<Search />)
  // Test for search that generates nothing
  fireEvent.changeText(getByPlaceholderText('Search for friends'), 'Harbinger')
  expect(tree.toJSON()).toMatchSnapshot()
})

// accept first, fail later

// test('accept friend request calls API + changes button, failing case', () => {
//   const tree = render(<Search />)

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
