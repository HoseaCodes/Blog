import React from 'react';
import { Link } from 'react-router-dom';

function BtnRender({ article, deleteArticle }) {

    return (
        <div className="row_btn">
            <Link id="btn_buy" to="#!" onClick={() => deleteArticle(article._id, article.images.public_id)}> Delete</Link>
            <Link id="btn_view" to={`/edit_article/${article._id}`}> Edit</Link>


        </div>
    )
}

export default BtnRender;