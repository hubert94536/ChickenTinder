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

const showEnd = () => {
  return {
    type: 'SHOW_END',
  }
}

const hideEnd = () => {
  return {
    type: 'HIDE_END',
  }
}

export {
  showError,
  hideError,
  changeName,
  changeUsername,
  changeImage,
  changeFriends,
  showRefresh,
  hideRefresh,
  newNotif,
  noNotif,
  setCode,
  showKick,
  hideKick,
  showEnd,
  hideEnd,
}
