import React from 'react';
import { Link } from 'react-router-dom';
import './Articles.css'
import BtnRender from './BtnRender';
// import ReactHtmlParser from 'react-html-parser';
import VisibilityIcon from '@material-ui/icons/Visibility';

const ArticleItem = (props) => {

    const { title, createdAt, description, images, _id } = props.article;
    console.log(props)
    return (
        <div className="article-card">
            {/* <input type="checkbox" checked={checked}
                onChange={() => props.handleCheck(_id)} /> */}
            <img className='article-img' src={images.url} alt={title} />
            <div className='article-content'>
                <div style={{ padding: '1rem' }}>

                    <Link to={`/blog/${_id}`} className='article-card-header'
                    // onClick={() => this.handleCount()}
                    >
                        <h2 className='article-card-header' >{title}</h2>
                    </Link>
                    <p><span>1 &nbsp;<VisibilityIcon /> &nbsp;</span>{createdAt}</p>
                    <p className="work-content">{description}</p>
                    <br />
                    {/* <div>{ReactHtmlParser(sanitizedHtml)}</div> */}

                </div>
                <BtnRender article={props.article} deleteArticle={props.deleteArticle} />

            </div>
        </div>
    )
}

export default ArticleItem;