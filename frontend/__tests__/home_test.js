import 'react-native'
import { render, fireEvent, cleanup } from '@testing-library/react-native'
import Renderer from 'react-test-renderer'
import Search from '../screens/Search'
import React from 'react'
import AsyncStorage from '@react-native-community/async-storage'

test('renders home page correctly', () => {
    const tree = render(<Home />)
    expect(tree.toJSON()).toMatchSnapshot()
  })