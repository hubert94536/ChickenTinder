import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  TouchableHighlight,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import {NAME, USERNAME, PHOTO} from 'react-native-dotenv';
import Icon from 'react-native-vector-icons/FontAwesome';

const hex = '#F25763';
const font = 'CircularStd-Medium';

export default class UserProfileView extends Component {
  state = {
    name: '',
    username: '',
    photo: '',
  };

  componentDidMount() {
    AsyncStorage.getItem(NAME).then(res => this.setState({name: res}));
    AsyncStorage.getItem(USERNAME).then(res => this.setState({username: res}));
    AsyncStorage.getItem(PHOTO).then(res => this.setState({photo: res}));
  }

  render() {
    return (
      <View>
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <Icon
            name="chevron-left"
            style={styles.topIcons}
            onPress={() => this.props.navigation.navigate('Home')}
          />
          <Icon name="cog" style={styles.topIcons} />
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
          <TouchableHighlight style={styles.buttons}>
            <Text style={({marginLeft: '5%'}, styles.buttonText)}>Friends</Text>
          </TouchableHighlight>
          <TouchableHighlight style={styles.buttons}>
            <Text style={styles.buttonText}>Requests</Text>
          </TouchableHighlight>
        </View>
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
  buttons: {
    borderRadius: 40,
    borderColor: hex,
    borderWidth: 2,
    marginLeft: '5%',
  },
  buttonText: {
    fontFamily: font,
    color: hex,
    fontSize: 17,
    paddingLeft: '3%',
    paddingRight: '3%',
    paddingTop: '0.5%',
    paddingBottom: '0.5%',
  },
});
