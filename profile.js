import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  TouchableHighlight,
  Modal,
} from 'react-native';
import {SearchBar} from 'react-native-elements';
import {BlurView} from '@react-native-community/blur';
import AsyncStorage from '@react-native-community/async-storage';
import {NAME, USERNAME, PHOTO} from 'react-native-dotenv';
import Icon from 'react-native-vector-icons/FontAwesome';
import Swiper from 'react-native-swiper';

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

class Card extends React.Component {
  state = {
    friends: this.props.friends,
    pressed: false,
  };
  render() {
    return (
      <View style={{flexDirection: 'row', flex: 1}}>
        <Image
          source={{
            uri: this.props.image,
          }}
          style={{borderRadius: 63, height: 60, width: 60, margin: '3%'}}
        />
        <View
          style={{
            alignSelf: 'center',
            marginLeft: '1%',
            flex: 1,
          }}>
          <Text style={{fontFamily: font, fontWeight: 'bold', fontSize: 15}}>
            {this.props.name}
          </Text>
          <Text style={{fontFamily: font}}>{this.props.username}</Text>
        </View>
        {this.state.friends && (
          <View style={{flexDirection: 'row', flex: 1}}>
            <Text
              style={{
                fontFamily: font,
                color: hex,
                fontSize: 15,
                alignSelf: 'center',
                marginLeft: '25%',
              }}>
              Friends
            </Text>
            <Icon
              style={{
                fontFamily: font,
                color: hex,
                fontSize: 35,
                alignSelf: 'center',
                marginLeft: '5%',
              }}
              name="check-circle"
            />
          </View>
        )}
        {!this.state.friends && (
          <View style={{flex: 1, flexDirection: 'row'}}>
            <TouchableHighlight
              underlayColor="black"
              onHideUnderlay={() => this.setState({pressed: false})}
              onShowUnderlay={() => this.setState({pressed: true})}
              onPress={() => this.setState({friends: true})}
              style={{
                borderColor: 'black',
                borderRadius: 30,
                borderWidth: 2,
                height: '30%',
                width: '50%',
                marginLeft: '25%',
                alignSelf: 'center',
              }}>
              <Text
                style={{
                  fontFamily: font,
                  fontSize: 15,
                  textAlign: 'center',
                  color: this.state.pressed ? 'white' : 'black',
                }}>
                Accept
              </Text>
            </TouchableHighlight>
          </View>
        )}
      </View>
    );
  }
}

class Friends extends React.Component {
  state = {
    search: '',
  };

  updateSearch = search => {
    this.setState({search});
  };

  render() {
    const search = this.state.search;
    const friends = [];
    for (var i = 0; i < people.length; i++) {
      friends.push(
        <Card
          key={i}
          name={people[i].name}
          username={people[i].username}
          image={people[i].image}
          friends={true}
        />,
      );
    }
    return (
      <View>
        <View>
          <SearchBar
            containerStyle={{
              backgroundColor: 'white',
              height: 45,
              alignSelf: 'center',
            }}
            inputContainerStyle={{
              height: 7,
              width: '90%',
              alignSelf: 'center',
            }}
            placeholder="Search by username"
            onChangeText={this.updateSearch}
            value={search}
            lightTheme={true}
            round={true}
          />
        </View>
        <ScrollView style={{flexDirection: 'column'}}>{friends}</ScrollView>
      </View>
    );
  }
}

class Requests extends React.Component {
  render() {
    const friends = [];
    for (var i = 0; i < people.length; i++) {
      friends.push(
        <Card
          key={i}
          name={people[i].name}
          username={people[i].username}
          image={people[i].image}
          friends={false}
        />,
      );
    }
    return (
      <View>
        <ScrollView style={{flexDirection: 'column'}}>{friends}</ScrollView>
      </View>
    );
  }
}

export default class UserProfileView extends Component {
  state = {
    name: '',
    username: '',
    photo: '',
    friends: true,
    visible: false,
    changeName: false,
    changeUser: false,
    public: false,
  };

