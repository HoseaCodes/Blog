import React from 'react';
import BtnRender from './BtnRender';
import ReactHtmlParser from 'react-html-parser';

const ArticleItem = ({ article, deleteArticle, handleCheck }) => {
    console.log(article)
    return (
        <div className="product_card">
            <input type="checkbox" checked={article.checked}
                onChange={() => handleCheck(article._id)} />
            <img src={article.images.url} alt="product" />
            <div className="product_box">
                <h2 title={article.title}>
                    <a href={`/blog/${article.id}`}> {article.title}</a>
                </h2>
                <span>{article.subtitle}</span>
                <p>{article.description}</p>
                <div>{ReactHtmlParser(article.sanitizedHtml)}</div>
            </div>
            <BtnRender article={article} deleteArticle={deleteArticle} />

        </div>
    )
}

export default ArticleItem;