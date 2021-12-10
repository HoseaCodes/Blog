import React, { createContext, useContext, useState, useEffect, useReducer } from "react";
import ArticlesAPI from './API/ArticlesAPI';
import UserAPI from "./API/UserAPI";
import axios from "axios";
import {v4} from "uuid";
import Notification from './Components/Notification/Notification'

export const GlobalState = createContext();

export const DataProvider = ({ children }) => {
  const [token, setToken] = useState(false);
  const [state, dispatch] = useReducer((state, action) => {
    switch(action.type) {
      case "ADD_NOTIFICATION":
        return [...state, {...action.payload}];
      case "REMOVE_NOTIFICATION":
        return state.filter(element => element.id !== action.id);
      default:
        return state
    }
  }, []);

    useEffect(() => {
		const firstLogin = localStorage.getItem("firstLogin");
		if (firstLogin) {
			const refreshToken = async () => {
				const res = await axios.get("api/user/refresh_token");
				setToken(res.data.accesstoken);
				setTimeout(() => {
					refreshToken();
				}, 10 * 60 * 1000);
			};

			refreshToken();
		}
	}, []);

    const globalState = {
        token: [token, setToken],
        articlesAPI: ArticlesAPI(),
        userAPI: UserAPI(token),
        dispatch: dispatch

    }

    return (
        <GlobalState.Provider value={globalState}>
            <div className={"notification-wrapper"}>
              {state.map(note => {
                return <Notification dispatch={dispatch} key={note.id} {...note}/>
              })}
            </div>
            {children}
        </GlobalState.Provider>
    )
}

export const useNotification = () => {
  const notification = useContext(GlobalState);
  const dispatch = notification.dispatch

  return (props) => {
    dispatch({
      type: "ADD_NOTIFICATION",
      payload: {
        id: v4(),
        ...props
      }
    })
  }
};
