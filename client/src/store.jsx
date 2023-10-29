import { createContext, useReducer } from "react";

export const Store = createContext();

const initialState = {
  Notification: [],
  userInfo: localStorage.getItem("userInfo")
    ? JSON.parse(localStorage.getItem("userInfo"))
    : null,
};
function reducer(state, action) {
  switch (action.type) {
    case "USER_SIGNIN":
      return { ...state, userInfo: action.payload };
    case "USER_SIGNOUT":
      return {
        ...state,
        userInfo: null,
      };
    case "NOTIFICATION":
      return {
        ...state,
        Notification: action.payload,
      };
    case "LOGIN_START":
      return {
        userInfo: null,
        isFetching: true,
        error: false,
      };
    case "LOGIN_SUCCESS":
      return {
        userInfo: action.payload,
        isFetching: false,
        error: false,
      };
    case "LOGIN_FAILURE":
      return {
        userInfo: null,
        isFetching: false,
        error: true,
      };
    case "FOLLOW":
      return {
        ...state,
        userInfo: {
          ...state.userInfo,
          followings: [...state.userInfo.followings, action.payload],
        },
      };
    case "UNFOLLOW":
      return {
        ...state,
        userInfo: {
          ...state.userInfo,
          followings: state.userInfo.followings.filter(
            (following) => following !== action.payload
          ),
        },
      };

    default:
      return state;
  }
}

export function StoreProvider(props) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const value = { state, dispatch };
  return <Store.Provider value={value}>{props.children} </Store.Provider>;
}
