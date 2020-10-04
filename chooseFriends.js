import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
  Modal,
  FlatList,
} from 'react-native';
import {BlurView} from '@react-native-community/blur';
import Icon from 'react-native-vector-icons/FontAwesome';
import Card from './chooseCard.js';

const hex = '#F25763';
const font = 'CircularStd-Bold';
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
  {
    name: 'Tiffany Chao',
    username: '@tiffanychao',
    image:
      'https://i.pinimg.com/236x/ec/d3/8c/ecd38c516c19d5cf6624ce3eeae1c4b2.jpg',
  },
  {
    name: 'Kyle Blake',
    username: '@theekyleblake',
    image:
      'https://i.pinimg.com/236x/ec/d3/8c/ecd38c516c19d5cf6624ce3eeae1c4b2.jpg',
  },
];
export default class ChooseFriends extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: people,
    };
  }
  handlePress() {
    this.props.press();
  }

  render() {
    return (
      <Modal animationType="none" transparent={true}>
        <View style={styles.container}>
          <View style={styles.main}>
            <View style={styles.header}>
              <Text style={styles.headertext}>Friends</Text>
              <Icon
                name="times-circle"
                style={styles.icon}
                onPress={() => this.handlePress()}
              />
            </View>
            <FlatList
              style={{marginLeft: '5%', marginRight: '5%', marginBottom: '10%'}}
              data={this.state.data}
              renderItem={({item}) => (
                <Card
                  name={item.name}
                  username={item.username}
                  image={item.image}
                  added={true}
                />
              )}
              keyExtractor={item => item.username}
            />
          </View>
        </View>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flex: 1,
    alignSelf: 'center',
    width: '90%',
  },
  main: {
    flex: 1,
    height: '90%',
    backgroundColor: 'white',
    alignSelf: 'center',
    borderRadius: 30,
    elevation: 20,
  },
  header: {
    height: '10%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  icon: {
    color: hex,
    fontSize: 25,
    alignSelf: 'center',
    margin: '4%',
  },
  headertext: {
    fontFamily: font,
    color: hex,
    margin: '4%',
    fontSize: 20,
  },
});
