import { useState, useEffect } from 'react';
import axios from 'axios'
import { getBasicAuth } from '../Utils/helperFunctions';

function ArticlesAPI() {
    const [articles, setArticles] = useState([])
    const [result, setResult] = useState(0)
    const [callback, setCallback] = useState(false)
    const [category, setCategory] = useState('')

    useEffect(() => {
        const getArticles = async () => {
            const username = process.env.REACT_APP_USERNAME || "admin";
            const password = process.env.REACT_APP_PASSWORD || "password";
            const auth = getBasicAuth(username, password);
            const res = await axios.get(`/api/articles`, {
              headers: {
                Authorization: auth,
              }
            });
            setArticles(res.data.articles)
            setResult(res.data.result)
        }
        getArticles()
    }, [callback, category])

    return {
        articles: [articles, setArticles],
        result: [result, setResult],
        callback: [callback, setCallback],
        category: [category, setCategory],
    }

}

export default ArticlesAPI;
