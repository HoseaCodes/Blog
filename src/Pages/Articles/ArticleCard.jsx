import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './Articles.css'
import VisibilityIcon from '@material-ui/icons/Visibility';


class Article extends Component {
    constructor(props) {
        super(props);
        this.state = {
            count: 0
        }
    }


    render() {
        const { name, date, info, img, tags, link } = this.props.article;
        return (
            <div className="article-card">
                <img className='article-img' src={img} alt={name} />
                <div className='article-content'>
                    <div style={{ padding: '1rem' }}>

                        <Link to={link} className='article-card-header'
                        // onClick={() => this.handleCount()}
                        >
                            <h2 className='article-card-header' >{name}</h2>
                        </Link>
                        <p><span>{this.state.count} &nbsp;<VisibilityIcon /> &nbsp;</span>{date}</p>
                        <p className="work-content">{info}</p>
                        <br />
                        <ul className="main-tag-container-article">
                            <li className="main-category">
                                <h3>Category: &nbsp;</h3>
                                {tags.map(tag => {
                                    return (<a href="#" className="main-tag-article">{tag}</a>
                                    )
                                })}
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        )
    }
}

export default Article;