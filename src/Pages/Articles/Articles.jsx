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
import { auth, login, logout } from '../../services/firebase';



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
        return (
            <div>
                <NavBar2 />
                {/* <div className='login'>{
                    authenticated
                        ? <span onClick={logout}>Logout</span>
                        : <span onClick={login}>Login</span>
                }</div> */}
                <div id="articles">
                    <h3>My Articles<hr /></h3>
                    <p>Here are some of my articles, you may like.</p>
                    <div class="work-box">
                        <div class="work">

                            {/* <!--───────────────card───────────────--> */}

                            <div class="card">
                                <h2>TITLE HEADING<hr /></h2>
                                <a href="" target="_blank">
                                    {/* <!--Link to project--> */}
                                    <div class="work-content">Lorem ipsum dolor sit amet consectetur.</div></a>
                                <button>Like</button>
                            </div>
                            <div class="card">
                                <h2>TITLE HEADING<hr /></h2>
                                <a href="" target="_blank">
                                    {/* <!--Link to project--> */}
                                    <div class="work-content">Lorem ipsum dolor sit amet consectetur.</div></a>
                                <button>Like</button>
                            </div>
                            <div class="card">
                                <h2>About Me<hr /></h2>
                                <a href="" target="_blank">
                                    {/* <!--Link to project--> */}
                                    <div class="work-content">Lorem ipsum dolor sit amet consectetur.</div></a>
                                <button>Like</button>
                            </div>
                            <div class="card">
                                <h2>Popular Post<hr /></h2>
                                <a href="" target="_blank">
                                    {/* <!--Link to project--> */}
                                    <div class="work-img">Image</div><br /></a>
                                <a href="" target="_blank">
                                    {/* <!--Link to project--> */}
                                    <div class="work-img">Image</div><br /></a>
                                <a href="" target="_blank">
                                    {/* <!--Link to project--> */}
                                    <div class="work-img">Image</div></a>
                            </div>

                        </div>
                    </div>
                </div>

            </div>
        )

    }
}

export default Articles;