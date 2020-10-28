import React, { Component } from 'react';
import './Articles.css'
import LikeButton from './LikeButton';


class Article extends Component {
    state = {
        showInfo: false
    }
    handleInfo = () => {
        this.setState({
            showInfo: !this.state.showInfo
        })
    }
    render() {
        const { name, info } = this.props.article;
        return (
            <div className="article-card">
                <h2 className='article-card-header' >{name}</h2>
                <h5>info {''}
                    <span onClick={this.handleInfo}>
                        <i className="fas fa-caret-square-down"></i>
                    </span>
                </h5>
                {this.state.showInfo && <p className="work-content">{info}</p>}
                <LikeButton className='link' />

            </div>
        )
    }
}

export default Article;