import React from 'react'
import AsyncStorage from '@react-native-community/async-storage'
import { EMAIL, NAME, PHOTO, USERNAME, ID, PHONE, DEFPHOTO } from 'react-native-dotenv'
import { Image, StyleSheet, Text, TextInput, TouchableHighlight, View } from 'react-native'
import accountsApi from '../apis/accountsApi.js'
import screenStyles from '../../styles/screenStyles.js'
import PropTypes from 'prop-types'
import ImagePicker from 'react-native-image-crop-picker'
import defImages from '../assets/images/foodImages.js'
import uploadApi from '../apis/uploadApi.js'

const hex = '#F15763'
const textColor = '#6A6A6A'

export default class createAccount extends React.Component {
  constructor() {
    super()
    this.state = {
      pressed: false,
      alert: false,
      errorAlert: false,
      name: '',
      username: '',
      phone: '',
      email: '',
      id: 22,
      photo: '',
      defImg: '',
      defImgInd: 0,
    }
  }

  async componentDidMount() {
    // accountsApi.deleteUser()

    var index = Math.floor(Math.random() * defImages.length)
    this.setState({
      name: await AsyncStorage.getItem(NAME),
      id: await AsyncStorage.getItem(ID),
      email: await AsyncStorage.getItem(EMAIL),
      // photo: await AsyncStorage.getItem(PHOTO),
      phone: await AsyncStorage.getItem(PHONE),
      defImg: defImages[index],
      defImgInd: index,
    })
    AsyncStorage.setItem(DEFPHOTO, this.state.defImgInd.toString())
  }

  //  checks whether or not the username can be set
  handleClick() {
    console.log("finish");
    console.log(this.state);
    accountsApi
      .checkUsername(this.state.username)
      .then(() => {
        AsyncStorage.setItem(USERNAME, this.state.username)
        AsyncStorage.setItem(PHOTO, this.state.photo)
        AsyncStorage.setItem(NAME, this.state.name)
        AsyncStorage.setItem(EMAIL, this.state.email)
        // AsyncStorage.setItem(ID, this.state.id)
        AsyncStorage.setItem(PHONE, this.state.phone)
        AsyncStorage.setItem(DEFPHOTO, this.state.defImgInd.toString())

        return accountsApi
          .createFBUser(
            this.state.name,
            this.state.id,
            this.state.username,
            this.state.email,
            this.state.photo,
          )
          .then(() => {
            this.props.navigation.navigate('Home')
          })
      })
      .then(() => uploadApi.uploadPhoto(this.state.photoData))
      .catch((error) => {
        if (error === 404) {
          this.setState({ takenAlert: true })
        } else {
          this.setState({ errorAlert: true })
        }
      })
  }

  altHandleClick() {
    this.props.navigation.navigate('Home')
  }

  uploadPhoto() {
    ImagePicker.openPicker({
      width: 150,
      height: 150,
      cropping: true,
    }).then((image) => {
      this.setState({ 
        photo: image.path, 
        photoData: {
          uri: image.path,
          type: image.mime,
          name: "avatar"
        }
       })
    })
    console.log('upload photo')
  }

  render() {
    return (
      <View style={[{ backgroundColor: 'white', flex: 1 }]}>
        <Text
          style={[
            screenStyles.text,
            screenStyles.title,
            {
              fontFamily: 'CircularStd-Bold',
              fontSize: 25,
              marginTop: '10%',
              marginBottom: '5%',
              fontWeight: 'bold',
            },
          ]}
        >
          Create Account
        </Text>
        <Text style={[styles.mediumText]}>Account Verified!</Text>
        <Text style={[styles.mediumText]}>Finish setting up your account</Text>

        {this.state.photo ? 
          <Image
            source={{
              uri: this.state.photo,
            }}
            style={screenStyles.avatar}
          />
        : 
          <Image source={this.state.defImg} style={screenStyles.avatar} />
        }
        <Text
          style={[
            styles.mediumText,
            { fontSize: 15, color: hex, fontWeight: 'bold', marginBottom: '5%' },
          ]}
          onPress={() => this.uploadPhoto()}
        >
          Upload Profile Photo
        </Text>
        <Text style={[styles.mediumText, styles.fieldName]}>Display Name</Text>
        <TextInput
          style={[styles.fieldText]}
          textAlign="left"
          placeholder="Name"
          onChangeText={(name) => {
            this.setState({ name })
          }}
          value={this.state.name}
        />

        <Text style={[styles.mediumText, styles.fieldName]}>Username</Text>
        <TextInput
          style={[styles.fieldText]}
          textAlign="left"
          placeholder="@username"
          onChangeText={(username) => {
            this.setState({ username })
          }}
          value={this.state.username}
        />

        <Text style={[styles.mediumText, styles.fieldName]}>Phone Number</Text>
        <TextInput
          style={[styles.fieldText]}
          textAlign="left"
          placeholder="(xxx)xxx-xxxx"
          onChangeText={(phone) => {
            this.setState({ phone })
          }}
          value={this.state.phone}
        />

        <Text style={[styles.mediumText, styles.fieldName]}>Email</Text>
        <TextInput
          style={[styles.fieldText]}
          textAlign="left"
          placeholder="email@domain.com"
          onChangeText={(email) => {
            this.setState({ email: email })
          }}
          value={this.state.email}
        />

        <TouchableHighlight
          onShowUnderlay={() => this.setState({ finishPressed: true })}
          onHideUnderlay={() => this.setState({ finishPressed: false })}
          activeOpacity={1}
          underlayColor={'white'}
          onPress={() => this.handleClick()}
          style={[screenStyles.longButton, styles.button]}
        >
          <View style={{ flexDirection: 'row', alignSelf: 'center' }}>
            <Text
              style={[
                screenStyles.longButtonText,
                this.state.phonePressed ? { color: hex } : { color: 'white' },
              ]}
            >
              Finish
            </Text>
          </View>
        </TouchableHighlight>
      </View>
    )
  }
}

createAccount.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
}
const styles = StyleSheet.create({
  button: {
    borderColor: hex,
    backgroundColor: hex,
    width: '20%',
    marginTop: '3%',
  },
  mediumText: {
    fontFamily: 'CircularStd-Medium',
    alignSelf: 'center',
    fontSize: 18.5,
    color: textColor,
  },
  fieldText: {
    fontFamily: 'CircularStd-Book',
    fontSize: 18,
    color: textColor,
    marginHorizontal: '12%',
    marginBottom: '3%',
    paddingVertical: '1%',
    borderBottomColor: textColor,
    borderBottomWidth: 1,
  },
  fieldName: {
    alignSelf: 'flex-start',
    color: 'black',
    marginLeft: '10%',
  },
})
