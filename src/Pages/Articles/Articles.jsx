//Your professional website should showcase your thought leadership. 
//Update your audience on the work that you are doing, beyond the 
//showcased projects in your portfolio section. It is particularly 
//important to update your audience about your recent activities if 
//you are actively seeking work. This will show that you are intellectually 
//curious, current, active, and working to continuously build and hone your 
//skills. Show your audience what you are planning, thinking about, looking 
//forward to, and how you are using your skills and staying current. 
//Share insights gained from side projects that you are working on or a 
//new program that you recently learned. If you’ve been part of a design 
//challenge or hackathon, let your audience know.

//There are many ways to showcase your thought leadership on 
//your website. You can include a blog platform like WordPress, 
//or add a blog section within your website. You can also 
//embed other sites like Medium, that are used to showcase 
//thoughts and ideas, or link to your Github profile. Twitter is 
//also often used by professionals across industries to showcase 
//their thought leadership. Although Tweets are limited by 240 
//characters, you can include links to longer writing that you’ve 
//authored on LinkedIn, Medium, WordPress, or elsewhere. If you 
//currently use LinkedIn, or another platform, to showcase your 
//thought leadership, but feel the content of your posts and 
//articles are not sufficiently highlighted when you embed 
//LinkedIn in your profile, you can copy and post the content to 
//the blog section of your website. You don’t have to create new 
//thought leadership content just for your website. Choose the 
//format that best meets your needs and that you are the most 
//comfortable with, and include that platform in your website.
//Your thought leadership posts and updates don’t have to be 
//extensive, but they should be authentic and thoughtful. 
//Consider including images and video of any artifacts of 
//projects through different planning stages, like sketches, 
//Post-Its, wireframes, and the final product, to illustrate your 
//process and work for your audience. You should also commit to 
//updating whichever platform that you choose regularly. One 
//rule of thumb is to post at least twice a month.

import React, { Component } from 'react';
import './Articles.css'
import NavBar2 from '../../Components/NavBar/NavBar2';
import Subscribe from '../../Components/Subscribe/Subscribe'
import { articleData, categoryTags } from './ArticleData';
import ArticleCard from './ArticleCard';
import Pagination from 'react-bootstrap/Pagination'
import { auth, login, logout } from '../../services/firebase';





class Articles extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            search: "",
            articles: articleData,
            tags: categoryTags,
            currentPage: 1,
            postPerPage: 5
        }

    }
    componentDidMount() {
        auth.onAuthStateChanged(user => (
            user
        ));
    }

    updateSearch = event => {
        this.setState({ search: event.target.value.substr(0, 20) })
    }
    render() {
        const { filter, articles, tags, currentPage, postPerPage } = this.state;
        const indexOfLastPost = currentPage * postPerPage;
        const indexOfFirstPost = indexOfLastPost - postPerPage;
        const currentPosts = articles.slice(indexOfFirstPost, indexOfLastPost);
        const filteredArticles = articles.filter(
            (article) => {
                return article.name.toLowerCase().indexOf(
                    this.state.search.toLowerCase()) !== -1;
            }
        );
        return (
            <div className='article-container'>
                <NavBar2 />
                <div className='article-header'>
                    <div className='artcile-header-logo'>
                    </div>
                </div>
                <hr style={{ background: 'rgb(235,183,65)', width: '100%' }} />
                <div id="articles">
                    <h3 className='articles-header'>Thoughts of a Wise Mind<hr /></h3>
                    <p style={{ color: 'white', fontSize: '1.5rem' }}>Here are some of my articles you may like.</p>
                    <input type="text"
                        className='article-search'
                        label="Search Articles"
                        placeholder="Find a Post"
                        value={this.state.search}
                        onChange={this.updateSearch.bind(this)}
                    />
                    {/* <!--───────────────card───────────────--> */}
                    <div className="article-box">
                        <section className='articleList'>
                            {filteredArticles.map(article => {
                                return (<>
                                    <ArticleCard article={article}
                                        key={article.id}
                                    />
                                    <hr className='article-line' />
                                </>
                                )
                            })}
                        </section>
                        <section className='article-sidebar'>
                            <div className="popular">
                                <h2 className='article-card-header'>Popular Post<hr /></h2>
                                <section className='popular-articles'>
                                    <a href="" target="_blank">
                                        <div className="popular-link">How the Internet Works</div><br /></a>
                                    <a href="" target="_blank">
                                        <div className="work-img">Techinal Interview Help</div><br /></a>
                                    <a href="" target="_blank">
                                        <div className="work-img">Portfolio Guide</div></a>
                                </section>
                            </div>
                            <br />
                            <Subscribe />
                        </section>
                    </div>
                </div>
                {/* <Pagination className='justify-content-center'>
                    <Pagination.First />
                    <Pagination.Prev disabled />
                    <Pagination.Item active>{1}</Pagination.Item>
                    <Pagination.Item >{2}</Pagination.Item>
                    <Pagination.Item >{3}</Pagination.Item>
                    <Pagination.Ellipsis />
                    <Pagination.Item>{6}</Pagination.Item>
                    <Pagination.Next />
                    <Pagination.Last />
                </Pagination> */}
                <br />
                <article className='article-category-container'>
                    <h2>Categories</h2>
                    <section className='article-categories'>
                        {tags.map(tag => {
                            return (<li className='tag-category'>{tag} </li>
                            )
                        })}
                    </section>
                </article>
            </div>

        )

    }
}

export default Articles;