import React from 'react';
import '../Tags/Tags.css'
import Reactjs from './React';
import JavaScript from './JavaScript';
import Nodejs from './Nodejs';
import Python from './Python';
import Django from './Django';

const Tags = () => {
    return (
        <div className='tags-container'>
            <div className="tags-title">
                <h2 className='tag-title'> Project Details</h2>
                <hr />
            </div>
            <JavaScript />
            <hr />
            <Nodejs />
            <hr />
            <Reactjs />
            <hr />
            <Python />
            <hr />
            <Django />
        </div>

    )

}

export default Tags;