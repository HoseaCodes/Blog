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

import React from 'react';
import './Articles.css'
import NavBar2 from '../../Components/NavBar/NavBar2';
import Subscribe from '../../Components/Subscribe/Subscribe'
import { auth, login, logout } from '../../services/firebase';


const e = React.createElement;

class LikeButton extends React.Component {
    constructor(props) {
        super(props);
        this.state = { liked: false };
    }

    render() {
        if (this.state.liked) {
            return 'You liked this.';
        }

        return e(
            'button',
            { onClick: () => this.setState({ liked: true }) },
            'Like'
        );
    }
}


class Articles extends React.Component {
    componentDidMount() {
        auth.onAuthStateChanged(user => (
            user
            // ? this.setState({ user, authenticated: true })
            // : this.setState({ user: null, authenticated: false })
        ));
    }
    render() {
        // const {
        //     authenticated
        // } = this.state
        const articles = ['The Art of Picking a Project', 'Web vs Client Servers', 'You Down with OOP?']
        const aInfo = ['Below is a list of projects ideas for new programers', 'A quick breakdown of web and client servers', 'A brief overview of object oriented programming']
        const aInfoFormatted = aInfo.map((info) => <a href="" target="_blank">
            {/* Link to Project */}
            <div className="work-content" key={info}>{info}</div></a>
        )
        const articlesFormatted = articles.map((article) => <div className="article-card">
            <h2 className='article-card-header' key={article}>{article}<hr /></h2>
            {aInfoFormatted}
            <LikeButton className='link' />
        </div>)
        return (
            <div className='article-container'>
                <NavBar2 />
                <div className='article-header'>
                    <div className='artcile-header-logo'>
                    </div>
                </div>
                {/* <div className='login'>{
                    authenticated
                        ? <span onClick={logout}>Logout</span>
                        : <span onClick={login}>Login</span>
                }</div> */}
                <div id="articles">
                    <h3 className='articles-header'>Thoughts of a Wise Mind<hr /></h3>
                    <p>Here are some of my articles, you may like.</p>
                    <div className="work-box">
                        <div className="work">

                            {/* <!--───────────────card───────────────--> */}

                            <div>
                                {articlesFormatted}
                            </div>

                            <div className="article-card">
                                <h2 className='article-card-header'>Popular Post<hr /></h2>
                                <a href="" target="_blank">
                                    {/* <!--Link to project--> */}
                                    <div className="work-img">How the Internet Works</div><br /></a>
                                <a href="" target="_blank">
                                    {/* <!--Link to project--> */}
                                    <div className="work-img">Techinal Interview Help</div><br /></a>
                                <a href="" target="_blank">
                                    {/* <!--Link to project--> */}
                                    <div className="work-img">Portfolio Guide</div></a>
                            </div>
                            <Subscribe />
                        </div>
                    </div>
                </div>

            </div>
        )

    }
}

export default Articles;