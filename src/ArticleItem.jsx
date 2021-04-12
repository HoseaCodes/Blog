import React from 'react';
import BtnRender from './BtnRender';

const ArticleItem = ({ article, deleteArticle, handleCheck }) => {

    return (
        <div className="product_card">
            <input type="checkbox" checked={article.checked}
                onChange={() => handleCheck(article._id)} />
            <img src={article.images.url} alt="product" />
            <div className="product_box">
                <h2 title={article.title}>
                    {article.title}
                </h2>
                <span>{article.subtitle}</span>
                <p>{article.description}</p>
            </div>
            <BtnRender article={article} deleteArticle={deleteArticle} />

        </div>
    )
}

export default ArticleItem;