import React from 'react';
import django from '../../icons/django.png'
import JS from '../../icons/JS.png'
import Reactt from '../../icons/Reactt.png'


const Snippet = () => {
    return (<>
        <div className='snippet-group'>
            <div className="snippet-logo">
                <img src={django} width='300' height='250' alt="JavaScript" />
            </div>
            <div className="snippet-info">
                <h2 className='snippet-header'>Django</h2>
                <p>Descripition </p>
                <ul className="tags">
                    <li><a href="#" className="tag">Python</a></li>
                    <li><a href="#" className="tag">Django</a></li>
                    <li><a href="#" className="tag">PostgreSQL</a></li>
                    <li><a href="#" className="tag">AJAX</a></li>
                </ul>
            </div>
        </div>
        <div className='snippet-group'>
            <div className="snippet-logo">
                <img src={JS} width='300' height='250' alt="JavaScript" />
            </div>
            <div className="snippet-info">
                <h2 className='snippet-header'>JavaScript</h2>
                <p>Description</p>
                <ul className="tags">
                    <li><a href="#" className="tag">JavaScript</a></li>
                    <li><a href="#" className="tag">AJAX</a></li>
                </ul>
            </div>
        </div>
        <div className='snippet-group'>
            <div className="snippet-logo">
                <img src={Reactt} width='300' height='300' alt="" />
            </div>
            <div className="snippet-info">
                <h2 className='snippet-header'>React</h2>
                <p>React is an open source web application plateform</p>
                <ul className="tags">
                    <li><a href="#" className="tag">React</a></li>
                    <li><a href="#" className="tag">JSX</a></li>
                    <li><a href="#" className="tag">MongoDB</a></li>
                    <li><a href="#" className="tag">AJAX</a></li>
                </ul>
            </div>
        </div>
    </>
    )
}

export default Snippet;