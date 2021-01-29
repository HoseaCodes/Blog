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
                    <li className="tag">Python</li>
                    <li className="tag">Django</li>
                    <li className="tag">PostgreSQL</li>
                    <li className="tag">AJAX</li>
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
                    <li className="tag">JavaScript</li>
                    <li className="tag">AJAX</li>
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
                    <li className="tag">React</li>
                    <li className="tag">JSX</li>
                    <li className="tag">MongoDB</li>
                    <li className="tag">AJAX</li>
                </ul>
            </div>
        </div>
    </>
    )
}

export default Snippet;