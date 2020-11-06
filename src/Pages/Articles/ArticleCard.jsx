import React, { Component } from 'react';
import './Articles.css'


class Article extends Component {
    state = {
        showInfo: false,
    }
    handleInfo = () => {
        this.setState({
            showInfo: !this.state.showInfo
        })
    }
    render() {
        const { name, info, img, tags, link } = this.props.article;
        return (
            <div className="article-card">
                <img className='article-img' src={img} alt={name} width='200px' />
                <div className='article-content'>
                    <h2 className='article-card-header' >{name}</h2>
                    <ul className="main-tag-container">
                        <li>
                            {tags.map(tag => {
                                return (<a href="#" className="main-tag">{tag}</a>
                                )
                            })}
                        </li>
                    </ul>
                    <h5>info {''}
                        <span onClick={this.handleInfo}>
                            <i className="fas fa-caret-square-down"></i>
                        </span>
                    </h5>
                    <br />
                    {this.state.showInfo && <p className="work-content">{info}</p>}
                    <a className='article-btn-info' href={link}>Find Out More</a>
                    <br />
                </div>
            </div>
        )
    }
}

export default Article;