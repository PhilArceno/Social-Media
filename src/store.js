import { createStore } from 'redux';

const initialState = {
    user: undefined,
    feed: [],
    chatLog: [],
    allUsers: []
}
  

function reducer(state = initialState, action) {
    switch (action.type) {
      case "SET-USER":
        return {
          ...state,
          user: action.content
        }
        case "SET-FEED":
            return {
              ...state,
              feed: action.content
            }
        case "GET-USERS":
          return {
            ...state,
            allUsers: action.content
          }
        case "GET-CHATS":
          return {
            ...state,
            chatLog: action.content
          }
          case "LOGOUT":
            return {
              ...state,
              user: undefined,
              feed: [],
              chatLog: [],
              allUsers: []
            }
      default:
        return state;
    }
  }

const store = createStore(
    reducer, 
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
)

export default store;