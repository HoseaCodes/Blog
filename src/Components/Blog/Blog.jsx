import React from 'react';
import StackOps from '../../icons/stack-operations.png';

import django from '../../icons/django.png'
import JS from '../../icons/JS.png'
import Reactt from '../../icons/Reactt.png'

const Blog = () => {
    return (
        <div className=''>
            <div className='snippet-group'>
                <div className='blog-card'>

                    <h2 className='snippet-header'>Stack</h2>
                    <div className="snippet-logo">
                        <img src={StackOps} width='300' height='250' alt="JavaScript" />
                    </div>
                    <div className="snippet-info">
                        <p>Description </p>
                        <ul className="tags">
                            <li><a href="#" className="tag">Data Structures</a></li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default Blog;