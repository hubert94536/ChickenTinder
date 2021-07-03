import { createStore, combineReducers } from 'redux'
import {
  errorReducer,
  nameReducer,
  usernameReducer,
  imageReducer,
  refreshReducer,
  friendsReducer,
  gotNotifReducer,
  notifReducer,
  codeReducer,
  kickReducer,
  sessionReducer,
  setHostReducer,
  setMatchReducer,
  setTopReducer,
  disableReducer,
  holdReducer,
} from './Reducer.js'

const rootReducer = combineReducers({
  error: errorReducer,
  name: nameReducer,
  username: usernameReducer,
  image: imageReducer,
  refresh: refreshReducer,
  friends: friendsReducer,
  gotNotif: gotNotifReducer,
  notifs: notifReducer,
  code: codeReducer,
  kick: kickReducer,
  session: sessionReducer,
  isHost: setHostReducer,
  match: setMatchReducer,
  top: setTopReducer,
  disable: disableReducer,
  hold: holdReducer,
})

const configureStore = () => {
  return createStore(rootReducer)
}

export default configureStore
