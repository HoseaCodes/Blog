import React from 'react';
import '../Tags/Tags.css'
import Reactjs from './React';
import JavaScript from './JavaScript';
import Nodejs from './Nodejs';
import Python from './Python';
import Django from './Django';

const Tags = () => {
    return (
        <>
            <div className='tags-container'>
                <input type="text"
                    className='project-search'
                    label="Search Articles"
                    placeholder="Type of Project"
                />
                <hr style={{ background: 'rgb(235,183,65)', width: '100%' }} />
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
        </>
    )

}

export default Tags;