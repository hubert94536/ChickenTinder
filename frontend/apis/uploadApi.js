import AsyncStorage from '@react-native-community/async-storage'
import { ID } from 'react-native-dotenv'
import axios from 'axios'

var myId = ''

AsyncStorage.getItem(ID).then((res) => {
  myId = res
})

const uploadApi = axios.create({
  // baseURL: 'https://wechews.herokuapp.com',
  baseURL: 'http://172.16.0.10:5000'
})

/**
 * uploads photo to server
 * @param {uri, type, name} photo an object containing the uri, type, and name of the photo to be uploaded
 * get info from the two separate libraries
 * NOTE: Check if crop-picker automatically resizes image (without restricting cropping)
 * from crop-picker: type: res.mime
 * pass res.path into ImageResizer.createResizedImage
 * from image-resizer: uri: res.uri, name: res.name 
 */
const uploadPhoto = async (photo) => {
    console.log('uploadApi');
    const config = {
        headers: {
            Accept: "application/json",
            "Content-Type": "multipart/form-data"
        }
    };
    const data = new FormData();
    data.append('id', myId);
    data.append('avatar', photo);

    console.log(data);
    console.log(photo);

    // return uploadApi.get('/accounts')
    //       .then((res) => {
    //         console.log(res)
    //       })

    // const uploadUrl = 'http://172.16.0.10:5000/images'
    // return fetch(uploadUrl, {
    //   method: 'post',
    //   body: data
    // })
    //   .then((res) => res.json())
    //   .then((res) => console.log(res));

    return uploadApi
        .post('/images', data, config)
        .then((res) => {
          console.log("upload success")
          console.log(res) 
          return res.status
         })
        .catch((error) => {
          console.log("upload error")
          console.log(error); 
          throw error.response.status
         })
}

export default {
    uploadPhoto
}