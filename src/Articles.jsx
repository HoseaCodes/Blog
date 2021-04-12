import React, { useContext, useState } from 'react';
import { GlobalState } from './GlobalState';
import ArticleItem from './ArticleItem';
import Loading from './Loading'
import axios from 'axios'

const Articles = () => {

    const state = useContext(GlobalState)
    const [articles, setArticles] = state.articlesAPI.articles
    const [token] = state.token
    const [callback, setCallback] = state.articlesAPI.callback
    const [loading, setLoading] = useState(false)
    const [isCheck, setIsCheck] = useState(false)

    const deleteArticle = async (id, public_id) => {
        try {
            setLoading(true)
            const destroyImg = axios.post('/api/destory', { public_id })
            const deleteArticle = axios.delete(`/api/articles/${id}`)
            await destroyImg
            await deleteArticle
            setLoading(false)
            setCallback(!callback)
        } catch (err) {
            alert(err.response.data.msg)
        }
    }

    const handleCheck = async (id) => {
        articles.forEach(article => {
            if (article._id === id) article.checked = !article.checked
        })
        setArticles([...articles])
    }

    const checkAll = () => {
        articles.forEach(article => {
            article.checked = !isCheck
        })
        setArticles([...articles])
        setIsCheck(!isCheck)
    }

    const deleteAll = () => {
        articles.forEach(article => {
            if (article.checked) deleteArticle(article._id, article.images.public_id)
        })
    }

    if (loading) return <div className="products"><Loading /></div>

    return (
        <>

            <div className="delete-all">
                <span>Select All</span>
                <input type="checkbox" checked={isCheck} onChange={checkAll} />
                <button onClick={deleteAll}>Delete All</button>
            </div>
            <div className="products">
                {
                    articles.map(article => {
                        return <ArticleItem key={article._id} article={article}
                            deleteArticle={deleteArticle} handleCheck={handleCheck} />
                    })
                }

            </div>
        </>
    )
}

export default Articles;