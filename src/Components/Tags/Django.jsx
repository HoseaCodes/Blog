import React from 'react';
import django from '../../icons/django.png'



const Django = () => {
    return (
        <div className='tag-group'>
            <div className="tag-logo">
                <img src={django} width='300' height='250' alt="JavaScript" />
            </div>
            <div className="tag-info">
                <h2 className='tag-header'>Django</h2>
                <p>Django </p>
                <label>1 Project</label>
            </div>
        </div>

    )
}

export default Django;