import { createStore, combineReducers } from 'redux'
import {
  errorReducer,
  nameReducer,
  usernameReducer,
  imageReducer,
  refreshReducer,
  friendsReducer,
  notifReducer,
  codeReducer,
  kickReducer,
  sessionReducer,
  setHostReducer,
} from './Reducer.js'

const rootReducer = combineReducers({
  error: errorReducer,
  name: nameReducer,
  username: usernameReducer,
  image: imageReducer,
  refresh: refreshReducer,
  friends: friendsReducer,
  notif: notifReducer,
  code: codeReducer,
  kick: kickReducer,
  session: sessionReducer,
  isHost: setHostReducer,
})

const configureStore = () => {
  return createStore(rootReducer)
}

export default configureStore
