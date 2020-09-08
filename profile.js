import React, {Component} from 'react';
import {StyleSheet, Text, View, Image, ScrollView} from 'react-native';

const hex = '#F25763';

export default class UserProfileView extends Component {
  render() {
    return (
      <ScrollView>
        <View>
          <Text style={styles.topBar}>My Profile</Text>
        </View>
        <View style={styles.headerContent}>
          <Image
            style={styles.avatar}
            source={{
              uri:
                'https://i0.wp.com/www.usmagazine.com/wp-content/uploads/2020/07/Mark-Zuckerberg-Spooks-the-Internet-With-Too-Much-Sunscreen-on-His-Face-in-Hawaii-01.jpg?crop=557px%2C82px%2C896px%2C471px&resize=1200%2C630&ssl=1',
            }}
          />
          <View style={{flexDirection: 'column', alignItems: 'flex-start'}}>
            <Text style={styles.name}>Hubert Chen</Text>
            <Text style={styles.info}>@hubesc</Text>
          </View>
        </View>
        <View style={styles.toggle}>
          <Text style={styles.togglecontent}>Saved Spots</Text>
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  topBar: {
    color: hex,
    fontWeight: 'bold',
    fontSize: 20,
    paddingTop: '5%',
    paddingLeft: '3%',
  },
  headerContent: {
    padding: 30,
    alignItems: 'flex-start',
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  avatar: {
    width: 130,
    height: 130,
    borderRadius: 63,
    borderWidth: 4,
    borderColor: 'white',
    marginBottom: 10,
  },
  name: {
    fontSize: 25,
    fontWeight: 'bold',
    alignSelf: 'center',
  },
  info: {
    fontSize: 18,
    marginTop: 20,
  },
  toggle: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  togglecontent: {
    color: hex,
    fontWeight: 'bold',
    fontSize: 16,
  },
  image: {
    width: 140,
    height: 140,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'white',
    margin: '3%',
  },
  gallery: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  col: {
    flexDirection: 'column',
    flex: 2,
    alignItems: 'center',
  },
});
