import React from "react";
import './SocialRing.css';

const SocialRing = () => {
    return (
        <>
            <div className="socialring section-presentation section-cards">
                <div className="container">
                    <div className="row socailring-row">
                        <div className="col-md-6">
                            <div className="description">
                                <h4 className="header-text">Social Ring</h4>
                                <p>Social Ring is an IOS app that lets you create custom rings for your profile pictures on Clubhouse, Instagram, or your favorite social media platform.</p>
                                <p className="sr-info">Create profile pictures with a variety of custom-made borders. Choose from over 50 borders.</p>
                                <a href="https://apps.apple.com/us/app/social-ring/id1551446005" target="_blank" rel="noopener noreferrer" className="button highlight"><i className="fa fa-apple fa-lg"></i>Get The App</a>
                            </div>
                        </div>
                        <div className="col-md-5 col-md-offset-1 hidden-xs">
                            <img alt="" src="https://i.imgur.com/i8bkYCv.png" />
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}


export default SocialRing;