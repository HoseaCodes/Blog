import React from 'react';
import { Link } from "react-router-dom";
import '../Technologies/Technologies.css';

const react = 'React'
const jQuery = 'Jquery'
const js = 'JavaScript'
const readMe = 'Read Me'
const library = 'Library'
const fEnd = 'FrontEnd'
const materialUI = 'Material UI'
const materialize = 'Materialize'
const bootstrap = 'Bootstrap'
const cs = 'Computer Science'
const structure = 'Data Structure'
const algorithms = 'Algorithms'
const db = 'Database'
const mongo = 'MongoDB'
const postgres = 'PostgreSQL'
const django = 'Django'
const python = 'Python'
const node = 'Node.JS'
const bEnd = 'Backend'

const Technologies = () => {
    return (
        <section>
            <div className="services-grid">
                <div className="service service1">
                    <h4 className='service-title'>{library}</h4>
                    <li className="skills"><span>{react}</span></li>
                    <li className="skills"><span>{jQuery}</span></li>
                    <li className="skills"><span>{js}</span></li>
                    <Link to="/projects" className="cta">{readMe}</Link>
                </div>
                <div className="service service1">
                    <h4 className='service-title'>{fEnd}</h4>
                    <li className="skills"><span>{materialUI}</span></li>
                    <li className="skills"><span>{materialize}</span></li>
                    <li className="skills"><span>{bootstrap}</span></li>
                    <Link to="/projects" className="cta">{readMe}</Link>
                </div>
                <div className="service service1">
                    <h4 className='service-title'>{cs}</h4>
                    <li className="skills"><span>{structure}</span></li>
                    <li className="skills"><span>{algorithms}</span></li>
                    <Link to="/projects" className="cta">{readMe}</Link>
                </div>

                <div className="service service1">
                    <i className="ti-light-bulb"></i>
                    <h4 className='service-title'>{bEnd}</h4>
                    <li className="skills"><span>{node}</span></li>
                    <li className="skills"><span>{python}</span></li>
                    <li className="skills"><span>{django}</span></li>
                    <Link to="/projects" className="cta">{readMe}</Link>
                </div>

                <div className="service service1">
                    <i className="ti-money"></i>
                    <h4 className='service-title'>{db}</h4>
                    <li className="skills"><span>{postgres}</span></li>
                    <li className="skills"><span>{mongo}</span></li>
                    <Link to="/projects" className="cta">{readMe}</Link>
                </div>
            </div>
        </section>
    )
}
export default Technologies;