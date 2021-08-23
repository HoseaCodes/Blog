import React, {useContext} from 'react';
import { Link } from 'react-router-dom';
import './Articles.css'
import BtnRender from './BtnRender';
// import ReactHtmlParser from 'react-html-parser';
import VisibilityIcon from '@material-ui/icons/Visibility';
import moment from 'moment-timezone'
import { GlobalState } from '../../GlobalState';


        // <Route path="/" exact component={Products} />
        // <Route path="/detail/:id" exact component={DetailProduct} />
        // <Route path="/login" exact component={isLoggedIn ? NotFound : Login} />
        // <Route path="/register" exact component={isLoggedIn ? NotFound : Register} />
        // <Route path="/category" exact component={isAdmin ? Category : NotFound} />
        // <Route path="/create_product" exact component={isAdmin ? Create : NotFound} />
        // <Route path="/edit_product" exact component={isAdmin ? Create : NotFound} />
        // <Route path="/history" exact component={isLoggedIn ? OrderHistory : NotFound} />
        // <Route path="/history/:id" exact component={isLoggedIn ? OrderDetails : NotFound} />
// Main Article Cards
const ArticleItem = (props) => {
    const state = useContext(GlobalState);
    const [isLoggedIn] = state.userAPI.isLoggedIn
    const [isAdmin] = state.userAPI.isAdmin

    const { title, createdAt, description, images, _id } = props.article;

    const timeFormater = moment.utc(createdAt).format('MM/DD/YYYY')
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
                    <p><span>1 &nbsp;<VisibilityIcon /> &nbsp;</span>{timeFormater}</p>
                    <p className="work-content">{description}</p>
                    <br />
                    {/* <div>{ReactHtmlParser(sanitizedHtml)}</div> */}

                </div>
                {isAdmin && isLoggedIn ?
                    <BtnRender article={props.article} deleteArticle={props.deleteArticle} /> :
                    null
                }

            </div>
        </div>
    )
}

export default ArticleItem;