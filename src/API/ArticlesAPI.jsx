import { useState, useEffect } from 'react';
import axios from 'axios'

function ArticlesAPI() {
    const [articles, setArticles] = useState([])
    const [result, setResult] = useState(0)
    const [callback, setCallback] = useState(false)
    const [category, setCategory] = useState('')

    useEffect(() => {
        const getArticles = async () => {
            const res = await axios.get(`/api/articles`)
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
