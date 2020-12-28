import AsyncStorage from '@react-native-community/async-storage'
import { ID } from 'react-native-dotenv'
import axios from 'axios'

var myId = ''

AsyncStorage.getItem(ID).then((res) => {
  myId = res
})

const uploadApi = axios.create({
  baseURL: 'https://wechews.herokuapp.com',
  // baseURL: 'http://172.16.0.10:5000'
})

/**
 * uploads photo to server
 * @param {uri, type, name} photo an object containing the uri, type, and name of the photo to be uploaded
 * @returns {string} a link to the uploaded photo on AWS
 * get info from the two separate libraries
 * NOTE: Check if crop-picker automatically resizes image (without restricting cropping)
 * from crop-picker: type: res.mime
 * pass res.path into ImageResizer.createResizedImage
 * from image-resizer: uri: res.uri, name: res.name
 */
const uploadPhoto = async (photo) => {
  if (!photo) return
  const config = {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'multipart/form-data',
    },
  }
  const data = new FormData()
  data.append('id', myId)
  data.append('avatar', photo)

  return uploadApi
    .post('/images', data, config)
    .then((res) => {
      return res.data
    })
    .catch((error) => {
      console.log(error)
      Promise.reject(error.response)
    })
}

/**
 * deletes photo from AWS and replaces user's photo in database
 * @param {string} replacement a string to replace the user's photo string in the database
 */
const removePhoto = async (replacement = '') => {
  const url = await AsyncStorage.getItem(PHOTO).then((photo) => {return url.split('/')})

  if (url[2] != "wechews-images-2020.s3.us-west-1.amazonaws.com") 
    throw {name: "InvalidUrlError", message: "photo url is invalid"}

  return uploadApi
    .delete('/images', {key: url[3], id: myId, replacement: replacement})
    .then((res) => {
      return res.status
    })
    .catch((error) => {
      console.log(error)
      Promise.reject(error.response)
    })

}

export default {
  uploadPhoto,
  removePhoto
}