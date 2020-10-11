import React from 'react'
import {
  StyleSheet,
  Text,
  View,
  Modal,
  FlatList,
  Dimensions
} from 'react-native'
import { SearchBar } from 'react-native-elements'
import Icon from 'react-native-vector-icons/FontAwesome'
import Card from './chooseCard.js'
import friendsApi from './friendsApi.js'

const hex = '#F25763';
const font = 'CircularStd-Bold';
const height = Dimensions.get('window').height;

export default class ChooseFriends extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      data: people,
      friends: people,
      search: ''
    }
    this.getFriends()
  }

  getFriends () {
    // Pushing accepted friends or pending requests into this.state.friends
    friendsApi
      .getFriends()
      .then(res => {
        var pushFriends = [];
        for (var friend in res.friendList) {
          if (res.friendList[friend].status === 'Accepted') {
            pushFriends.push(res.friendList[friend])
          }
        }
        this.setState({ friends: pushFriends, data: pushFriends })
      })
      .catch(err => console.log(err))
  }

  handlePress () {
    this.props.press()
  }

  searchFilterFunction (text) {
    this.setState({ search: text })

    const newData = this.state.data.filter(item => {
      const itemData = `${item.name.toUpperCase()} ${item.username.toUpperCase()}`

      const textData = text.toUpperCase()

      return itemData.indexOf(textData) > -1
    })

    this.setState({ friends: newData })
  }

  render () {
    return (
      <Modal animationType='none' transparent>
        <View style={styles.container}>
          <View style={styles.main}>
            <View style={styles.header}>
              <Text style={styles.headertext}>Friends</Text>
              <Icon
                name='times-circle'
                style={styles.icon}
                onPress={() => this.handlePress()}
              />
            </View>
            <SearchBar
              containerStyle={{
                backgroundColor: 'white',
                borderBottomColor: 'transparent',
                borderTopColor: 'transparent',
                width: '100%',
                height: 45,
                alignSelf: 'center'
              }}
              inputContainerStyle={{
                height: 7,
                width: '90%',
                alignSelf: 'center',
                backgroundColor: '#ebecf0'
              }}
              inputStyle={{
                fontFamily: font,
                fontSize: 15
              }}
              placeholder='Search by username'
              onChangeText={text => this.searchFilterFunction(text)}
              value={this.state.search}
              lightTheme
              round
            />
            <FlatList
              style={{ marginLeft: '5%', marginRight: '5%', marginBottom: '10%' }}
              data={this.state.friends}
              renderItem={({ item }) => (
                <Card
                  name={item.name}
                  username={item.username}
                  image={item.image}
                  added
                />
              )}
              keyExtractor={item => item.username}
            />
          </View>
        </View>
      </Modal>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: height,
    alignSelf: 'center',
    width: '90%'
  },
  main: {
    flex: 1,
    height: height * 0.9,
    backgroundColor: 'white',
    alignSelf: 'center',
    borderRadius: 30,
    elevation: 20
  },
  header: {
    height: '10%',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  icon: {
    color: hex,
    fontSize: 25,
    alignSelf: 'center',
    margin: '4%'
  },
  headertext: {
    fontFamily: font,
    color: hex,
    margin: '4%',
    fontSize: 20
  }
})
