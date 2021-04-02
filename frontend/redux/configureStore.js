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
  setMatchReducer,
  setTopReducer,
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
  match: setMatchReducer,
  top: setTopReducer,
})

const configureStore = () => {
  return createStore(rootReducer)
}

export default configureStore
