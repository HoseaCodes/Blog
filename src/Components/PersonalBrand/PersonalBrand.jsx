import React from 'react';
import './PersonalBrand.css'
import Resume2020 from '../../Assets/Files/Resume2020.pdf'
import Modal from 'react-bootstrap/Modal'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import { BsEnvelope, BsEnvelopeOpen } from "react-icons/bs";

const PersonalBrand = () => {
    const nique = 'https://d2nrcsymqn25pk.cloudfront.net/Assets/Images/nique-min.jpg'
    const dom = 'https://d2nrcsymqn25pk.cloudfront.net/Assets/Images/hosea3.png'
    const [modalShow, setModalShow] = React.useState(false);

    function handleClick(e) {
        e.preventDefault();
        window.location.href = '/about';
    }

    function handleDownload(e) {
        e.preventDefault();
        window.location.href = Resume2020;
    }

    const onHide = () => {
        setModalShow(false)
    }

    return (<>

        <div className='personal-container'>
            {/* <Cards />
            <Resume /> */}
            <div className='personalBrand-opener'>

                <h2 className='name-title'>Dominique Hosea</h2>
                <p className='bio-info'>A full-stack &nbsp;
                <span className="personalBrand-p" style={{
                        color: 'white', textShadow: '2px 2px 2px black',
                        textDecoration: 'underline', textDecorationStyle: 'dashed',
                        textDecorationColor: 'rgb(235,183,65)'
                    }}>
                        Software Engineer </span>
                        driven by a passion for knowledge. I am focused on building software that
                        improves user engagement and experience through &nbsp;
                <span style={{
                        color: 'white', textShadow: '2px 2px 2px black',
                        textDecoration: 'underline', textDecorationStyle: 'dashed',
                        textDecorationColor: 'rgb(235,183,65)'

                    }}>
                        developing fast solutions </span>
                        to complex problems that allow users to excel.
            </p>
                <hr id='aboutme' style={{ background: 'white', margin: '50px', width: '80vw' }} />
            </div>
            <Modal
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
                keyboard="true"
                show={modalShow}
                onHide={() => setModalShow(false)}

            >
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter" className="show-grid">
                        <Row>
                            <Col md={2}>
                                <img className='personal-image2' src={dom} alt="Dominique Hosea" />
                            </Col>
                            <Col className="align-self-center" md={10}>
                                <h3 className='personal-card-title' >Software Developer.Engineer</h3>
                            </Col>
                        </Row>
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <img className='personal-image2' src={nique} alt="Dominique Hosea" />
                    <hr style={{ background: '#204740', width: '100%' }} />
                    <br />
                    <p className='personal-card-content'> In my previous Operations Manager role, I identified
                    underlying problems, analyzing potential solutions, and implementing
                    resolutions. My attention to detail and love for technology lead me to seek a
                    deep understanding of Management of Information Systems. In my graduate program,
                    I received a sound understanding of the relational database, SQL, C#/C++, and
                        business processes.</p>
                    <br />
                    <p className='personal-card-content'>I enrolled in an immersive full-stack software
                    engineering program, where I was exposed to the MERN stack and turned my MIS
                    knowledge into applicable, real-world solutions. I developed several full-stack web
                    apps and worked on dynamic team projects. The projects allowed me to hone my skills
                    in front-end development, client-servers and routing, Node.js, Express.js, MongoDB,
                    OAuth, SPA Architecture, React, Python, JavaScript, and Django web framework.
                    Each new language not only broadened my coding knowledge but made me more excited to
                    learn more while also finding ways to integrate my experiences and new-found
                        knowledge to enhance user experience.</p>
                    <br />
                    <p className='personal-card-content'> I’m looking to move into a role where I can grow with motivated people
                    that believe in growth and innovation. I have worked progressively with major
                    companies since the beginning of my career and I am excited for the opportunity
                            to continue this journey with another industry leader.</p>
                </Modal.Body>
                <Modal.Footer>
                    <button onClick={handleClick} className='personal-btn'>More about Dominique</button>
                    <button onClick={handleDownload} className='personal-btn'>Download my Resume</button>
                    <button onClick={onHide} className='personal-btn'>Close</button>
                </Modal.Footer>
            </Modal>
            <div className='personal-card2'
                data-aos="fade-left"
                data-aos-offset="500"
                data-aos-duration="3000"
                data-aos-easing="ease-in"
            >
                <div className="envelop-group">
                    <BsEnvelope className={modalShow ? "envelop" : "closed-envelop "} onClick={() => setModalShow(true)} />
                    <BsEnvelopeOpen className={!modalShow ? "envelop" : "closed-envelop "} />
                    <h3 className={modalShow ? "envelop" : "clickHere "}>Click Here To Read More</h3>
                </div>
            </div>
        </div>

    </>
    )
}

export default PersonalBrand;
