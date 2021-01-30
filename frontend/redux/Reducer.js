const INITIAL_STATE = {
  error: false,
  name: '',
  username: '',
  image: '',
  refresh: false,
  friends: [],
  notif: true,
}

export const errorReducer = (state = INITIAL_STATE.error, action) => {
  switch (action.type) {
    case 'SHOW_ERROR':
      return true
    case 'HIDE_ERROR':
      return false
    default:
      return state
  }
}

export const nameReducer = (state = INITIAL_STATE.name, action) => {
  switch (action.type) {
    case 'CHANGE_NAME':
      return {
        ...state,
        name: action.payload,
      }
    default:
      return state
  }
}

export const usernameReducer = (state = INITIAL_STATE.name, action) => {
  switch (action.type) {
    case 'CHANGE_USERNAME':
      return {
        ...state,
        username: action.payload,
      }
    default:
      return state
  }
}

export const imageReducer = (state = INITIAL_STATE.name, action) => {
  switch (action.type) {
    case 'CHANGE_IMAGE':
      return {
        ...state,
        image: action.payload,
      }
    default:
      return state
  }
}

export const refreshReducer = (state = INITIAL_STATE.name, action) => {
  switch (action.type) {
    case 'SHOW_REFRESH':
      return true
    case 'HIDE_REFRESH':
      return false
    default:
      return state
  }
}

export const friendsReducer = (state = INITIAL_STATE.name, action) => {
  switch (action.type) {
    case 'CHANGE_FRIENDS':
      return {
        ...state,
        friends: action.payload,
      }
    default:
      return state
  }
}

export const notifReducer = (state = INITIAL_STATE.error, action) => {
  switch (action.type) {
    case 'NEW_NOTIF':
      return true
    case 'NO_NOTIF':
      return false
    default:
      return state
  }
}
