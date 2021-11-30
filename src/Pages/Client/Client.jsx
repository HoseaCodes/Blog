import React from "react";
import SocialRing from "../../Components/Clients/SocialRing";
import './Client.css';
import bootstrap from '../../Assets/Images/Bootstrap-min.png';

const Client = () => {
    return (<>
        <div className='client-header'>
            <div className='client-logo' id='client-logo'>
                <h1 className='heading-client'>

                </h1>
            </div>
        </div>
        <hr className="header-hr" />
        <div className="presentation pt-5">
            <div className="section section-gray-gradient section-description">
                <div className="container">
                    <div className="row">
                        <div className="col-md-10 col-md-offset-2" style={{ textAlign: 'center' }}>
                            <h1 className="header-text ">Designed and developed for your business
                            <h1>
                                    <br />
                                    <small style={{
                                        textTransform: 'capitalize',
                                        fontSize: '80%'
                                    }}>Created to fit perfectly together</small> </h1>
                            </h1>

                            <p className="text-center client-info">My team and I uses the latest techonology for small and mid size
                            businesses. Intergarting the latest API's, analytics, security measures, and design
                            processes.
                            We provide you with the tools needed to be competitive on a large scale.</p>

                            <div className="space-110"></div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
        <SocialRing />
        <div className="section section-images section-cards">
            <div className="container">
                <div className="row">
                    <div className="col-md-4">
                        <div className="text-center">
                            <div className="image">

                                <img src={bootstrap} alt="" />

                                <div className="image-info">
                                    <h3>3.3.0</h3>
                                    <h5>Version</h5>
                                </div>
                            </div>
                            <h2 className="header-text">Built with Bootstrap</h2>
                            <p className="client-info-group">Bootstrap (currently v3.3.0), is the most popular HTML, CSS, and JS framework for
                            developing responsive, mobile first projects on the web. To see their full
                                documentation, you can check it out at their <a
                                    href="https://getbootstrap.com">page</a>.</p>

                        </div>
                    </div>
                    <div className="col-md-4 card-text-adjust">
                        <div className="text-center">
                            <div className="image">
                                <img src={"https://i.imgur.com/NpD8OUs.jpg"} alt="icons" />
                                <div className="image-info">
                                    <h3>170</h3>
                                    <h5>Thin Icons</h5>
                                </div>
                            </div>
                            <h2 className="header-text">Pixel Perfect Icons</h2>
                            <p className="client-info-group">Thanks to our friend from <a href="https://www.pixeden.com">Pixeden</a>, they made a
                                really great job with the stroke icons. You will love the icons from the moment you see
                                them integrated in all our items. There are more than 150+ icons.</p>

                        </div>
                    </div>
                    <div className="col-md-4 ">
                        <div className="text-center">
                            <div className="image">
                                <img src={"https://i.imgur.com/HknO2Av.jpg"} alt="docs"/>
                                <div className="image-info">
                                    <h3>50+</h3>
                                    <h5>Examples</h5>
                                </div>
                            </div>
                            <h2 className="header-text">Well documented</h2>
                            <p className="client-info-group">Every item from Get Shit Done is well documented and contain an example of how to use
                                it. You will also get a quick guide to setting up and getting started.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div className="socialring section-responsive section-cards">
            <div className="container">
                <div className="row">
                    <div className="col-md-5 col-md-offset-1">
                        <div className="space-50"></div>
                        <h2 className="header-text">Fully Responsive Layout</h2>
                        <p className="client-info">Building responsive website is a must nowadays, so all the elements are fully responsive.
                        Each item looks great on the whole range of devices, and more than this, it was thought
                        mobile first. From cards to typography or menus, all elements were designed for a mobile
                            web, so they are accesible to anyone.</p>
                        <legend></legend>
                        <div className="row">
                            <div className="col-md-7">
                                <h6><i className="fa fa-th-list"></i> Built with Bootstrap (3.3.0)</h6>
                                <h6><i className="fa fa-eye"></i> Retina Ready</h6>
                            </div>
                            <div className="col-md-5">
                                <h6><i className="fa fa-align-justify"></i> Customizable Menu</h6>
                                <h6><i className="fa fa-magic"></i> Smooth Animations</h6>
                            </div>
                        </div>
                    </div>

                    <div className="col-md-4 col-md-offset-1">
                        <div className="responsive-image">
                            <img alt="" src="https://i.imgur.com/VAcp7Js.png" height="500px" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div className="section pb-5 section-gray-gradient section-cards">
            <div className="container">
                <div className="row">
                <div className="col-md-6">
                    <div className="newcard-container">
                        <div className="card">
                            <h2 className="card__title">Code</h2>
                        </div>
                        <div className="card">
                            <h2 className="card__title">Design</h2>
                        </div>
                        <div className="card">
                            <h2 className="card__title">Idea</h2>
                        </div>
                    </div>
                </div>
                    <div className="col-md-6">
                        <div className="space-50"></div>
                        <h2 className="header-text">Personlized Components<br /><small>Object Oriented Programming Approach </small></h2>
                        <p className="client-info">Telsa, Google, Apple, Microsoft, Uber, and AirBnB are setting the ground works to good
                        design and functionality. We will lay the foundation to building your future. We build
                        responsive applications that are specialized for all devices.
                        </p>
                        <p className="client-info"> Tell us about about your business and we will provide a digital business approach to
                        enhance your users experience and overall profitiability. With software being beautiful on
                        the inside is nice but the outside is just as important if not more so. Join the community
                        and upgrade your business today!
                            <br /><br />
                        </p>

                    </div>

                </div>
            </div>
        </div>

        <hr className="header-hr"/>
    </>
    )
}


export default Client;
