import React from 'react';
import {
  Button,
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableHighlight,
  Image,
  Alert,
} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/FontAwesome';

const hex = '#F25763';
const font = 'CircularStd-Medium';

var participants = [
  {
    name: 'Hanna',
    username: '@hannaco',
    image:
      'https://d1kdq4z3qhht46.cloudfront.net/uploads/2019/08/Adventures_from_Moominvalley_1990_Moomintroll_TV.jpg',
  },
  {
    name: 'Isha',
    username: '@ishagonu',
    image:
      'https://www.abramsandchronicle.co.uk/wp-content/uploads/books/9781452182674.jpg',
  },
  {
    name: 'Hubert',
    username: '@hubesc',
    image: 'https://media0.giphy.com/media/ayMW3eqvuP00o/giphy_s.gif',
  },
  {
    name: 'Ruth',
    username: '@ruthlee',
    image:
      'https://wi-images.condecdn.net/image/baeWXm8eqMl/crop/405/f/ponyo.jpg',
  },
];

export default class Group extends React.Component {
  state = {
    members: [],
  };

  componentDidMount() {
    var temp = [];
    var temp2 = [];
    for (var i = 0; i < participants.length; i++) {
      temp.push(
        <Card
          key={i}
          id={i}
          name={participants[i].name}
          username={participants[i].username}
          image={participants[i].image}
          removeItem={this.removeItem}
        />,
      );
    }
    this.setState({members: temp});
  }

  removeItem = num => {
    console.log('remove ' + num);
  };

  leaveGroup() {
    Alert.alert(
      //title
      'Are you sure you want to leave?',
      //body
      'You will will not be able to return without invitation',
      [
        {
          text: 'Yes',
          onPress: () => this.props.navigation.navigate('Home'),
        },
        {
          text: 'Cancel',
          style: 'cancel',
        },
      ],
    );
  }

  render() {
    return (
      <View style={styles.main}>
        <View style={styles.top}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Text style={styles.groupTitle}>
              {participants[0].name}'s Group
            </Text>
            <TouchableOpacity
              style={styles.leave}
              onPress={() => this.leaveGroup()}>
              <Text style={styles.leaveText}>Leave</Text>
            </TouchableOpacity>
          </View>
          <View style={{flexDirection: 'row'}}>
            <Icon name="user" style={styles.icon} />
            <Text
              style={{
                color: '#fff',
                fontWeight: 'bold',
                fontFamily: font,
              }}>
              {this.state.members.length}
            </Text>
            <Text style={styles.divider}>|</Text>
            <Text style={styles.waiting}>waiting for 1 member's filters</Text>
          </View>
          <View style={{flexDirection: 'row', margin: '4%'}}>
            <Icon
              name="chevron-left"
              style={{color: 'white', fontFamily: font, fontSize: 16}}
            />
            <Text style={{color: 'white', fontFamily: font, marginLeft: '3%'}}>
              Swipe for filters
            </Text>
          </View>
        </View>
        <ScrollView style={styles.center}>{this.state.members}</ScrollView>
        <View style={styles.bottom}>
          <Text style={styles.bottomText}>
            When everyone has submitted filters, the round will begin!
          </Text>
          <TouchableHighlight style={styles.bottomButton}>
            <Text style={styles.buttonText}>Waiting...</Text>
          </TouchableHighlight>
        </View>
      </View>
    );
  }
}

class Card extends React.Component {
  constructor(props) {
    super(props);
  }

  removeItem = num => {
    this.props.removeItem(num);
  };

  render() {
    return (
      <View>
        <View style={styles.card}>
          <Image source={{uri: this.props.image}} style={styles.image} />
          <Icon
            name="check-circle"
            style={{
              color: hex,
              fontSize: 20,
              position: 'absolute',
              marginLeft: '14%',
              marginTop: '1%',
            }}
          />
          <View
            style={{
              alignSelf: 'center',
              marginLeft: '3%',
              flex: 1,
            }}>
            <Text
              style={{
                color: hex,
                fontWeight: 'bold',
                fontFamily: font,
              }}>
              {this.props.name}
            </Text>
            <Text
              style={{
                color: hex,
                fontFamily: font,
              }}>
              {this.props.username}
            </Text>
          </View>
          <View style={{flex: 1, flexDirection: 'row'}}>
            <Text
              style={{
                color: hex,
                alignSelf: 'center',
                fontFamily: font,
                marginLeft: '30%',
              }}>
              Remove
            </Text>
            <Icon
              name="times-circle"
              style={{
                color: hex,
                fontSize: 35,
                alignSelf: 'center',
                marginLeft: '5%',
              }}
              onPress={() => this.removeItem(this.props.id)}
            />
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  main: {
    flexDirection: 'column',
    flex: 1,
    backgroundColor: hex,
    color: '#fff',
  },
  groupTitle: {
    color: '#fff',
    fontSize: 25,
    marginLeft: '5%',
    marginTop: '5%',
    fontWeight: 'bold',
    fontFamily: font,
  },
  leave: {
    marginLeft: '45%',
    marginTop: '11%',
    borderRadius: 25,
    borderWidth: 2.5,
    borderColor: '#fff',
    width: '40%',
  },
  leaveText: {
    fontFamily: font,
    color: 'white',
    textAlign: 'center',
    fontSize: 20,
    paddingTop: '2%',
    paddingBottom: '2%',
  },
  icon: {
    color: '#fff',
    marginLeft: '5%',
    marginTop: '2%',
    fontSize: 30,
  },
  divider: {
    color: '#fff',
    alignSelf: 'center',
    marginLeft: '3%',
    fontSize: 25,
    fontFamily: font,
  },
  waiting: {
    color: '#fff',
    marginLeft: '3%',
    alignSelf: 'center',
    fontFamily: font,
  },
  button: {
    borderRadius: 25,
    borderWidth: 2.5,
    borderColor: '#fff',
    paddingVertical: 7,
    paddingHorizontal: 12,
    width: '50%',
    alignSelf: 'center',
    marginTop: '3%',
  },
  buttonText: {
    color: '#fff',
    alignSelf: 'center',
    fontSize: 30,
    fontWeight: 'bold',
    fontFamily: font,
  },
  bottomText: {
    color: '#fff',
    width: '50%',
    alignSelf: 'center',
    fontWeight: 'bold',
    marginTop: '3%',
    textAlign: 'center',
    fontFamily: font,
  },
  bottomButton: {
    borderRadius: 40,
    borderWidth: 2.5,
    opacity: 0.5,
    borderColor: '#fff',
    paddingVertical: 13,
    paddingHorizontal: 12,
    width: '60%',
    alignSelf: 'center',
    marginTop: '3%',
  },
  image: {
    borderRadius: 63,
    height: 60,
    width: 60,
    borderWidth: 3,
    borderColor: hex,
    alignSelf: 'flex-start',
    marginTop: '2.5%',
    marginLeft: '2.5%',
  },
  top: {
    flex: 0.38,
  },
  center: {
    flex: 0.6,
    color: '#fff',
    // backgroundColor: '#add8e6',
  },
  bottom: {
    flex: 0.45,
    color: '#fff',
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
    flexDirection: 'row',
  },
  join: {
    marginTop: 0,
    marginLeft: '3%',
    color: '#fff',
    fontFamily: font,
  },
});
