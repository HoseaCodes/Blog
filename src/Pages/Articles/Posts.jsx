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

import React, { useState } from 'react';
import './Articles.css'
import NavBar2 from '../../Components/NavBar/NavBar2';
import Subscribe from '../../Components/Subscribe/Subscribe'
import ArticleCard from './ArticleCard';
import SearchBar from '../../Components/Search/Search';
import Stackimg from '../../icons/stack-operations.png'



const Posts = () => {
    const articleData = [
        {
            id: 1,
            name: 'Data Structure: Stack',
            img: Stackimg,
            info: 'Description',
            tags: ['Data Structures', 'Test'],
            link: './stack',

        },
        {
            id: 2,
            name: 'The Art of Picking a Project',
            img: Stackimg,
            info: '>Below is a list of projects ideas for new programers',
            tags: ['Software Engineer'],
            link: './Stack',
        },
        {
            id: 3,
            name: 'Web vs Client Servers',
            img: Stackimg,
            info: 'A quick breakdown of web and client servers',
            tags: ['Software Engineer'],
            link: '#',
        },
        {
            id: 4,
            name: 'You Down with OOP?',
            img: Stackimg,
            info: 'A brief overview of object oriented programming',
            tags: ['Software Engineer'],
            link: '#',
        },
    ]
    const { articles } = articleData;
    const { search } = window.location;
    const query = new URLSearchParams(search).get('s');
    const [searchQuery, setSearchQuery] = useState(query || '');
    const filterArticles = (articles, query) => {
        if (!query) {
            return articles;
        }
        return articles.filter((article) => {
            const articleName = article.name.toLowerCase();
            return articleName.includes(query);
        });
    }
    const filteredArticles = filterArticles(articles, query);

    return (
        <div className='article-container'>
            <NavBar2 />
            <SearchBar
                onChange={setSearchQuery}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
            />
            <div className='article-header'>
                <div className='artcile-header-logo'>
                </div>
            </div>
            <hr style={{ background: 'rgb(235,183,65)', width: '100%' }} />
            <div id="articles">
                <h2 className='articles-header'>Thoughts of a Wise Mind<hr /></h2>
                <p style={{ color: 'white', fontSize: '1.5rem' }}>Here are some of my articles, you may like.</p>
                <div className="work-box">
                    <div className="work">
                        {/* <!--───────────────card───────────────--> */}
                        <section className='articleList'>
                            {filteredArticles.map(article => {
                                return (
                                    <ArticleCard article={article} />
                                )
                            })}
                        </section>
                        <div className="article-card popular">
                            <h3 className='article-card-header'>Popular Post<hr /></h3>
                            <a href="" target="_blank">
                                <div className="work-img">How the Internet Works</div><br /></a>
                            <a href="" target="_blank">
                                <div className="work-img">Techinal Interview Help</div><br /></a>
                            <a href="" target="_blank">
                                <div className="work-img">Portfolio Guide</div></a>
                        </div>
                        <Subscribe />
                    </div>

                </div>
            </div>
        </div>

    )

}


export default Posts;
