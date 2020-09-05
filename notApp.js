// /**
//  * Sample React Native App
//  * https://github.com/facebook/react-native
//  *
//  * @format
//  * @flow strict-local
//  */

// import React, { Component, useState, useEffect } from 'react';
// import api from './api.js';
// import Swiper from 'react-native-deck-swiper';
// import { Transitioning, Transition } from 'react-native-reanimated';
// import data from './data';
// import { facebookService } from './facebookService.js';
// import {
//   Image,
//   SafeAreaView,
//   StyleSheet,
//   ScrollView,
//   View,
//   Text,
//   StatusBar,
//   Dimensions,
// } from 'react-native';

// export default function App() {
//   const [index, setIndex] = useState(0);
//   const [results, setResults] = useState([]);

//   useEffect(() => {
//     api.getRestaurants('boba', 'arcadia california').then(response => {
//       console.log(response.businessList),
//         console.log(response.total),
//         setResults(response.businessList);
//         api.checkUsername('hub');
//     });
//   }, []);

//   const Card = ({card}) => {
//     while (results.length == 0)
//       return <Text style={styles.card}>Fetching Restaurants!</Text>;
//     return (
//       <View style={styles.card}>
//         {/* <Image source={{uri: card.image}} style={styles.cardImage} /> */}
//         <Text>
//           {card.price} {card.name}
//         </Text>
//         <Text>{card.reviewCount} Reviews</Text>
//         <Text>Average Rating: {card.rating} Stars</Text>
//         <Text style={{fontWeight: 'bold'}}>
//           Contact Information:{' '}
//           <Text style={{fontWeight: 'normal'}}>{card.phone}</Text>
//         </Text>
//         <Text style={{fontWeight: 'bold'}}>
//           Address:{' '}
//           <Text style={{fontWeight: 'normal'}}>
//             {/* {card.location.display_address[0]},{' '}
//             {card.location.display_address[1]} */}
//           </Text>
//         </Text>
//       </View>
//     );
//   };

//   const onSwiped = () => {
//     // transitionRef.current.animateNextTransition();
//     setIndex(index + 1);
//   };
//   return (
//     <SafeAreaView style={styles.mainContainer}>
//     <View style={styles.cardContainer}>
//       <Swiper
//         cards = {data}
//         cardIndex= {index}
//         renderCard= {(card) => <Card card= {card}/>}
//         onSwiper = {onSwiped}
//         stackSize = {10}
//         stackSeparation = {0}
//         backgroundColor= {'transparent'}

//         animateOverlayLabelsOpacity

//         //Overlay offsets adjusted to flex sizing. May need to be retested on different device
//         overlayLabels={{
//           left: {
//             title: 'NOPE',
//             style: {
//               label: {
//                 backgroundColor: 'red',
//                 borderColor: 'red',
//                 color: 'white',
//                 borderWidth: 1,
//                 fontSize: 24
//               },
//               wrapper: {
//                 flexDirection: 'column',
//                 alignItems: 'flex-end',
//                 justifyContent: 'flex-start',
//                 marginTop: 20,
//                 marginLeft: -50
//               }
//             }
//           },
//           right: {
//             title: 'LIKE',
//             style: {
//               label: {
//                 backgroundColor: 'green',
//                 borderColor: 'green',
//                 color: 'white',
//                 borderWidth: 1,
//                 fontSize: 24
//               },
//               wrapper: {
//                 flexDirection: 'column',
//                 alignItems: 'flex-start',
//                 justifyContent: 'flex-start',
//                 marginTop: 20,
//                 marginLeft: 20
//               }
//             }
//           },
//           bottom: {
//             title: 'HATE',
//             style: {
//               label: {
//                 backgroundColor: 'black',
//                 borderColor: 'black',
//                 color: 'white',
//                 borderWidth: 1,
//                 fontSize: 24
//               },
//               wrapper: {
//                 flexDirection: 'column',
//                 alignItems: 'center',
//                 justifyContent: 'flex-start',
//                 marginTop: 20,
//                 marginLeft: -20
//               }
//             }
//           },
//           top: {
//             title: 'LOVE',
//             style: {
//               label: {
//                 backgroundColor: 'pink',
//                 borderColor: 'pink',
//                 color: 'white',
//                 borderWidth: 1,
//                 fontSize: 24
//               },
//               wrapper: {
//                 flexDirection: 'column',
//                 alignItems: 'center',
//                 justifyContent: 'flex-end',
//                 marginTop: -50,
//                 marginLeft: -20
//               }
//             }
//           }

//         }}
//       />
//     </View>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({

//   //Fullscreen
//   mainContainer: {
//     flex: 1,
//     backgroundColor: '#6495ed',
//   },

//   //Card area is now flexsized and takes 90% of the width of screen
//   cardContainer: {
//     borderRadius: 17,
//     borderWidth: 0,
//     borderColor: '#000',
//     alignSelf: 'center',
//     marginTop: 5,
//     width: "90%",
//     aspectRatio: 5/8,
//   },

//   //Sizing is now based on aspect ratio
//   card: {
//     backgroundColor: '#fff',
//     borderRadius: 17,
//     borderWidth: 0,
//     borderColor: '#000',
//     alignSelf: 'flex-start',
//     width: "90%",
//     aspectRatio: 5/8,
//   },

//   //Card image is now centered
//   cardImage: {
//     marginTop: 60,
//     flex: 0.5,
//     resizeMode: 'contain',
//   },
// });

import React, {useState} from 'react';
import {Button, TextInput} from 'react-native';
import firebase from 'firebase';
import {
  FIREBASE_API_KEY,
  FIREBASE_APPLICATION_ID,
  FIREBASE_AUTH_DOMAIN,
  FIREBASE_DATABASE,
  FIREBASE_STORAGE_BUCKET,
  FIREBASE_PROJECT_ID,
} from 'react-native-dotenv';
const config = {
  apiKey: FIREBASE_API_KEY, // Auth / General Use
  applicationId: FIREBASE_APPLICATION_ID, // General Use
  projectId: FIREBASE_PROJECT_ID, // General Use
  authDomain: FIREBASE_AUTH_DOMAIN, // Auth with popup/redirect
  databaseURL: FIREBASE_DATABASE, // Realtime Database
  storageBucket: FIREBASE_STORAGE_BUCKET, //Storage
};
firebase.initializeApp(config);
export default function PhoneSignIn() {
  // If null, no SMS has been sent
  const [confirm, setConfirm] = useState(null);
  const [code, setCode] = useState('');
  // Handle the button press
  async function signInWithPhoneNumber(phoneNumber) {
    const confirmation = await firebase
      .auth()
      .signInWithPhoneNumber(phoneNumber);
    setConfirm(confirmation);
  }
  async function confirmCode() {
    try {
      await confirm.confirm(code);
    } catch (error) {
      console.log('Invalid code.');
    }
  }
  if (!confirm) {
    return (
      <Button
        title="Phone Number Sign In"
        onPress={() => signInWithPhoneNumber('+1 909-532-4384')}
      />
    );
  }
  return (
    <>
      <TextInput value={code} onChangeText={text => setCode(text)} />
      <Button title="Confirm Code" onPress={() => confirmCode()} />
    </>
  );
}