const INITIAL_STATE = {
  error: false,
  name: {},
  username: {},
  image: {},
  refresh: false,
  friends: {},
  notif: false,
  code: 0,
  kick: false,
  hostEnd: false,
  session: {},
  isHost: false,
  match: {},
  top: [],
  disable: false
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

export const usernameReducer = (state = INITIAL_STATE.username, action) => {
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

export const imageReducer = (state = INITIAL_STATE.image, action) => {
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

export const refreshReducer = (state = INITIAL_STATE.refresh, action) => {
  switch (action.type) {
    case 'SHOW_REFRESH':
      return true
    case 'HIDE_REFRESH':
      return false
    default:
      return state
  }
}

export const friendsReducer = (state = INITIAL_STATE.friends, action) => {
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

export const notifReducer = (state = INITIAL_STATE.notif, action) => {
  switch (action.type) {
    case 'NEW_NOTIF':
      return true
    case 'NO_NOTIF':
      return false
    default:
      return state
  }
}

export const codeReducer = (state = INITIAL_STATE.code, action) => {
  switch (action.type) {
    case 'SET_CODE':
      return {
        ...state,
        code: action.payload,
      }
    default:
      return state
  }
}

export const kickReducer = (state = INITIAL_STATE.kick, action) => {
  switch (action.type) {
    case 'SHOW_KICK':
      return true
    case 'HIDE_KICK':
      return false
    default:
      return state
  }
}

export const sessionReducer = (state = INITIAL_STATE.session, action) => {
  switch (action.type) {
    case 'UPDATE_SESSION':
      return {
        ...state,
        session: action.payload,
      }
    default:
      return state
  }
}

export const setHostReducer = (state = INITIAL_STATE.isHost, action) => {
  switch (action.type) {
    case 'SET_HOST':
      return {
        ...state,
        isHost: action.payload,
      }
    default:
      return state
  }
}

export const setMatchReducer = (state = INITIAL_STATE.match, action) => {
  switch (action.type) {
    case 'SET_MATCH':
      return {
        ...state,
        match: action.payload,
      }
    default:
      return state
  }
}

export const setTopReducer = (state = INITIAL_STATE.top, action) => {
  switch (action.type) {
    case 'SET_TOP':
      return {
        ...state,
        top: action.payload,
      }
    default:
      return state
  }
}

export const disableReducer = (state = INITIAL_STATE.disable, action) => {
  switch (action.type) {
    case 'SET_DISABLE':
      return true
    case 'HIDE_DISABLE':
      return false
    default:
      return state
  }
}