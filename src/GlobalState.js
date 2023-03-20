import React, { createContext, useContext, useState, useEffect, useReducer } from "react";
import ArticlesAPI from './API/ArticlesAPI';
import ProductsAPI from "./API/ProductsAPI";
import UserAPI from "./API/UserAPI";
import axios from "axios";
import {v4} from "uuid";
import Notification from './Components/Notification/Notification'

export const GlobalState = createContext();

export const DataProvider = ({ children }) => {
  const [token, setToken] = useState(false);
  const [globalState, dispatch] = useReducer((globalState, action) => {
    switch(action.type) {
      case "ADD_NOTIFICATION":
        return [...globalState, {...action.payload}];
      case "REMOVE_NOTIFICATION":
        return globalState.filter(element => element.id !== action.id);
      default:
        return globalState
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

    const state = {
        token: [token, setToken],
        productsAPI: ProductsAPI(),
        articlesAPI: ArticlesAPI(),
        userAPI: UserAPI(token),
        dispatch: dispatch

    }
    console.log(state)
    ProductsAPI();
    return (
        <GlobalState.Provider value={state}>
            <div className={"notification-wrapper"}>
              {globalState.map(note => {
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
