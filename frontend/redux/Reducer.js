const INITIAL_STATE = {
  error: false,
  name: {},
  username: {},
  image: {},
  refresh: false,
  friends: [],
  gotNotif: false,
  code: 0,
  kick: false,
  hostEnd: false,
  session: {},
  isHost: false,
  match: {},
  top: [],
  disable: false,
  hold: false,
  notifs: [],
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

export const friendsReducer = (state = INITIAL_STATE, action) => {
  let friends = [...state.friends]
  switch (action.type) {
    case 'CHANGE_FRIENDS':
      return {
        ...state,
        friends: action.payload,
      }
    case 'ACCEPT_FRIEND':
      friends.forEach((item) => {
        if (item.uid === action.payload) item.status = 'friends'
      })
      return {
        ...state,
        friends: friends,
      }
    case 'PENDING_FRIEND':
      return {
        ...state,
        friends: [
          ...state.friends,
          {
            name: action.payload.name,
            username: action.payload.username,
            photo: action.payload.photo,
            uid: action.payload.uid,
            status: 'pending',
          },
        ],
      }
    case 'REQUEST_FRIEND':
      return {
        ...state,
        friends: [
          ...state.friends,
          {
            name: action.payload.name,
            username: action.payload.username,
            photo: action.payload.photo,
            uid: action.payload.uid,
            status: 'requested',
          },
        ],
      }
    case 'REMOVE_FRIEND':
      return {
        ...state,
        friends: friends.filter((item) => {
          if (item.uid !== action.payload) return item
        }),
      }
    default:
      return state
  }
}

export const notifReducer = (state = INITIAL_STATE, action) => {
  let notifs = [...state.notifs]
  switch (action.type) {
    case 'CHANGE_NOTIFICATIONS':
      return {
        ...state,
        notifs: [...action.payload],
      }
    case 'ADD_NOTIFICATION':
      return {
        ...state,
        notifs: [
          ...state.notifs,
          {
            id: action.payload.id.toString(),
            type: action.payload.type,
            createdAt: action.payload.createdAt,
            sender: action.payload.senderName,
            senderUsername: action.payload.senderUsername,
            senderPhoto: action.payload.senderPhoto,
            senderName: action.payload.name,
            content: action.payload.content,
            read: false,
          },
        ],
      }
    case 'REMOVE_NOTIFICATION':
      let afterRemove = notifs.filter(function (item) {
        if (!action.payload.includes(item.id)) return item
      })
      return {
        ...state,
        notifs: [...afterRemove],
      }
    case 'UPDATE_NOTIFICATION':
      notifs.forEach(function (item) {
        if (item.id === action.payload.id) item.type = action.payload.type
      })
      return {
        ...state,
        notifs: [...notifs],
      }
    default:
      return state
  }
}

export const gotNotifReducer = (state = INITIAL_STATE.gotNotif, action) => {
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

export const holdReducer = (state = INITIAL_STATE.hold, action) => {
  switch (action.type) {
    case 'SET_HOLD':
      return true
    case 'HIDE_HOLD':
      return false
    default:
      return state
  }
}
