import React, { Component } from 'react';
import './Articles.css'
import VisibilityIcon from '@material-ui/icons/Visibility';


class ArticleSinglePost extends Component {
    constructor(props) {
        super(props);
        this.state = {
            count: 0
        }
    }


    render() {
        function handleCount() {
            this.state({
                count: this.state.count + 1
            });
        }
        const { name, date, info, img, tags, link } = this.props.article;
        return (
            <div className="article-card">
                <img className='article-img' src={img} alt={name} width='200px' />
                <div className='article-content'>
                    <a className='article-card-header' href={link} onClick={() => this.handleCount()} >
                        <h2 className='article-card-header' >{name}</h2>
                    </a>
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
        )
    }
}

export default ArticleSinglePost;