  componentDidMount() {
    AsyncStorage.getItem(NAME).then(res => this.setState({name: res}));
    AsyncStorage.getItem(USERNAME).then(res => this.setState({username: res}));
    AsyncStorage.getItem(PHOTO).then(res => this.setState({photo: res}));
  }

  render() {
    return (
      <View>
        <View>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <Icon
              name="chevron-left"
              style={styles.topIcons}
              onPress={() => this.props.navigation.navigate('Home')}
            />
            <Icon
              name="cog"
              style={styles.topIcons}
              onPress={() => this.setState({visible: true})}
            />
          </View>
          <Text style={styles.myProfile}>My Profile</Text>
          <View style={styles.userInfo}>
            <Image
              source={{
                uri:
                  'https://d1kdq4z3qhht46.cloudfront.net/uploads/2019/08/Adventures_from_Moominvalley_1990_Moomintroll_TV.jpg',
              }}
              style={styles.avatar}
            />
            <View style={{fontFamily: font}}>
              <Text style={{fontSize: 28, fontWeight: 'bold'}}>Hanna Co</Text>
              <Text style={{fontSize: 17}}>@hannaco</Text>
            </View>
          </View>
          <View style={{flexDirection: 'row'}}>
            <TouchableHighlight
              underlayColor="#fff"
              style={this.state.friends ? styles.selected : styles.unselected}>
              <Text
                style={
                  this.state.friends
                    ? styles.selectedText
                    : styles.unselectedText
                }>
                Friends
              </Text>
            </TouchableHighlight>
            <TouchableHighlight
              underlayColor="#fff"
              style={!this.state.friends ? styles.selected : styles.unselected}>
              <Text
                style={
                  !this.state.friends
                    ? styles.selectedText
                    : styles.unselectedText
                }>
                Requests
              </Text>
            </TouchableHighlight>
          </View>
        </View>
        <View style={{height: '100%', marginTop: '5%'}}>
          <Swiper
            loop={false}
            onMomentumScrollEnd={() =>
              this.setState({friends: !this.state.friends})
            }>
            <Friends />
            <Requests />
          </Swiper>
        </View>
        {this.state.visible && (
          <BlurView
            blurType="light"
            blurAmount={20}
            reducedTransparencyFallbackColor="white"
            style={{position: 'absolute', top: 0, bottom: 0, left: 0, right: 0}}
          />
        )}
        {this.state.visible && (
          <Modal
            animationType={'fade'}
            visible={this.state.visible}
            transparent={true}>
            <View style={styles.modal}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  margin: '5%',
                }}>
                <Text
                  style={{
                    fontFamily: font,
                    fontSize: 18,
                    color: hex,
                    alignSelf: 'center',
                  }}>
                  Settings
                </Text>
                <Icon
                  name="times-circle"
                  style={{color: hex, fontFamily: font, fontSize: 30}}
                  onPress={() => this.setState({visible: false})}
                />
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  margin: '5%',
                }}>
                <View>
                  <Text style={{fontFamily: font, fontSize: 18}}>Name:</Text>
                  <Text style={{fontFamily: font, color: hex, fontSize: 20}}>
                    Hubert Chen
                  </Text>
                </View>
                <TouchableHighlight
                  underlayColor={hex}
                  onShowUnderlay={() => this.setState({changeName: true})}
                  onHideUnderlay={() => this.setState({changeName: false})}
                  onPress={() => console.log('change name')}
                  style={styles.changeButtons}>
                  <Text
                    style={
                      this.state.changeName
                        ? styles.changeTextSelected
                        : styles.changeText
                    }>
                    Change
                  </Text>
                </TouchableHighlight>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  margin: '5%',
                }}>
                <View>
                  <Text style={{fontFamily: font, fontSize: 18}}>
                    Username:
                  </Text>
                  <Text style={{fontFamily: font, color: hex, fontSize: 20}}>
                    @hubesc
                  </Text>
                </View>
                <TouchableHighlight
                  style={styles.changeButtons}
                  underlayColor={hex}
                  onShowUnderlay={() => this.setState({changeUser: true})}
                  onHideUnderlay={() => this.setState({changeUser: false})}
                  onPress={() => console.log('change user')}>
                  <Text
                    style={
                      this.state.changeUser
                        ? styles.changeTextSelected
                        : styles.changeText
                    }>
                    Change
                  </Text>
                </TouchableHighlight>
              </View>
              <View
                style={{
                  margin: '5%',
                }}>
                <Text style={{fontFamily: font, fontSize: 18}}>
                  Friends List Display:
                </Text>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                    margin: '5%',
                  }}>
                  <TouchableHighlight
                    underlayColor={hex}
                    onShowUnderlay={() => this.setState({public: true})}
                    style={{
                      alignSelf: 'center',
                      borderWidth: 2,
                      borderColor: hex,
                      borderRadius: 50,
                      width: '35%',
                      marginRight: '5%',
                      backgroundColor: this.state.public ? hex : 'white',
                    }}
                    onPress={() => this.setState({public: true})}>
                    <Text
                      style={
                        this.state.public
                          ? styles.changeTextSelected
                          : styles.changeText
                      }>
                      Public
                    </Text>
                  </TouchableHighlight>
                  <TouchableHighlight
                    underlayColor={hex}
                    onShowUnderlay={() => this.setState({public: false})}
                    style={{
                      alignSelf: 'center',
                      borderWidth: 2,
                      borderColor: hex,
                      borderRadius: 50,
                      width: '35%',
                      backgroundColor: this.state.public ? 'white' : hex,
                    }}
                    onPress={() => this.setState({public: false})}>
                    <Text
                      style={
                        this.state.public
                          ? styles.changeText
                          : styles.changeTextSelected
                      }>
                      Private
                    </Text>
                  </TouchableHighlight>
                </View>
              </View>
            </View>
          </Modal>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  topIcons: {
    color: hex,
    fontSize: 27,
    margin: '5%',
  },
  myProfile: {
    color: hex,
    fontWeight: 'bold',
    fontSize: 17,
    paddingLeft: '5%',
    fontFamily: font,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 63,
    borderWidth: 4,
    margin: '5%',
  },
  userInfo: {flexDirection: 'row', alignItems: 'center'},
  selected: {
    borderRadius: 40,
    borderColor: hex,
    borderWidth: 2,
    marginLeft: '5%',
    backgroundColor: hex,
  },
  unselected: {
    borderRadius: 40,
    borderColor: hex,
    borderWidth: 2,
    marginLeft: '5%',
    backgroundColor: '#fff',
  },
  selectedText: {
    fontFamily: font,
    color: '#fff',
    fontSize: 17,
    paddingLeft: '3%',
    paddingRight: '3%',
    paddingTop: '0.5%',
    paddingBottom: '0.5%',
  },
  unselectedText: {
    fontFamily: font,
    color: hex,
    fontSize: 17,
    paddingLeft: '3%',
    paddingRight: '3%',
    paddingTop: '0.5%',
    paddingBottom: '0.5%',
  },
  modal: {
    height: '50%',
    width: '75%',
    margin: '3%',
    backgroundColor: 'white',
    alignSelf: 'flex-end',
    borderRadius: 30,
    elevation: 20,
  },
  changeButtons: {
    alignSelf: 'center',
    borderWidth: 2,
    borderColor: hex,
    borderRadius: 50,
    width: '35%',
  },
  changeText: {
    fontFamily: font,
    color: hex,
    textAlign: 'center',
    fontSize: 17,
    paddingTop: '2.5%',
    paddingBottom: '2.5%',
  },
  changeTextSelected: {
    fontFamily: font,
    color: 'white',
    textAlign: 'center',
    fontSize: 17,
    paddingTop: '2.5%',
    paddingBottom: '2.5%',
  },
});
