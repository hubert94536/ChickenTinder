import React from 'react';
import {View, ScrollView} from 'react-native';
import {SearchBar} from 'react-native-elements';
import Card from './profileCard.js';
import friendsapi from './friendsApi.js';

const hex = '#F25763';
const font = 'CircularStd-Medium';

const people = [
  {
    name: 'Hanna Co',
    username: '@hannaco',
    image:
      'https://i.pinimg.com/236x/ec/d3/8c/ecd38c516c19d5cf6624ce3eeae1c4b2.jpg',
  },
  {
    name: 'Hubert Chen',
    username: '@hubesc',
    image:
      'https://i.pinimg.com/236x/ec/d3/8c/ecd38c516c19d5cf6624ce3eeae1c4b2.jpg',
  },
  {
    name: 'Isha Gonu',
    username: '@ishagonu',
    image:
      'https://i.pinimg.com/236x/ec/d3/8c/ecd38c516c19d5cf6624ce3eeae1c4b2.jpg',
  },
  {
    name: 'Ruth Lee',
    username: '@ruthlee',
    image:
      'https://i.pinimg.com/236x/ec/d3/8c/ecd38c516c19d5cf6624ce3eeae1c4b2.jpg',
  },
  {
    name: 'Hanna Co',
    username: '@hannaco',
    image:
      'https://i.pinimg.com/236x/ec/d3/8c/ecd38c516c19d5cf6624ce3eeae1c4b2.jpg',
  },
  {
    name: 'Michelle Chan',
    username: '@mishigan',
    image:
      'https://i.pinimg.com/236x/ec/d3/8c/ecd38c516c19d5cf6624ce3eeae1c4b2.jpg',
  },
  {
    name: 'Janice Tsai',
    username: '@jopanice',
    image:
      'https://i.pinimg.com/236x/ec/d3/8c/ecd38c516c19d5cf6624ce3eeae1c4b2.jpg',
  },
];

export default class Friends extends React.Component {

  constructor (props) {
    super(props)
    this.state = {
      search: '',
      friends: [],
    }

    // var result = []


    friendsapi
    .getFriends()
    .then(res => {


      console.log(res.friendList)

      var i = 0;
      var accepted = [];
  
      for(i = 0; i < res.friendList.length; i++)
      {
        if (res.friendList[i].status == "Accepted")
        {
          accepted.push(res.friendList[i])
        }
  
      }
  
      this.setState({friends: res.friendList.map(function (friends) {
        return {
          id: friends.id,
          name: friends.name,
          photo: friends.photo,
          username: friends.username,
          status: friends.status
        }
      })})
    })
    .catch(err => console.log(err))

    // console.log("Result")
    // console.log( result)
  }


  updateSearch = search => {
    this.setState({search});
  };

  render() {
    const search = this.state.search;

    

    
    // for (var i = 0; i < people.length; i++) {
    //   friends.push(
    //     <Card
    //       key={i}
    //       name={people[i].name}
    //       username={people[i].username}
    //       image={people[i].image}
    //       friends={true}
    //     />,
    //   );
    // }
    return (
      <View>
        <View>
          <SearchBar
            containerStyle={{
              backgroundColor: 'white',
              borderBottomColor: 'transparent',
              borderTopColor: 'transparent',
              width: '100%',
              height: 45,
              alignSelf: 'center',
            }}
            inputContainerStyle={{
              height: 7,
              width: '90%',
              alignSelf: 'center',
              backgroundColor: '#ebecf0',
            }}
            inputStyle={{
              fontFamily: font,
              fontSize: 15,
            }}
            placeholder="Search by username"
            onChangeText={this.updateSearch}
            value={search}
            lightTheme={true}
            round={true}
          />
        </View>
        <ScrollView style={{flexDirection: 'column'}}>{this.state.friends}</ScrollView>
      </View>
    );
  }
}
