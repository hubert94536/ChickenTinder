import React, { Component } from 'react'
import {
  Dimensions,
  FlatList,
  StyleSheet,
  Text,
  View
} from 'react-native'
import { SearchBar } from 'react-native-elements'
import api from './api.js'
import Card from './searchCard.js'

const hex = '#F25763'
const font = 'CircularStd-Medium'

export default class Search extends Component {
  constructor (props) {
    super(props)

    this.state = {
      data: []
    }
    api.createFBUser('boo', 1, 'booo', 'boo@gmail.com', 'pic')
  }

  // for rendering a separator b/w cards
  renderSeparator () {
    return (
      <View
        style={{
          height: 1,
          width: '86%',
          backgroundColor: '#CED0CE',
          marginLeft: '14%'
        }}
      />
    )
  };

  // searches and modifies the display
  searchFilterFunction (text) {
    this.setState({ value: text })

    clearTimeout(this.timeout) // clears the old timer
    this.timeout = setTimeout(
      () =>
        api
          .searchUsers(text)
          .then(res => {
            this.setState({ data: res.userList })
          })
          .catch(err => console.log(err)),
      100
    )
  };

  // for displaying the header
  renderHeader () {
    return (
      <SearchBar
        containerStyle={styles.container}
        inputContainerStyle={styles.inputContainer}
        inputStyle={styles.input}
        placeholder='Seach by username'
        lightTheme
        round
        onChangeText={text => this.searchFilterFunction(text)}
        autoCorrect={false}
        value={this.state.value}
      />
    )
  };

  render () {
    return (
      <View style={{ flex: 1, backgroundColor: 'white' }}>
        <Text style={styles.title}>Find New Friends!</Text>
        <FlatList
          data={this.state.data}
          renderItem={({ item }) => (
            <Card
              name={item.name}
              username={'@' + item.username}
              image={item.photo}
              requested
            />
          )}
          keyExtractor={item => item.username}
          ItemSeparatorComponent={this.renderSeparator}
          ListHeaderComponent={this.renderHeader}
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  title: {
    fontFamily: font,
    fontSize: 40,
    color: hex,
    textAlign: 'center',
    margin: '4%'
  },
  container: {
    backgroundColor: 'white',
    borderBottomColor: 'transparent',
    borderTopColor: 'transparent',
    width: '100%',
    height: Dimensions.get('window').height * 0.08,
    alignSelf: 'center'
  },
  inputContainer: {
    height: Dimensions.get('window').height * 0.05,
    width: '90%',
    alignSelf: 'center',
    backgroundColor: '#ebecf0'
  },
  input: {
    textAlignVertical: 'center',
    fontFamily: font,
    fontSize: 18
  }
})
