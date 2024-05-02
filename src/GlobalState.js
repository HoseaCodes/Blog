import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useReducer
} from "react";
import axios from "axios";
import { v4 } from "uuid";
import ArticlesAPI from "./API/ArticlesAPI";
import ProductsAPI from "./API/ProductsAPI";
import UserAPI from "./API/UserAPI";
import Notification from "./Components/Notification/Notification";
import { useCookies } from "react-cookie";

export const GlobalState = createContext();

export const DataProvider = ({ children }) => {
  const [token, setToken] = useState(false);
  const [cookies] = useCookies(["cookie-name"]);

  const [globalState, dispatch] = useReducer((globalState, action) => {
    switch (action.type) {
      case "ADD_NOTIFICATION":
        return [...globalState, { ...action.payload }];
      case "REMOVE_NOTIFICATION":
        return globalState.filter(element => element.id !== action.id);
      default:
        return globalState;
    }
  }, []);

  useEffect(() => {
    const firstLogin = localStorage.getItem("firstLogin");
    const initialToken = cookies.accesstoken;
    if (firstLogin && !initialToken) {
      const refreshToken = async () => {
        try {
          const res = await axios.get("api/user/refresh_token");
          console.log(res, "refresh");
          setToken(res.data.accesstoken);
          setTimeout(() => {
            refreshToken();
          }, 10 * 60 * 1000);
        } catch (error) {
          console.log(error);
        }
      };

      refreshToken();
    }
  }, []);

  const state = {
    token: [token, setToken],
    productsAPI: ProductsAPI(),
    articlesAPI: ArticlesAPI(),
    // commentsAPI: CommentsAPI(id),
    userAPI: UserAPI(token),
    dispatch
  };
  ProductsAPI();
  return (
    <GlobalState.Provider value={state}>
      <div className={"notification-wrapper"}>
        {globalState.map(note => (
          <Notification dispatch={dispatch} key={note.id} {...note} />
        ))}
      </div>
      {children}
    </GlobalState.Provider>
  );
};

export const useNotification = () => {
  const notification = useContext(GlobalState);
  const { dispatch } = notification;

  return props => {
    dispatch({
      type: "ADD_NOTIFICATION",
      payload: {
        id: v4(),
        ...props
      }
    });
  };
};
