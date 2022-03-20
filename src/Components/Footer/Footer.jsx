import React from 'react';
import "./Footer.css";
import {StyledHr} from '../../Layout/Hr/styledHr';

import SocialMediaTags from '../SocialMediaTags/SocialMediaTags';

const Footer = () => {

    const year = new Date().getFullYear()

    return (
      <>
        <StyledHr Primary/>
        <footer className="footer">
            <div className="container bottom_border">
                <div className="row">
                    <div className=" col-sm-4 col-md col-12 col">
                        <h5 className="footer_h5 col_white_amrc pt2">Find Me</h5>
                        <p className="mb10">HoseaCodes’ mission statement is to build the future while empowering every person and every organization on the planet to achieve more. </p>
                        <p><i className="fa fa-location-arrow"></i> Houston, TX </p>
                        <p><i className="fa fa-phone"></i>  +1-281-780-8424</p>
                        <p><i className="fa fa fa-envelope"></i> <a href="mailto:mr.dhosea@gmail.com"> mr.dhosea@gmail.com </a> </p>
                    </div>
                    <div className=" col-sm-4 col-md  col-6 col dompl">
                        <h5 className="footer_h5 col_white_amrc pt2">Built With</h5>
                        <ul className="footer_ul_amrc" >
                            <li> <a href="https://reactjs.org/docs/getting-started.html">React.js</a></li>
                            <li> <a href="https://nodejs.org/en/docs/guides/getting-started-guide/">Node.js</a></li>
                            <li><a href="https://material-ui.com/">Material UI</a></li>
                            <li><a href="https://react-bootstrap.github.io/">Bootstrap</a></li>
                            <li><a href="https://sass-lang.com/">SCSS</a></li>
                            <li><a href="https://styled-components.com/">Styled Components</a></li>
                        </ul>
                    </div>
                    <div className=" col-sm-4 col-md  col-6 col">
                        <h5 className="footer_h5 col_white_amrc pt2">Quick links</h5>
                        <ul className="footer_ul_amrc">
                            <li><a href="https://www.remove.bg/upload">Remove Background</a></li>
                            <li><a href="/client">Client Details</a></li>
                            <li><a href="/project">Project Details</a></li>
                            <li><a href="/shop">Hoseacodes Shop</a></li>
                            <li><a href="http://webenlance.com">Image Cropping</a></li>
                        </ul>
                    </div>
                    <div className=" col-sm-4 col-md col-12 col twitter-footer">
                        <h5 className="footer_h5 col_white_amrc pt2">Follow Me On</h5>
                        {/* Twitter Profile Tweets */}
                        <ul className="footer_ul2_amrc">
                            <li><a href="/"><i className="fab fa-twitter fleft padding-right"></i> </a><p>Day 56 #100DaysOfCode I added a markdown preview...<a href="https://twitter.com/DominiqueRHosea/status/1382724497954930693">twitter.com/status/Day56</a></p></li>
                            <li><a href="/"><i className="fab fa-twitter fleft padding-right"></i> </a><p>Day 55 #100DaysOfCode I revisted solidity smart ...<a href="https://twitter.com/DominiqueRHosea/status/1382215669115080705">twitter.com/status/Day55</a></p></li>
                            <li><a href="/"><i className="fab fa-twitter fleft padding-right"></i> </a><p>Received my work laptop. I’m so excited!...<a href="https://twitter.com/DominiqueRHosea/status/1381995531375890437">twitter.com/status/startjob</a></p></li>
                        </ul>
                    </div>
                </div>
            </div>
            <div className="container col-md ">
                <ul className="foote_bottom_ul_amrc">
                    <li><a href="/">Home</a></li>
                    <li><a href="/about">About</a></li>
                    <li><a href="/blog">Blog</a></li>
                    <li><a href="/contact">Contact</a></li>
                </ul>
                {/* <!--foote_bottom_ul_amrc ends here--> */}
                <p className="text-center">All Rights Reserved, &copy; {year} Hosea Codes</p>
                <SocialMediaTags />
            </div>
        </footer>
      </>
    )
};

export default Footer;
