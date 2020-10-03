import React from 'react';
import { Link } from "react-router-dom";
import '../Technologies/Technologies.css';


const Technologies = () => {
    return (
        <section>
            <div className="services-grid">
                <div className="service service1">
                    <h4 className='service-title'>Library</h4>
                    <li className="skills"><span>REACT</span></li>
                    <li className="skills"><span>JQUERY</span></li>
                    <li className="skills"><span>JAVASCRIPT</span></li>
                    <Link to="/projects" className="cta">Read More</Link>
                </div>
                <div className="service service1">
                    <h4 className='service-title'>FrontEnd</h4>
                    <li className="skills"><span>MATERIL UI</span></li>
                    <li className="skills"><span>MATERIALIZE</span></li>
                    <li className="skills"><span>BOOTSTRAP</span></li>
                    <Link to="/projects" className="cta">Read More</Link>
                </div>
                <div className="service service1">
                    <h4 className='service-title'>Computer Science</h4>
                    <li className="skills"><span>DATA STUCTURES</span></li>
                    <li className="skills"><span>ALGORITHMS</span></li>
                    <Link to="/projects" className="cta">Read More</Link>
                </div>

                <div className="service service1">
                    <i className="ti-light-bulb"></i>
                    <h4 className='service-title'>BackEnd</h4>
                    <li className="skills"><span>NODE.JS</span></li>
                    <li className="skills"><span>PYTHON</span></li>
                    <li className="skills"><span>DJANGO</span></li>
                    <Link to="/projects" className="cta">Read More</Link>
                </div>

                <div className="service service1">
                    <i className="ti-money"></i>
                    <h4 className='service-title'>Databases</h4>
                    <li className="skills"><span>POSTGRESQL</span></li>
                    <li className="skills"><span>MONGODB</span></li>
                    <Link to="/projects" className="cta">Read More</Link>
                </div>
            </div>
        </section>
    )
}
export default Technologies;