import React, { useContext, useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { GlobalState } from './GlobalState';
import ArticleItem from './Pages/Articles/ArticleCard';
import ReactHtmlParser from 'react-html-parser';

const DetailArticle = () => {
    const params = useParams()
    const state = useContext(GlobalState)
    const [articles] = state.articlesAPI.articles
    const [detailArticle, setdetailArticle] = useState([])

    useEffect(() => {
        if (params.id) {
            articles.forEach(article => {
                if (article._id === params.id) setdetailArticle(article)
            })
        }
    }, [params.id, articles])

    if (detailArticle.length === 0) return null;

    return (
        <>
            <div className="detail">
                <img src={detailArticle.images.url} alt="Product Detail" />
                <div className="box-detail">
                    <div className="row">
                        <h2>{detailArticle.title}</h2>
                        <h6>#id: {detailArticle.product_id}</h6>
                    </div>
                    <p>{detailArticle.description}</p>
                    <div>{ReactHtmlParser(detailArticle.sanitizedHtml)}</div>

                </div>
            </div>
            <div>
                <h2>Related Products</h2>
                <div className="products">
                    {
                        articles.map(article => {
                            return article.category === detailArticle.category
                                ? <ArticleItem key={article._id} article={article} /> : null
                        })
                    }
                </div>
            </div>
        </>
    )
}

export default DetailArticle;