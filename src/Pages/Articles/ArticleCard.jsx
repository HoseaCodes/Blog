import React, {useContext} from 'react';
import { Link } from 'react-router-dom';
import './Articles.css'
import BtnRender from './BtnRender';
// import VisibilityIcon from '@material-ui/icons/Visibility';
import moment from 'moment-timezone'
import { GlobalState } from '../../GlobalState';

const ArticleItem = (props) => {
    const state = useContext(GlobalState);
    const [isLoggedIn] = state.userAPI.isLoggedIn
    const [isAdmin] = state.userAPI.isAdmin

    const { title, createdAt, description, images, _id, archived } = props.article;

    const timeFormater = moment.utc(createdAt).format('MM/DD/YYYY')

    return (
      <>
        <div className="article-card">
            {/* <input type="checkbox" checked={checked}
                onChange={() => props.handleCheck(_id)} /> */}
            <img className='article-img' src={images.url} alt={title} />
            <div className='article-content'>
                <div style={{ padding: '1rem' }}>
                {isAdmin && isLoggedIn ?

                    <input type="checkbox" name="archive" onClick={() => props.archiveArticle(_id, archived)}/> :
                    null
                  }
                    <Link to={`/blog/${_id}`} className='article-card-header'
                    // onClick={() => this.handleCount()}
                    >
                        <h2 className='article-card-header' >{title}</h2>
                    </Link>
                    {/* <p className="article-card-meta"><span>1 &nbsp;<VisibilityIcon /> &nbsp;</span>{timeFormater}</p> */}
                    <p className="work-content">{props.truncate(description)}</p>
                    <br />
                </div>
                {isAdmin && isLoggedIn ?
                    <BtnRender article={props.article} deleteArticle={props.deleteArticle} /> :
                    null
                }

            </div>
        </div>
        <hr className='article-line' />
        </>
    )
}

export default ArticleItem;
