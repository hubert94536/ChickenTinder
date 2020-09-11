import React from 'react'
import {
  Button,
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableHighlight,
  Image
} from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome'

const hex = '#F25763'
// this.props.navigation.state.params.members[
//   Object.keys(this.props.navigation.state.params.members)[0]].name
export default class Group extends React.Component {
  constructor(props) {
    super(props)
    const members = this.props.navigation.state.params.members
    this.state = {
      members: members,
      host: members[Object.keys(members)[0]].name.split(" ")[0],
      needFilters: Object.keys(members).filter(user=>!user.filters).length
    }
  }
  render() {
    var members = []
    for (var user in this.state.members) {
      members.push(
        <Card
          name={this.state.members[user].name}
          username={'@'+user}
          image={this.state.members[user].pic}
          filters={this.state.members[user].filters}
        />
      )
    }

    return (
      <View style={styles.main}>
        <View style={styles.top}>
          <Text style={styles.groupTitle}>{this.state.host}'s group</Text>
          <View style={{ flexDirection: 'row' }}>
            <Icon name='user' style={styles.icon} />
            <Text
              style={{
                color: '#fff',
                fontWeight: 'bold',
                fontFamily: 'CircularStd-Medium'
              }}
            >
              {members.length}
            </Text>
            <Text style={styles.divider}>|</Text>
            <Text style={styles.waiting}>waiting for {this.state.needFilters} member filters</Text>
          </View>
          <TouchableHighlight style={styles.button}>
            <Text style={styles.buttonText}>Set your filters</Text>
          </TouchableHighlight>
        </View>
        <ScrollView style={styles.center}>{members}</ScrollView>
        <View style={styles.bottom}>
          <Text style={styles.bottomText}>
            When everyone has submitted filters, the round will begin!
          </Text>
          <TouchableHighlight style={styles.bottomButton}>
            <Text style={styles.buttonText}>Waiting...</Text>
          </TouchableHighlight>
        </View>
      </View>
    )
  }
}

class Card extends React.Component {
  render() {
    return (
      <View>
        <View style={styles.card}>
          <Image source={{ uri: this.props.image }} style={this.props.filters ? styles.image : styles.imageFalse} />
          {this.props.filters ? <Icon   
            name='check-circle'
            style={{
              color: hex,
              fontSize: 20,
              position: 'absolute',
              marginLeft: '14%',
              marginTop: '1%'
            }}
          /> : null}
          <View
            style={{
              alignSelf: 'center',
              marginLeft: '3%',
              flex: 1
            }}
          >
            <Text
              style={{
                color: hex,
                fontWeight: 'bold',
                fontFamily: 'CircularStd-Medium'
              }}
            >
              {this.props.name}
            </Text>
            <Text
              style={{
                color: hex,
                fontFamily: 'CircularStd-Medium'
              }}
            >
              {this.props.username}
            </Text>
          </View>
          <View style={{ flex: 1, flexDirection: 'row' }}>
            <Text
              style={{
                color: hex,
                alignSelf: 'center',
                fontFamily: 'CircularStd-Medium',
                marginLeft: '30%'
              }}
            >
              Remove
            </Text>
            <Icon
              name='times-circle'
              style={{
                color: hex,
                fontSize: 35,
                alignSelf: 'center',
                marginLeft: '5%'
              }}
            />
          </View>
        </View>
        <Text style={styles.join}>Joined 3 hours ago</Text>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  main: {
    flexDirection: 'column',
    flex: 1,
    backgroundColor: hex,
    color: '#fff'
  },
  groupTitle: {
    color: '#fff',
    fontSize: 25,
    marginLeft: '5%',
    marginTop: '5%',
    fontWeight: 'bold',
    fontFamily: 'CircularStd-Medium'
  },
  icon: {
    color: '#fff',
    marginLeft: '5%',
    marginTop: '2%',
    fontSize: 30
  },
  divider: {
    color: '#fff',
    alignSelf: 'center',
    marginLeft: '3%',
    fontSize: 25,
    fontFamily: 'CircularStd-Medium'
  },
  waiting: {
    color: '#fff',
    marginLeft: '3%',
    alignSelf: 'center',
    fontFamily: 'CircularStd-Medium'
  },
  button: {
    borderRadius: 25,
    borderWidth: 2.5,
    borderColor: '#fff',
    paddingVertical: 7,
    paddingHorizontal: 12,
    width: '50%',
    alignSelf: 'center',
    marginTop: '3%'
  },
  buttonText: {
    color: '#fff',
    alignSelf: 'center',
    fontSize: 20,
    fontWeight: 'bold',
    fontFamily: 'CircularStd-Medium'
  },
  bottomText: {
    color: '#fff',
    width: '50%',
    alignSelf: 'center',
    fontWeight: 'bold',
    marginTop: '3%',
    textAlign: 'center',
    fontFamily: 'CircularStd-Medium'
  },
  bottomButton: {
    borderRadius: 30,
    borderWidth: 2.5,
    borderColor: '#fff',
    paddingVertical: 13,
    paddingHorizontal: 12,
    width: '50%',
    alignSelf: 'center',
    marginTop: '3%'
  },
  image: {
    borderRadius: 63,
    height: 60,
    width: 60,
    borderWidth: 3,
    borderColor: hex,
    alignSelf: 'flex-start',
    marginTop: '2.5%',
    marginLeft: '2.5%'
  },
  imageFalse: {
    borderRadius: 63,
    height: 60,
    width: 60,
    borderWidth: 3,
    alignSelf: 'flex-start',
    marginTop: '2.5%',
    marginLeft: '2.5%'
  },
  top: {
    flex: 0.5
  },
  center: {
    flex: 0.6,
    color: '#fff'
    // backgroundColor: '#add8e6',
  },
  bottom: {
    flex: 0.45,
    color: '#fff'
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 20,
    borderWidth: 0,
    borderColor: '#000',
    alignSelf: 'center',
    width: '96%',
    height: 80,
    marginTop: '3%',
    flexDirection: 'row'
  },
  join: {
    marginTop: 0,
    marginLeft: '3%',
    color: '#fff',
    fontFamily: 'CircularStd-Medium'
  }
})
