const showError = () => {
  return {
    type: 'SHOW_ERROR',
  }
}

const hideError = () => {
  return {
    type: 'HIDE_ERROR',
  }
}

const changeName = (newName) => {
  return {
    type: 'CHANGE_NAME',
    payload: newName,
  }
}

const changeUsername = (newUsername) => {
  return {
    type: 'CHANGE_USERNAME',
    payload: newUsername,
  }
}

const changeImage = (newImage) => {
  return {
    type: 'CHANGE_IMAGE',
    payload: newImage,
  }
}

const changeFriends = (newFriends) => {
  return {
    type: 'CHANGE_FRIENDS',
    payload: newFriends,
  }
}

const showRefresh = () => {
  return {
    type: 'SHOW_REFRESH',
  }
}

const hideRefresh = () => {
  return {
    type: 'HIDE_REFRESH',
  }
}

const newNotif = () => {
  return {
    type: 'NEW_NOTIF',
  }
}

const noNotif = () => {
  return {
    type: 'NO_NOTIF',
  }
}

const setCode = (code) => {
  return {
    type: 'SET_CODE',
    payload: code,
  }
}

const showKick = () => {
  return {
    type: 'SHOW_KICK',
  }
}

const hideKick = () => {
  return {
    type: 'HIDE_KICK',
  }
}

const updateSession = (session) => {
  return {
    type: 'UPDATE_SESSION',
    payload: session,
  }
}

const removeNotif = (id) => {
  return {
    type: 'REMOVE_NOTIFICATION',
    payload: id
  }
}

const addNotif = (info) => {
  return {
    type: 'ADD_NOTIFICATION',
    payload: info
  }
}

const removeFriend = (uid) => {
  return {
    type: 'REMOVE_FRIEND',
    payload: uid
  }
}

const requestFriend = (info) => {
  return {
    type: 'REQUEST_FRIEND',
    payload: info
  }
}

const pendingFriend = (info) => {
  return {
    type: 'PENDING_FRIEND',
    payload: info
  }
}

const acceptFriend = (uid) => {
  return {
    type: 'ACCEPT_FRIEND',
    payload: uid
  }
}

const setHost = (isHost) => {
  return {
    type: 'SET_HOST',
    payload: isHost,
  }
}

const setMatch = (match) => {
  return {
    type: 'SET_MATCH',
    payload: match,
  }
}

const setTop = (top) => {
  return {
    type: 'SET_TOP',
    payload: top,
  }
}

const setDisable = () => {
  return {
    type: 'SET_DISABLE',
  }
}

const hideDisable = () => {
  return {
    type: 'HIDE_DISABLE',
  }
}

const setHold = () => {
  return {
    type: 'SET_HOLD',
  }
}

const hideHold = () => {
  return {
    type: 'HIDE_HOLD',
  }
}

export {
  showError,
  hideError,
  changeName,
  changeUsername,
  changeImage,
  changeFriends,
  acceptFriend,
  pendingFriend,
  requestFriend,
  removeFriend,
  showRefresh,
  hideRefresh,
  newNotif,
  noNotif,
  addNotif,
  removeNotif,
  setCode,
  showKick,
  hideKick,
  updateSession,
  setHost,
  setMatch,
  setTop,
  setDisable,
  hideDisable,
  setHold,
  hideHold,
}
