import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useReducer
} from "react";
import ArticlesAPI from './API/ArticlesAPI';
import GithubAPI from './API/GithubAPI';
import UserAPI from "./API/UserAPI";
import KayneWestAPI from "./API/KanyeWestAPI";
import JokeAPI from "./API/JokeAPI";
import BlogAPI from "./API/BlogAPI";
import MediaAPI from "./API/MediaAPI";
import CollaborationAPI from "./API/CollaborationAPI";
import AnalyticsAPI from "./API/AnalyticsAPI";
import SEOAPI from "./API/SEOAPI";
import AIAPI from "./API/AIAPI";
import CommentsAPI from "./API/CommentsAPI";
import { v4 } from "uuid";
import ProductsAPI from "./API/ProductsAPI";
import Notification from "./Components/Notification/Notification";
import { useCookies } from "react-cookie";

export const GlobalState = createContext();

export const DataProvider = ({ children }) => {
  const [token, setToken] = useState(false);
  const [cookies] = useCookies(["accesstoken"]);

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
    setToken(cookies.accesstoken);
  }, [cookies.accesstoken]);

  const state = {
    token: [token, setToken],
    productsAPI: ProductsAPI(),
    articlesAPI: ArticlesAPI(),
    commentsAPI: CommentsAPI,
    userAPI: UserAPI(token),
    githubAPI: GithubAPI(),
    kayneWestAPI: KayneWestAPI(),
    jokeAPI: JokeAPI(),
    // Enterprise Blog APIs
    blogAPI: BlogAPI(token),
    mediaAPI: MediaAPI(token),
    collaborationAPI: CollaborationAPI(token),
    analyticsAPI: AnalyticsAPI(token),
    seoAPI: SEOAPI(token),
    aiAPI: AIAPI(token),
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
