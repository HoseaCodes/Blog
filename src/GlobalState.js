import React, { createContext, useState } from 'react';
import ArticlesAPI from './API/ArticlesAPI';

export const GlobalState = createContext()


export const DataProvider = ({ children }) => {
    const [token, setToken] = useState(false)


    const state = {
        token: [token, setToken],
        articlesAPI: ArticlesAPI(),
    }

    return (
        <GlobalState.Provider value={state}>
            {children}
        </GlobalState.Provider>
    )
}
