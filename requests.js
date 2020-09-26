import React from 'react'
import { View, ScrollView } from 'react-native'
import Card from './profileCard.js'

const hex = '#F25763'
const font = 'CircularStd-Medium'

const people = [
  {
    name: 'Hanna Co',
    username: '@hannaco',
    image:
      'https://i.pinimg.com/236x/ec/d3/8c/ecd38c516c19d5cf6624ce3eeae1c4b2.jpg'
  },
  {
    name: 'Hubert Chen',
    username: '@hubesc',
    image:
      'https://i.pinimg.com/236x/ec/d3/8c/ecd38c516c19d5cf6624ce3eeae1c4b2.jpg'
  },
  {
    name: 'Isha Gonu',
    username: '@ishagonu',
    image:
      'https://i.pinimg.com/236x/ec/d3/8c/ecd38c516c19d5cf6624ce3eeae1c4b2.jpg'
  },
  {
    name: 'Ruth Lee',
    username: '@ruthlee',
    image:
      'https://i.pinimg.com/236x/ec/d3/8c/ecd38c516c19d5cf6624ce3eeae1c4b2.jpg'
  },
  {
    name: 'Hanna Co',
    username: '@hannaco',
    image:
      'https://i.pinimg.com/236x/ec/d3/8c/ecd38c516c19d5cf6624ce3eeae1c4b2.jpg'
  },
  {
    name: 'Michelle Chan',
    username: '@mishigan',
    image:
      'https://i.pinimg.com/236x/ec/d3/8c/ecd38c516c19d5cf6624ce3eeae1c4b2.jpg'
  },
  {
    name: 'Janice Tsai',
    username: '@jopanice',
    image:
      'https://i.pinimg.com/236x/ec/d3/8c/ecd38c516c19d5cf6624ce3eeae1c4b2.jpg'
  }
]

export default class Requests extends React.Component {
  render () {
    var friends = []
    // for (var i = 0; i < people.length; i++) {
    //   friends.push(
    //     <Card
    //       key={i}
    //       name={people[i].name}
    //       username={people[i].username}
    //       image={people[i].image}
    //       friends={false}
    //     />
    //   )
    // }
    return (
      <View>
        <ScrollView style={{ flexDirection: 'column' }}>{friends}</ScrollView>
      </View>
    )
  }
}
